import { IDaodRequest, IDaodOriginIdentifier, IDaodSeedItem, IDaodSeedLink, IDaodSeedEntity, IDaodRequestPayload } from "./marshalers/DaodRequestMarshaler";
import { FormConditionLogicalTypeEnum } from "../config/marshalers/ConnectorConfigMarshaler";
import { ITypeMap } from "../typemap/marshalers/TypeMapMarshaler";
import { ConnectorTypeMapService, PropertyMappingIdTypeEnum } from "../typemap/typemap.service";
import { IServiceRequestQuery } from "./marshalers/ServiceRequestQueryMarshaler";
import { IServiceRequestParams } from "./marshalers/ServiceRequestParamsMarshaler";
import { IServiceRequestHeaders } from "./marshalers/ServiceRequestHeadersMarshaler";
import { Logger } from "@nestjs/common";

export interface IConnectorServiceRequest {

    readonly query: IServiceRequestQuery;
    readonly params: IServiceRequestParams;
    readonly mappedPayload: IDaodRequestPayload;

    getHeader(key: string, isRequired?: boolean): string;
    getConditionValue<T extends string | boolean | number>(conditionId: string, isRequired?: boolean, defaultValue?: T): T;
    getIdsFromDaodSources(sourceIds: IDaodOriginIdentifier[], i2aConnectorId?: string, isRequired?: boolean): string[];
    getEntitySeeds(typeIdsFilter?: string[], totalCount?: number, isRequired?: boolean): IDaodSeedItem[];
    getLinkSeeds(typeIdsFilter?: string[], totalCount?: number, isRequired?: boolean): IDaodSeedItem[];
    getSeedProperty(seed: IDaodSeedItem, propertyName: string, isRequired?: boolean): any;
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
    public getConditionValue<T extends string | boolean | number>(conditionId: string, isRequired?: boolean, defaultValue?: T): T {
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
        if (!value && isRequired) {
            throw new Error(`Condition '${conditionId}' is required but no value received in payload.`);
        }
        return value ? value as T : defaultValue;
    }

    /**
     * Extracts external identifiers from the keys of i2 Connect source identifiers
     * @param {IDaodOriginIdentifier[]=} sourceIds - The source identifiers to query
     * @param {string} i2aConnectorId - Optional i2 Analyze connector id (as defined in the topology file)
     * @returns {Set<string>} - The set of external identifiers from i2 Connect sources
     */
    public getIdsFromDaodSources(sourceIds: IDaodOriginIdentifier[], i2aConnectorId?: string, isRequired?: boolean): string[] {
        // i2 Connect keys have the format [connectorId, itemTypeId, externalId]
        const externalIds = sourceIds ? sourceIds
            .filter(s => this.isI2ConnectSeed(s, i2aConnectorId))
            .map(s => s.key[2]) : [];
        if (externalIds.length === 0 && isRequired) {
            throw new Error(`No seeds from source '${i2aConnectorId}' received in request.`);
        } else {
            return externalIds;
        }  
    }

    public getHeader(key: string, isRequired?: boolean): string {
        const value = this._requestHeaders ? this._requestHeaders[key] : null;
        if (!value && isRequired) {
            throw new Error(`Header '${key}' is required but no value received in request.`);
        } else {
            return value;
        }
    }

    public getEntitySeeds(typeIdsFilter?: string[], totalCount: number = 0, isRequired?: boolean): IDaodSeedItem[] {
        let seeds = [];
        if (this.mappedPayload.seeds && 
            this.mappedPayload.seeds.entities &&
            this.mappedPayload.seeds.entities.length > 0) {
                seeds = this.getSeeds(this.mappedPayload.seeds.entities, typeIdsFilter);
        }
        if (seeds.length < totalCount && isRequired) {
            throw new Error(`Not enough valid seeds received in request.`);
        } else {
            return seeds;
        }        
    }
    
    public getLinkSeeds(typeIdsFilter?: string[], totalCount: number = 0, isRequired?: boolean) {
        let seeds = [];
        if (this.mappedPayload.seeds && 
            this.mappedPayload.seeds.links &&
            this.mappedPayload.seeds.links.length > 0) {
                return this.getSeeds(this.mappedPayload.seeds.links, typeIdsFilter);
        }
        if (seeds.length < totalCount && isRequired) {
            throw new Error(`Not enough valid seeds received in request.`);
        } else {
            return seeds;
        }        
    }

    public getSeedProperty(seed: IDaodSeedItem, propertyName: string, isRequired?: boolean): any {
        if (!seed) {
            throw new Error('Can not get property from an empty or missing seed.');
        }
        const propertyValue = seed.properties && seed.properties[propertyName];
        if (!propertyValue && isRequired) {
            throw new Error(`Property '${propertyName}', is missing or empty on seed ${seed.seedId}.`);
        }
        return propertyValue;
    }

    private getSeeds(seeds: IDaodSeedItem[], typeIdsFilter?: string[]) : IDaodSeedItem[] {
        return seeds.reduce((filteredSeeds: IDaodSeedItem[], seed: IDaodSeedItem) => {
            if (typeIdsFilter) {
                if (typeIdsFilter.includes(seed.typeId)) {
                    filteredSeeds.push(seed);
                }
            } else {
                filteredSeeds.push(seed);
            }
            return filteredSeeds;
        }, []);
    }

    /**
     * Determines whether a source identifier is from the i2 Connect gateway
     * and optionally from a specific connector source
     * @param {IDaodOriginIdentifier} sourceId - The source identifier
     * @param {string} i2aConnectorId - Optional i2 Analyze connector id (as defined in the topology file)
     */
    private isI2ConnectSeed(sourceId: IDaodOriginIdentifier, i2aConnectorId?: string): boolean {
        return i2aConnectorId
            ? sourceId.key[0] === i2aConnectorId && sourceId.type === "OI.DAOD"
            : sourceId.type === "OI.DAOD";
    }
    

}