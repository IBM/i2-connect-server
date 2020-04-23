import { FormConditionLogicalTypeEnum,
         LinkDirectionEnum } from "../../config/marshalers/ConnectorConfigMarshaler";

import { IDaodRequestDto, IDaodRequestPayloadDto, IDaodConditionDto, IDaodSeedsDto, 
         IDaodSeedEntityDto, IDaodSeedLinkDto, IDaodSeedExtensionsDto, IDaodSeedPropertiesDto, 
         IDaodSeedIdDto, IDaodOriginIdentifierDto, IDaodItemTypesDto, IDaodItemTypeDto, 
         IDaodItemTypePropertiesDto, IDaodItemTypePropertyTypeDto,
         IDaodSecurityDimensionAndValueDto } from "../dto/IDaodRequestDto";

export interface IDaodRequest {

    /**
     * The query payload
     */
    payload: IDaodRequestPayload;

}

export interface IDaodRequestPayload {

    /**
     * If the service uses a client configuration of type 'FORM’, the conditions that a user has
        specified to refine their query
     */
    conditions?: IDaodCondition[];

    /**
     * The entities and links that a user has selected on the chart before running their query
     */
    seeds?: IDaodSeeds;

}

export interface IDaodCondition {

    /**
     * The identifier of the condition, as specified in the client configuration for the service
     */
    id: string;

    /**
     * The logical type of the value in the condition
     */
    logicalType: FormConditionLogicalTypeEnum;

    /**
     * The value that a user supplied for the condition
     */
    value: string;

}

export interface IDaodSeeds {

    /**
     * Data from the entity records that were specified as seeds for the request
     */
    entities?: IDaodSeedEntity[];

    /**
     * Data from the link records that were specified as seeds for the request
     */
    links?: IDaodSeedLink[];

    /**
     * Schema information for the item types of the records that contributed to the data in
        entities and links
     */
    itemTypes?: IDaodItemTypes;

}

export interface IDaodSeedItem {

    /**
     * The security dimension values of the record identified by seedId
     */
    accessDimensionValues?:	IDaodSecurityDimensionAndValue[];
    
    /**
     * Free-form, custom information for the record identified by seedId
     */
    extensions?: IDaodSeedExtensions;

    /**
     * The label of the record identified by seedId
     */
    label?: string;

    /**
     * The property data of the record identified by seedId
     */
    properties?: IDaodSeedProperties;
    
    /**
     * 	The identifier of a seed record
     */
    seedId:	IDaodSeedId | string;
    
    /**
     * The source identifiers of a seed record
     */
    sourceIds:	IDaodOriginIdentifier[];

    /**
     * The type identifier of the record identified by seedId
     */
    typeId:	string;

}

export interface IDaodSeedEntity extends IDaodSeedItem {
    
}

export interface IDaodSeedLink extends IDaodSeedItem {

    /**
     * 	The identifier of the record at the “from” end of the link record identified by seedId
     */
    fromEndId: IDaodSeedId | string;

    /**
     * The type identifier of the record at the “from” end of the link record identified by seedId
     */
    fromEndTypeId: string;

    /**
     * 	The identifier of the record at the “to” end of the link record identified by seedId
     */
    toEndId: IDaodSeedId | string;

    /**
     * The type identifier of the record at the “to” end of the link record identified by seedId
     */
    toEndTypeId: string;

    /**
     * The direction of the link record identified by seedId, which overrides any default setting
     */
    linkDirection: LinkDirectionEnum;

}

export interface IDaodSecurityDimensionAndValue {

    /**
     * The identifier of the security dimension that has the values in ids
     */
    dimensionId: string;


    /**
     * The identifiers of values in the security dimension with dimensionId
     */
    ids: string[];

}

export interface IDaodSeedExtensions {

}

export interface IDaodSeedProperties {

}

export interface IDaodSeedId {

}

export interface IDaodOriginIdentifier {

    /**
     * The identifier of the item type of the record that has this origin identifier
     */
    itemTypeId?: string;
    
    /**
     * The values that identify some data in its original source
     */
    key: string[];
    
    /**
     * The type of this origin identifier
     */
    type: string

}

export interface IDaodItemTypes {

}

export interface IDaodItemType {

    /**
     * The display name for this item type in the i2 Analyze schema
     */
    displayName?: string;
    
    /**
     * The property types of this item type in the i2 Analyze schema
     */
    propertyTypes?: IDaodItemTypeProperties;
    
    /**
     * The identifier of the semantic type for this item type in the i2 Analyze schema

     */
    semanticTypeId?: string

}

