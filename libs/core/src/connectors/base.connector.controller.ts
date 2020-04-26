import { Get, Header, Logger, Ip, Query, Post, HttpCode, Body, Param } from '@nestjs/common';
import { IConnectorConfigDto } from '../config/dto/ConnectorConfigDto';
import { IBaseConnectorService } from './interfaces/IBaseConnectorService';
import { DEFAULT_URL_PATH_CONFIG, DEFAULT_URL_PATH_SCHEMA, DEFAULT_URL_PATH_CHARTINGSCHEMES, DEFAULT_PARAM_SERVICE, DEFAULT_PARAM_METHOD, DEFAULT_URL_PATH_RELOAD } from '../constants';
import { IConnectorServiceRequestFactory } from '../service/interfaces/IServiceRequestFactory';
import { IDaodRequest } from '../service/marshalers/DaodRequestMarshaler';
import { IConnectorServiceResponseFactory } from '../service/interfaces/IServiceResponseFactory';
import { IDaodResults } from '../service/marshalers/DaodResultsMarshaler';
import { IDaodValidationResponse } from '../service/marshalers/DaodValidationResponseMarshaler';
import { ConnectorServiceRequest, IConnectorServiceRequest } from '../service/ServiceRequest';
import { IConnectorServiceAquireResponse, ConnectorServiceAquireResponse } from '../service/ServiceAquireResponse';
import { IConnectorServiceValidateResponse, ConnectorServiceValidateResponse } from '../service/ServiceValidateResponse';
import { IServiceRequestQuery } from '../service/marshalers/ServiceRequestQueryMarshaler';
import { ServiceRequestQueryPipe } from '../service/pipes/ServiceRequestQuery.pipe';
import { ServiceRequestParamPipe } from '../service/pipes/ServiceRequestParam.pipe';
import { ServiceRequestBodyPipe } from '../service/pipes/ServiceRequestBody.pipe';
import { IServiceRequestParams, IServiceRequestMethodTypeEnum } from '../service/marshalers/ServiceRequestParamsMarshaler';
import { IDaodResultsDto } from '../service/dto/IDaodResultsDto';
import { IDaodValidationResponseDto } from '../service/dto/IDaodValidationResponseDto';
import { IReloadCacheResponseDto } from '../service';

