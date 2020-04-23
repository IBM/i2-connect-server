import { Injectable, Logger } from '@nestjs/common';
import { IConnectorConfig, ConnectorConfigMarshaler, IDefaultValues, IService, ISeedConstraints } from "./marshalers/ConnectorConfigMarshaler";
import { IConnectorConfigDto } from "./dto/ConnectorConfigDto";
import { IConnectorSetting } from '../manifest/marshalers/ConnectorManifestMarshaler';
import { UtilSettings, ISettingsItemData } from '../util/settings';
import { DEFAULT_QUERY_SITE_ID, DEFAULT_QUERY_STRICT } from '../constants';
import { ITypeMap } from '../typemap/marshalers/TypeMapMarshaler';
import { ConnectorTypeMapService } from '../typemap/typemap.service';

export interface IConnectorConfigService {
    getConnectorConfig(connectorSetting: IConnectorSetting): Promise<IConnectorConfig>;
}

@Injectable()
export class ConnectorConfigService implements IConnectorConfigService {

    constructor() {}    

    static getMappedConfig(connectorConfig: IConnectorConfig, typeMap: ITypeMap, siteId: string, strict: boolean): IConnectorConfig {
        // clone - so don't update the original
        const siteConnectorConfig = JSON.parse(JSON.stringify(connectorConfig)) as IConnectorConfig;
        this.mapDefaultValuesForSite(siteConnectorConfig.defaultValues, typeMap, strict);
        this.mapServiceUrlsforSite(siteConnectorConfig, siteId, strict);
        this.mapServicesForSite(siteConnectorConfig, typeMap, strict);

        return siteConnectorConfig;
    }

    static getConnectorConfigAsDto(connectorConfig: IConnectorConfig): IConnectorConfigDto {
        return ConnectorConfigMarshaler.marshalToDto(connectorConfig);
    }

    async getConnectorConfig(connectorSetting: IConnectorSetting): Promise<IConnectorConfig> {
        const settingsValue = await UtilSettings.getSettingsValue(connectorSetting);
        // assumed that will be getting item data returned
        const settingsItemData = settingsValue.value as ISettingsItemData;
        const configDto = JSON.parse(settingsItemData.data);
        return ConnectorConfigMarshaler.marshalFromDto(configDto);
    }


    private static mapServiceUrlsforSite(siteConnectorConfig: IConnectorConfig, siteId: string, strict: boolean): void {
        // update all urls to append the site id
        siteConnectorConfig.schemaUrl = siteConnectorConfig.schemaUrl
            ? `${siteConnectorConfig.schemaUrl}?${DEFAULT_QUERY_SITE_ID}=${siteId}&${DEFAULT_QUERY_STRICT}=${strict}`
            : undefined;
        siteConnectorConfig.chartingSchemesUrl = siteConnectorConfig.chartingSchemesUrl
            ? `${siteConnectorConfig.chartingSchemesUrl}?${DEFAULT_QUERY_SITE_ID}=${siteId}&${DEFAULT_QUERY_STRICT}=${strict}`
            : undefined;
        for (const service of siteConnectorConfig.services) {
            service.acquireUrl = `${service.acquireUrl}?${DEFAULT_QUERY_SITE_ID}=${siteId}&${DEFAULT_QUERY_STRICT}=${strict}`;
            service.validateUrl = service.validateUrl
                ? `${service.validateUrl}?${DEFAULT_QUERY_SITE_ID}=${siteId}&${DEFAULT_QUERY_STRICT}=${strict}`
                : undefined;
        }
    }

    private static mapDefaultValuesForSite(defaultValues: IDefaultValues, typeMap: ITypeMap, strict: boolean) {

        defaultValues.entityTypeId = defaultValues.entityTypeId
            ? this.mapDefaultValueItemType(typeMap, defaultValues.entityTypeId, strict)
            : undefined;
        defaultValues.linkTypeId = defaultValues.linkTypeId
            ? this.mapDefaultValueItemType(typeMap, defaultValues.linkTypeId, strict)
            : undefined;

    }

    private static mapDefaultValueItemType(typeMap: ITypeMap, typeId: string, strict: boolean): string {
        let schemaTypeId : string;
        const typeMapping = ConnectorTypeMapService.getItemTypeMapping(typeMap, typeId);
        if (typeMapping && typeMapping.schemaTypeId) {
            schemaTypeId = typeMapping.schemaTypeId;
        } else {
            ConnectorTypeMapService.strictCheckAndLogging(`No schema mapping exists for type map '${typeId}' in connector config default values.`, strict);
        }
        return schemaTypeId;
    }

    private static mapServicesForSite(siteConnectorConfig: IConnectorConfig, typeMap: ITypeMap, strict: boolean) {
        for (const service of siteConnectorConfig.services) {
            if (service.resultItemTypeIds) {
                service.resultItemTypeIds = this.mapResultItemTypeIds(service.resultItemTypeIds, typeMap, strict);
            }
            if (service.seedConstraints) {
                service.seedConstraints = this.mapServicesSeedConstraints(service.seedConstraints, typeMap, strict);
            }
        };
    }


    private static mapResultItemTypeIds(resultItemTypeIds: string[], typeMap: ITypeMap, strict: boolean): string[] {
        if (resultItemTypeIds) {
            return resultItemTypeIds.reduce((mappedItems, typeId) => {
                const typeMapping = ConnectorTypeMapService.getItemTypeMapping(typeMap, typeId);
                if (typeMapping && typeMapping.schemaTypeId) {
                    mappedItems.push(typeMapping.schemaTypeId);
                } else {
                    ConnectorTypeMapService.strictCheckAndLogging(`No schema mapping exists for result item type map ${typeId}`, strict);                
                }
                return mappedItems;
            }, []);
        } else {
            return [];
        }
    }

    private static mapServicesSeedConstraints(seedConstraints: ISeedConstraints, typeMap: ITypeMap, strict: boolean): ISeedConstraints {
        if (seedConstraints.seedTypes && seedConstraints.seedTypes.itemTypes) {
            seedConstraints.seedTypes.itemTypes = seedConstraints.seedTypes.itemTypes.reduce((mappedItems, item) => {
                if (item.id) {
                    const typeMapping = ConnectorTypeMapService.getItemTypeMapping(typeMap, item.id);
                    if (typeMapping && typeMapping.schemaTypeId) {
                        item.id = typeMapping.schemaTypeId; // set to the new id
                        mappedItems.push(item);
                    } else {
                        ConnectorTypeMapService.strictCheckAndLogging(`No schema mapping exists for seed constaint type map ${item.id}`, strict);
                    }
                } else {
                    // add as normal
                    mappedItems.push(item);
                }
                return mappedItems;
            }, []);
            
        }
        return seedConstraints;
    }

}