export interface IDaodItemTypeProperties {

}

export interface IDaodItemTypePropertyType {

    /**
     * The display name for this property type in the i2 Analyze schema
     */
    displayName?: string;
    
    /**
     * The logical type for this property type in the i2 Analyze schema
     */
    logicalType?: PropertyLogicalTypeEnum;
    
    /**
     * The identifier of the semantic type for this property type in the i2 Analyze schema

     */
    semanticTypeId?: string

}

export enum PropertyLogicalTypeEnum {
    SINGLE_LINE_STRING, 
    MULTIPLE_LINE_STRING, 
    DATE, 
    TIME,
    DATE_AND_TIME, 
    BOOLEAN, 
    INTEGER, 
    DOUBLE, 
    DECIMAL, 
    DOCUMENT, 
    XML, 
    PICTURE, 
    SELECTED_FROM, 
    SUGGESTED_FROM, 
    GEOSPATIAL
}

export class DaodRequestMarshaler {

    public static marshalFromDto(dto: IDaodRequestDto): IDaodRequest {
        if (!dto) {
            throw new Error("Request can't be empty or null.");
        }
        if (!dto.payload) {
            throw new Error("Request has no payload property.");
        }
        return {
            payload: DaodRequestPayloadMarshaler.marshalFromDto(dto.payload)
        };
    }

}

export class DaodRequestPayloadMarshaler {

    public static marshalFromDto(dto: IDaodRequestPayloadDto): IDaodRequestPayload {
        return {
            conditions: dto.conditions && dto.conditions.map((s) => DaodConditionMarshaler.marshalFromDto(s)),
            seeds: dto.seeds && DaodSeedMarshaler.marshalFromDto(dto.seeds)
        };
    }

}

export class DaodConditionMarshaler {

    public static marshalFromDto(dto: IDaodConditionDto): IDaodCondition {
        if (!dto.id) {
            throw new Error("Condition has no id property.");
        }
        if (!dto.logicalType) {
            throw new Error("Condition has no logicalType property.");
        }
        return {
            id: dto.id,
            logicalType: FormConditionLogicalTypeEnum[dto.logicalType],
            value: dto.value
        };
    }

}

export class DaodSeedMarshaler {

    public static marshalFromDto(dto: IDaodSeedsDto): IDaodSeeds {
        return {
            entities: dto.entities && dto.entities.map((s) => DaodSeedEntityMarshaler.marshalFromDto(s)),
            links: dto.links && dto.links.map((s) => DaodSeedLinkMarshaler.marshalFromDto(s)),
            itemTypes: dto.itemTypes && DaodItemTypesMarshaler.marshalFromDto(dto.itemTypes)
        };
    }

}

export class DaodSeedEntityMarshaler {

    public static marshalFromDto(dto: IDaodSeedEntityDto): IDaodSeedEntity {
        if (!dto.seedId) {
            throw new Error("Entity seed has no seedIds property.");
        }
        if (!dto.sourceIds) {
            throw new Error("Entity seed has no sourceIds property.");
        }
        if (!dto.typeId) {
            throw new Error("Entity seed has no typeId property.");
        }
        return {
            accessDimensionValues:
                dto.accessDimensionValues &&
                dto.accessDimensionValues.map((s) => DaodSecurityDimensionAndValueMarshaler.marshalFromDto(s)),
            extensions: dto.extensions && DaodSeedExtensionsMarshaler.marshalFromDto(dto.extensions),
            label: dto.label,
            properties: dto.properties && DaodSeedPropertiesMarshaler.marshalFromDto(dto.properties),
            seedId:	DaodSeedIdMarshaler.marshalFromDto(dto.seedId),
            sourceIds: dto.sourceIds.map((s) => DaodOriginIdentifierMarshaler.marshalFromDto(s)),
            typeId:	dto.typeId
        };
    }

}

export class DaodSeedLinkMarshaler {

