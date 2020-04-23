import { Injectable, Logger } from '@nestjs/common';
import { ITypeMap, IItemTypeMapping, IPropertyMapping } from './marshalers/TypeMapMarshaler';
import { TypeMapMarshaler } from './marshalers/TypeMapMarshaler';
import { UtilSettings, ISettingsItemData } from '../util/settings';
import { IConnectorSetting } from '../manifest/marshalers/ConnectorManifestMarshaler';
import { IConnectorTypeMapItem } from './interfaces/ITypeMapItem';

export enum PropertyMappingIdTypeEnum {
    SCHEMA_PROPERTY_ID,
    TYPEMAP_PROPERTY_ID
}

export interface IConnectorTypeMapService {
    getConnectorTypeMapItems(typeMapsSetting: IConnectorSetting): Promise<IConnectorTypeMapItem[]>;
}

@Injectable()
export class ConnectorTypeMapService implements IConnectorTypeMapService { // implements OnModuleInit {

    constructor() {}   

    public async getConnectorTypeMapItems(typeMapsSetting: IConnectorSetting): Promise<IConnectorTypeMapItem[]> {
        const settingsValue = await UtilSettings.getSettingsValue(typeMapsSetting);
        // assumed that will be getting an array of item data
        const itemDataArray = settingsValue.value as ISettingsItemData[];
        return Promise.all(itemDataArray.map(async itemData => {
            const typeMapDto = JSON.parse(itemData.data); 
            return {
                siteId: itemData.id,
                typeMap: TypeMapMarshaler.marshalFromDto(typeMapDto)
            }
        }));
    }
    
    public static findConnectorTypeMapItem(typeMapItems: IConnectorTypeMapItem[], siteId: string): IConnectorTypeMapItem {
        return typeMapItems && typeMapItems.find(item => item.siteId === siteId);
    }

    public static getItemTypeMapping(typeMap: ITypeMap, typeId: string): IItemTypeMapping {
        let typeMapping: IItemTypeMapping;
        // try entity first
        typeMapping = typeMap.entityMappings.find(mapping => mapping.id === typeId);
        if (!typeMapping) {
            // now try links
            typeMapping = typeMap.linkMappings.find(mapping => mapping.id === typeId);
        }
        return typeMapping;
    }

    public static getPropertyTypeMapping(itemTypeMapping: IItemTypeMapping, propertyId: string): IPropertyMapping {
        return itemTypeMapping.propertyMappings.find(property => property.id === propertyId);
    }

    public static getItemTypeMappingBySchemaId(typeMap: ITypeMap, schemaItemId: string): IItemTypeMapping {
        let typeMapping: IItemTypeMapping;
        // try entity first
        typeMapping = typeMap.entityMappings.find(mapping => mapping.schemaTypeId === schemaItemId);
        if (!typeMapping) {
            // now try links
            typeMapping = typeMap.linkMappings.find(mapping => mapping.schemaTypeId === schemaItemId);
        }
        return typeMapping;
    }

    public static getPropertyTypeMappingBySchemaId(itemTypeMapping: IItemTypeMapping, schemaPropertyId: string): IPropertyMapping {
        return itemTypeMapping.propertyMappings.find(property => property.schemaPropertyId === schemaPropertyId);
    }
    
    public static strictCheckAndLogging(message: string, strict: boolean): void {
        // log for debug purposes
        Logger.debug(message, 'TypeMapping');
        // if strict fail immediately
        if (strict) {
            throw Error(message);
        }
    }

    public static getMappedProperties(properties: any, itemTypeMapping: IItemTypeMapping, propertyIdType: PropertyMappingIdTypeEnum, strict: boolean): any {
        if (properties) {
            const keysMap = {};
            const deleteMap = [];
            for (const originalPropId in properties) {
                if (propertyIdType === PropertyMappingIdTypeEnum.TYPEMAP_PROPERTY_ID) {
                    // get property type mapping based on the typemap property id
                    const propertyMap = ConnectorTypeMapService.getPropertyTypeMapping(itemTypeMapping, originalPropId);
                    if (propertyMap && propertyMap.schemaPropertyId) {
                        // have a mapping so add property to list for renaming using schema property id
                        keysMap[originalPropId] = propertyMap.schemaPropertyId;
                    } else {
                        ConnectorTypeMapService.strictCheckAndLogging(`No schema mapping exists for property type map '${originalPropId}'`, strict);
                        // no mapping so add property to list for removal
                        deleteMap.push(originalPropId);
                    }
                } else if (propertyIdType === PropertyMappingIdTypeEnum.SCHEMA_PROPERTY_ID) {
                    // get property type mapping based on the schema property id
                    const propertyMap = ConnectorTypeMapService.getPropertyTypeMappingBySchemaId(itemTypeMapping, originalPropId);
                    if (propertyMap && propertyMap.id) {
                        // have a mapping so add property to list for renaming using type map property id
                        keysMap[originalPropId] = propertyMap.id;
                    } else {
                        ConnectorTypeMapService.strictCheckAndLogging(`No type mapping exists for property schema type '${originalPropId}'`, strict);
                        // no mapping so add property to list for removal
                        deleteMap.push(originalPropId);
                    }
                } else {
                    throw Error('Invalid PropertyMappingIdTypeEnum value');
                }
            }
            // delete first (to avoid name conflicts)
            for (const deletePropId of deleteMap) {
                delete properties[deletePropId];
            }
            // name rename any remaining keys
            return this.renameJsonKeys(keysMap, properties);
        } else {
            return {};
        }  
    }
    
    private static renameJsonKeys(keysMap: any, obj: any): any {
        return Object.keys(obj).reduce((acc, key) => ({
            ...acc,
            ...{ [keysMap[key] || key]: obj[key] }
        }), {});
    }

}