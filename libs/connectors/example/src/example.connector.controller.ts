// nest js
import { Controller, NotImplementedException } from '@nestjs/common';

// base connector components
import { BaseConnectorController, IBaseConnectorService, Connector } from '@app/core/connectors';
import { IServiceRequestParam, IConnectorServiceRequest, IDaodResults, IDaodValidationResponse } from '@app/core/service';

// the connector service itself
import { ExampleConnectorService } from './example.connector.service';
import { CONNECTOR_ID, CONTEXT_ROOT,
         SERVICE_NAME_EXAMPLESEARCH,
         SERVICE_NAME_EXAMPLESCHEMAEXTENSION, 
         SERVICE_NAME_EXAMPLESEEDEDSEARCH1, 
         SERVICE_NAME_EXAMPLESEEDEDSEARCH2, 
         SERVICE_NAME_EXAMPLESEEDEDSEARCH3, 
         SERVICE_NAME_EXAMPLESEEDEDSEARCH4 } from './constants';

@Controller(CONTEXT_ROOT)
export class ExampleConnectorController extends BaseConnectorController {

    constructor(@Connector(CONNECTOR_ID) protected baseConnectorService: IBaseConnectorService,
                private connectorService: ExampleConnectorService) {
        super();
    }

    async executeAquireRequest(
        requestParams: IServiceRequestParam,
        serviceRequest: IConnectorServiceRequest
    ): Promise<IDaodResults> {
        switch (requestParams.serviceName) {
            case SERVICE_NAME_EXAMPLESEARCH:
                return await this.connectorService.exampleSearchAquire(serviceRequest);
            case SERVICE_NAME_EXAMPLESEEDEDSEARCH1:
                return await this.connectorService.exampleSeededSearch1Aquire(serviceRequest);
            case SERVICE_NAME_EXAMPLESEEDEDSEARCH2:
                return await this.connectorService.exampleSeededSearch2Aquire(serviceRequest);
            case SERVICE_NAME_EXAMPLESEEDEDSEARCH3:
                return await this.connectorService.exampleSeededSearch3Aquire(serviceRequest);
            case SERVICE_NAME_EXAMPLESEEDEDSEARCH4:
                return await this.connectorService.exampleSeededSearch4Aquire(serviceRequest);
            case SERVICE_NAME_EXAMPLESCHEMAEXTENSION:
                return await this.connectorService.exampleSchemaExtensionAquire(serviceRequest);
            default:
                throw new NotImplementedException();
        } 
    }

    async executeValidateRequest(
        requestParams: IServiceRequestParam,
        serviceRequest: IConnectorServiceRequest
    ): Promise<IDaodValidationResponse> {
        switch (requestParams.serviceName) {
            case SERVICE_NAME_EXAMPLESEARCH:
                return await this.connectorService.exampleSearchValidate(serviceRequest);
            default:
                throw new NotImplementedException();
        }
    }

}