    public static marshalFromDto(dto: IDaodSeedLinkDto): IDaodSeedLink {
        if (!dto.seedId) {
            throw new Error("Link seed has no seedIds property.");
        }
        if (!dto.sourceIds) {
            throw new Error("Link seed has no sourceIds property.");
        }
        if (!dto.typeId) {
            throw new Error("Link seed has no typeId property.");
        }
        if (!dto.typeId) {
            throw new Error("Link seed has no typeId property.");
        }
        if (!dto.fromEndId) {
            throw new Error("Link seed has no fromEndId property.");
        }
        if (!dto.fromEndTypeId) {
            throw new Error("Link seed has no fromEndTypeId property.");
        }
        if (!dto.toEndId) {
            throw new Error("Link seed has no toEndId property.");
        }
        if (!dto.toEndTypeId) {
            throw new Error("Link seed has no toEndTypeId property.");
        }
        if (!dto.linkDirection) {
            throw new Error("Link seed has no linkDirection property.");
        }
        return {
            accessDimensionValues:
                dto.accessDimensionValues &&
                dto.accessDimensionValues.map((s) => DaodSecurityDimensionAndValueMarshaler.marshalFromDto(s)),
            extensions: dto.extensions && DaodSeedExtensionsMarshaler.marshalFromDto(dto.extensions),
            label: dto.label,
            properties: dto.properties && DaodSeedPropertiesMarshaler.marshalFromDto(dto.properties),
            seedId:	DaodSeedIdMarshaler.marshalFromDto(dto.seedId),
            sourceIds: dto.sourceIds && dto.sourceIds.map((s) => DaodOriginIdentifierMarshaler.marshalFromDto(s)),
            typeId:	dto.typeId,
            fromEndTypeId: dto.fromEndTypeId,
            fromEndId: DaodSeedIdMarshaler.marshalFromDto(dto.fromEndId),
            toEndTypeId: dto.toEndTypeId,
            toEndId: DaodSeedIdMarshaler.marshalFromDto(dto.toEndId),
            linkDirection: LinkDirectionEnum[dto.linkDirection]
        };
    }

}

export class DaodSecurityDimensionAndValueMarshaler {

    public static marshalFromDto(dto: IDaodSecurityDimensionAndValueDto): IDaodSecurityDimensionAndValue {
        if (!dto.dimensionId) {
            throw new Error("SecurityDimensionAndValue has no dimensionId property.");
        }
        if (!dto.ids) {
            throw new Error("SecurityDimensionAndValue has no ids property.");
        }
        return {
            dimensionId: dto.dimensionId,
            ids: dto.ids
        };
    }

}

export class DaodSeedExtensionsMarshaler {

    public static marshalFromDto(dto: IDaodSeedExtensionsDto): IDaodSeedExtensions {
        // simply return the json object as recieved (no other validation below this level)
        return dto as IDaodSeedExtensions;
    }

}

export class DaodSeedPropertiesMarshaler {

    public static marshalFromDto(dto: IDaodSeedPropertiesDto): IDaodSeedProperties {
        // simply return the json object as recieved (no other validation below this level)
        return dto as IDaodSeedProperties;
    }

}

export class DaodSeedIdMarshaler {

    public static marshalFromDto(dto: IDaodSeedIdDto | string): IDaodSeedId | string {
        if (typeof dto === 'string') {
            return dto as string;
        } else {
            // simply return the json object as recieved (no other validation below this level)
            return dto as IDaodSeedId; 
        }
    }

}

export class DaodOriginIdentifierMarshaler {

    public static marshalFromDto(dto: IDaodOriginIdentifierDto): IDaodOriginIdentifier {
        if (!dto.key) {
            throw new Error("OriginIdentifier has no key property.");
        }
        if (!dto.type) {
            throw new Error("OriginIdentifier has no type property.");
        }
        return {
            itemTypeId: dto.itemTypeId,
            key: dto.key,
            type: dto.type
        };
    }

}

export class DaodItemTypesMarshaler {

    public static marshalFromDto(dto: IDaodItemTypesDto): IDaodItemTypes {
        // simply return the json object as recieved (no other validation below this level)
        return dto as IDaodItemTypes;
    }

}

export class DaodItemTypeMarshaler {

    public static marshalFromDto(dto: IDaodItemTypeDto): IDaodItemType {
        return {
            displayName: dto.displayName,
            propertyTypes: dto.propertyTypes && DaodItemTypePropertiesMarshaler.marshalFromDto(dto.propertyTypes),
            semanticTypeId: dto.semanticTypeId
        };
    }

}

export class DaodItemTypePropertiesMarshaler {

    public static marshalFromDto(dto: IDaodItemTypePropertiesDto): IDaodItemTypeProperties {
        // simply return the json object as recieved (no other validation below this level)
        return dto as IDaodItemTypeProperties;
    }

}

export class DaodItemTypePropertyTypeMarshaler {

    public static marshalFromDto(dto: IDaodItemTypePropertyTypeDto): IDaodItemTypePropertyType {
        return {
            displayName: dto.displayName,
            logicalType: PropertyLogicalTypeEnum[dto.logicalType],
            semanticTypeId: dto.semanticTypeId,
        };
    }

}
