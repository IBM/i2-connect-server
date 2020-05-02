import { IDaodRequest, IDaodOriginIdentifier, IDaodSeedItem, IDaodSeedLink, IDaodSeedEntity, IDaodRequestPayload } from "./marshalers/DaodRequestMarshaler";
import { FormConditionLogicalTypeEnum } from "../config/marshalers/ConnectorConfigMarshaler";
import { ITypeMap } from "../typemap/marshalers/TypeMapMarshaler";
import { ConnectorTypeMapService, PropertyMappingIdTypeEnum } from "../typemap/typemap.service";
import { IServiceRequestQuery } from "./marshalers/ServiceRequestQueryMarshaler";
import { IServiceRequestParams } from "./marshalers/ServiceRequestParamsMarshaler";
import { IServiceRequestHeaders } from "./marshalers/ServiceRequestHeadersMarshaler";

export interface IConnectorServiceRequest {

    readonly query: IServiceRequestQuery;
    readonly params: IServiceRequestParams;
    readonly mappedPayload: IDaodRequestPayload;

    getHeader(key: string): string;
    getConditionValue<T extends string | boolean | number>(conditionId: string): T;
    extractExternalIdsFromI2ConnectSources(sourceIds: IDaodOriginIdentifier[]): Set<string>
    
}

export class ConnectorServiceRequest implements IConnectorServiceRequest {

    private constructor(
        private _requestQuery: IServiceRequestQuery,
        private _requestParams: IServiceRequestParams,
        private _requestHeaders: IServiceRequestHeaders,
        private _mappedPayload: IDaodRequestPayload
    ) {}

    public get query(): IServiceRequestQuery {
        return this._requestQuery;
    }

    public get params(): IServiceRequestParams {
        return this._requestParams;
    }

    public get headers(): IServiceRequestHeaders {
        return this._requestHeaders;
    }

    public get mappedPayload(): IDaodRequestPayload {
        return this._mappedPayload;
    }

    public static createConnectorServiceRequest(
        daodRequest: IDaodRequest, 
        requestQuery: IServiceRequestQuery,
        requestParams: IServiceRequestParams,
        requestHeaders: IServiceRequestHeaders,
        typeMap: ITypeMap,
    ) : IConnectorServiceRequest {
        const mappedDaodRequest = this.getMappedRequest(daodRequest, typeMap, requestQuery.strict);
        return new ConnectorServiceRequest(requestQuery, requestParams, requestHeaders, mappedDaodRequest.payload);
    }    

    private static getMappedRequest(request: IDaodRequest, typeMap: ITypeMap, strict: boolean): IDaodRequest {
        if (request.payload && request.payload.seeds) {
            // clone - so don't update the original
            const siteRequest = JSON.parse(JSON.stringify(request)) as IDaodRequest;
            siteRequest.payload.seeds.entities = this.mapSeedEntities(siteRequest.payload.seeds.entities, typeMap, strict);
            siteRequest.payload.seeds.links = this.mapSeedLinks(siteRequest.payload.seeds.links, typeMap, strict);
            return siteRequest;
        } else {
            return request;
        }
    }

    private static mapSeedEntities(seedEntities: IDaodSeedEntity[], typeMap: ITypeMap, strict: boolean): IDaodSeedEntity[] {
        return this.mapSeedItems(seedEntities, typeMap, strict) as IDaodSeedEntity[];
    }
    
    private static mapSeedLinks(seedLinks: IDaodSeedLink[], typeMap: ITypeMap, strict: boolean): IDaodSeedLink[] {
        return this.mapSeedItems(seedLinks, typeMap, strict) as IDaodSeedLink[];
    }