export abstract class BaseConnectorController
        implements IConnectorServiceRequestFactory, IConnectorServiceResponseFactory {

    protected abstract baseConnectorService: IBaseConnectorService;

    constructor() {}

    /**
     * Config
     */
    @Get(DEFAULT_URL_PATH_CONFIG)
    public async getConnectorConfig(
        @Ip() sourceIp: string,
        @Query(ServiceRequestQueryPipe) query: IServiceRequestQuery
    ): Promise<IConnectorConfigDto> {
        this.logRequest('Get config', sourceIp, null, query, this.baseConnectorService.connectorName);
        return this.baseConnectorService.getConnectorConfigAsDto(query.siteid, query.strict);
    }

    /**
     * Schema
     */
    @Get(DEFAULT_URL_PATH_SCHEMA)
    @Header('content-type', 'text/xml')
    public async getConnectorSchema(
        @Ip() sourceIp: string,
        @Query(ServiceRequestQueryPipe) query: IServiceRequestQuery
    ): Promise<string> {
        this.logRequest('Get schema', sourceIp, null, query, this.baseConnectorService.connectorName);
        return this.baseConnectorService.getConnectorSchemaAsDto(query.siteid, query.strict);
    }

    /**
     * Charting Schemes
     */
    @Get(DEFAULT_URL_PATH_CHARTINGSCHEMES)
    @Header('content-type', 'text/xml')
    public async getConnectorChartingSchemes(
        @Ip() sourceIp: string,
        @Query(ServiceRequestQueryPipe) query: IServiceRequestQuery
    ): Promise<string> {
        this.logRequest('Get charting schemes', sourceIp, null, query, this.baseConnectorService.connectorName);
        return this.baseConnectorService.getConnectorChartingSchemesAsDto(query.siteid, query.strict);
    }

    @Post(`:${DEFAULT_PARAM_SERVICE}/:${DEFAULT_PARAM_METHOD}`)
    @HttpCode(200)
    async exampleSearchAquire(
        @Ip() sourceIp: string,
        @Body(ServiceRequestBodyPipe) request: IDaodRequest,
        @Query(ServiceRequestQueryPipe) query: IServiceRequestQuery,
        @Param(ServiceRequestParamPipe) params: IServiceRequestParams
    ): Promise<IDaodResultsDto | IDaodValidationResponse> {
        this.logRequest(`${params.serviceName}/${IServiceRequestMethodTypeEnum[params.methodType]}`, 
                        sourceIp, request, query, this.baseConnectorService.connectorName);
        const serviceRequest = this.createConnectorServiceRequest(request, query);
        const startTime = Date.now();
        const result = await this.executeRequest(params, serviceRequest);
        const endTime = Date.now();
        this.logResponse(`${params.serviceName}/${IServiceRequestMethodTypeEnum[params.methodType]}`,
                         sourceIp, request, this.baseConnectorService.connectorName, startTime, endTime);
        return result;
    }

    @Post(`${DEFAULT_URL_PATH_RELOAD}`)
    @HttpCode(200)
    async reloadCache(
        @Ip() sourceIp: string,
        @Query(ServiceRequestQueryPipe) query: IServiceRequestQuery
    ): Promise<IReloadCacheResponseDto> {
        this.logRequest(`Reload cache`, sourceIp, null, query, this.baseConnectorService.connectorName);
        return await this.baseConnectorService.reloadCachesAsync();
    }

    public createConnectorServiceRequest(
        daodRequest: IDaodRequest,
        requestQuery: IServiceRequestQuery
    ) : IConnectorServiceRequest {
        const typeMap = this.baseConnectorService.getTypeMap(requestQuery.siteid);
        return ConnectorServiceRequest.createConnectorServiceRequest(daodRequest, requestQuery, typeMap);
    }

    public createConnectorServiceAquireResponse(
        daodResults: IDaodResults, 
        requestQuery: IServiceRequestQuery
    ) : IConnectorServiceAquireResponse {
        const typeMap = this.baseConnectorService.getTypeMap(requestQuery.siteid);
        return ConnectorServiceAquireResponse.createConnectorServiceAquireResponse(daodResults, requestQuery, typeMap);
    }

    public createConnectorServiceValidateResponse(
        daodValidationResponse: IDaodValidationResponse, 
        requestQuery: IServiceRequestQuery
    ) : IConnectorServiceValidateResponse {
        return ConnectorServiceValidateResponse.createConnectorServiceAquireResponse(daodValidationResponse, requestQuery);
    }

    protected logRequest(requestName: string, sourceIp: string, payload: any, query: IServiceRequestQuery, context?: string) {
        Logger.log(`${requestName} request from '${sourceIp}' - siteId: ${query.siteid}, strict: ${query.strict}`, context);
        if (this.baseConnectorService.getSettingLogPayloads()) {
            Logger.debug(payload, context);
        }
    }

    protected logResponse(requestName: string, sourceIp: string, payload: any, context?: string, startTime?: number, endTime?: number) {
        const durationMillis = Math.abs(Math.round(endTime - startTime));
        Logger.log(`${requestName} response to '${sourceIp}' in ${durationMillis}ms`, context);
        if (this.baseConnectorService.getSettingLogPayloads()) {
            Logger.debug(payload, context);
        }
    }

    private async executeRequest<T>(
        requestParams: IServiceRequestParams,
        serviceRequest: IConnectorServiceRequest
    ): Promise<IDaodResultsDto | IDaodValidationResponseDto> {
        switch (requestParams.methodType) {
            case IServiceRequestMethodTypeEnum.ACQUIRE:
                const daodResults = await this.executeAquireRequest(requestParams, serviceRequest);
                return this.createConnectorServiceAquireResponse(daodResults, serviceRequest.requestQuery).mappedResultsDto;
            case IServiceRequestMethodTypeEnum.VALIDATE:
                const validateResponse = await this.executeValidateRequest(requestParams, serviceRequest);
                return this.createConnectorServiceValidateResponse(validateResponse, serviceRequest.requestQuery).validationResponseDto;
            default:
                throw Error('Unknown or invalid method type when executing service request.');
        }
    }

    abstract async executeAquireRequest(
        requestParams: IServiceRequestParams,
        serviceRequest: IConnectorServiceRequest
    ): Promise<IDaodResults>;

    abstract async executeValidateRequest(
        requestParams: IServiceRequestParams,
        serviceRequest: IConnectorServiceRequest
    ): Promise<IDaodValidationResponse>;

}