    private static mapSeedItems(seeds: IDaodSeedItem[], typeMap: ITypeMap, strict: boolean): IDaodSeedItem[] {
        if (seeds) {
            return seeds.reduce((mappedSeeds, seed) => {
                const typeMapping = ConnectorTypeMapService.getItemTypeMappingBySchemaId(typeMap, seed.typeId);
                if (typeMapping && typeMapping.id) {
                    seed.typeId = typeMapping.id;
                    seed.properties = ConnectorTypeMapService.getMappedProperties(seed.properties, typeMapping, 
                        PropertyMappingIdTypeEnum.SCHEMA_PROPERTY_ID, strict);
                    seed.sourceIds = this.mapSeedSourceIds(seed.sourceIds, typeMap, strict);
                    mappedSeeds.push(seed);
                } else {
                    ConnectorTypeMapService.strictCheckAndLogging(`No type mapping exists for seed schema type '${seed.typeId}'`, strict);
                }
                return mappedSeeds;
            }, []);
        } else {
            return [];
        }
    }

    private static mapSeedSourceIds(sourceIds: IDaodOriginIdentifier[], typeMap: ITypeMap, strict: boolean): IDaodOriginIdentifier[] {
        if (sourceIds) {
            return sourceIds.reduce((mappedSourceIds, sourceId) => {
                if (sourceId.itemTypeId) {
                    const typeMapping = ConnectorTypeMapService.getItemTypeMappingBySchemaId(typeMap, sourceId.itemTypeId);
                    if (typeMapping && typeMapping.id) {
                        sourceId.itemTypeId = typeMapping.id;
                        mappedSourceIds.push(sourceId);
                    } else {
                        ConnectorTypeMapService.strictCheckAndLogging(`No type mapping exists for seed sourceId schema type '${sourceId.itemTypeId}'`, strict);
                    }
                }
                return mappedSourceIds;
            }, []);
        } else {
            return [];
        }
    }

    /**
     * Returns the value for a specific condition within a search request, if it exists
     * @param request The search request sent by i2 Analyze
     * @param conditionId The condition id
     */
    public getConditionValue<T extends string | boolean | number>(conditionId: string): T {
        const condition = this._mappedPayload.conditions && this._mappedPayload.conditions.find(x => x.id === conditionId);
        let value = null;
        if (condition) {
            switch (condition.logicalType) {
                case FormConditionLogicalTypeEnum.SINGLE_LINE_STRING:
                case FormConditionLogicalTypeEnum.MULTI_LINE_STRING:
                case FormConditionLogicalTypeEnum.SELECTED_FROM:
                case FormConditionLogicalTypeEnum.SUGGESTED_FROM:
                    value = condition.value;
                case FormConditionLogicalTypeEnum.DATE:
                case FormConditionLogicalTypeEnum.TIME:
                case FormConditionLogicalTypeEnum.DATE_AND_TIME:
                    const dateVal = new Date(condition.value);
                    value = dateVal.toUTCString();
                case FormConditionLogicalTypeEnum.BOOLEAN:
                    value = condition.value === "true"
                case FormConditionLogicalTypeEnum.GEOSPATIAL:
                    // nothing specific to check
                    value = condition.value as string;
                case FormConditionLogicalTypeEnum.DECIMAL:
                case FormConditionLogicalTypeEnum.DOUBLE:
                    value = Number.parseFloat(condition.value);
                case FormConditionLogicalTypeEnum.INTEGER:
                    value = Number.parseInt(condition.value);
                default:
                    value = condition.value as string;
            }
        }
        return value as T;
    }

    /**
     * Extracts external identifiers from the keys of i2 Connect source identifiers
     * @param {IDaodOriginIdentifier[]=} sourceIds - The source identifiers to query
     * @returns {Set<string>} - The set of external identifiers from i2 Connect sources
     */
    public extractExternalIdsFromI2ConnectSources(sourceIds: IDaodOriginIdentifier[]): Set<string> {
        // i2 Connect keys have the format [connectorId, itemTypeId, externalId]
        const externalIds = sourceIds ? sourceIds.filter(this.isI2ConnectSeed).map(s => s.key[2]) : [];
        return new Set(externalIds);
    }

    public getHeader(key: string): string {
        return this._requestHeaders ? this._requestHeaders[key] : null;
    }

    /**
     * Determines whether a source identifier is from the i2 Connect gateway
     * @param {IDaodOriginIdentifier} sourceId - The source identifier
     */
    private isI2ConnectSeed(sourceId: IDaodOriginIdentifier): boolean {
        return sourceId.type === "OI.DAOD";
    }
    

}