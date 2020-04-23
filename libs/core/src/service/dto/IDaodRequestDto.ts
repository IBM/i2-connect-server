

export interface IDaodRequestDto {

    /**
     * The query payload
     */
    payload: IDaodRequestPayloadDto;

}

export interface IDaodRequestPayloadDto {

    /**
     * If the service uses a client configuration of type 'FORM’, the conditions that a user has
        specified to refine their query
     */
    conditions?: IDaodConditionDto[];

    /**
     * The entities and links that a user has selected on the chart before running their query
     */
    seeds?: IDaodSeedsDto;

}

export interface IDaodConditionDto {

    /**
     * The identifier of the condition, as specified in the client configuration for the service
     */
    id: string;

    /**
     * The logical type of the value in the condition
     */
    logicalType: string;

    /**
     * The value that a user supplied for the condition
     */
    value: string;

}

export interface IDaodSeedsDto {

    /**
     * Data from the entity records that were specified as seeds for the request
     */
    entities?: IDaodSeedEntityDto[];

    /**
     * Data from the link records that were specified as seeds for the request
     */
    links?: IDaodSeedLinkDto[];

    /**
     * Schema information for the item types of the records that contributed to the data in
        entities and links
     */
    itemTypes?: IDaodItemTypesDto;

}

export interface IDaodSeedItemDto {


    /**
     * The security dimension values of the record identified by seedId
     */
    accessDimensionValues?:	IDaodSecurityDimensionAndValueDto[];
    
    /**
     * Free-form, custom information for the record identified by seedId
     */
    extensions?: IDaodSeedExtensionsDto;

    /**
     * The label of the record identified by seedId
     */
    label?: string;

    /**
     * The property data of the record identified by seedId
     */
    properties?: IDaodSeedPropertiesDto;
    
    /**
     * 	The identifier of a seed record
     */
    seedId:	IDaodSeedIdDto | string;
    
    /**
     * The source identifiers of a seed record
     */
    sourceIds:	IDaodOriginIdentifierDto[];

    /**
     * The type identifier of the record identified by seedId
     */
    typeId:	string;

}

export interface IDaodSeedEntityDto extends IDaodSeedItemDto {

}

export interface IDaodSeedLinkDto extends IDaodSeedItemDto {

    /**
     * 	The identifier of the record at the “from” end of the link record identified by seedId
     */
    fromEndId: IDaodSeedIdDto | string;

    /**
     * The type identifier of the record at the “from” end of the link record identified by seedId
     */
    fromEndTypeId: string;

    /**
     * 	The identifier of the record at the “to” end of the link record identified by seedId
     */
    toEndId: IDaodSeedIdDto | string;

    /**
     * The type identifier of the record at the “to” end of the link record identified by seedId
     */
    toEndTypeId: string;

    /**
     * The direction of the link record identified by seedId, which overrides any default setting
     */
    linkDirection: string;

}

export interface IDaodSecurityDimensionAndValueDto {

    /**
     * The identifier of the security dimension that has the values in ids
     */
    dimensionId: string;


    /**
     * The identifiers of values in the security dimension with dimensionId
     */
    ids: string[];

}

export interface IDaodSeedExtensionsDto {

}

export interface IDaodSeedPropertiesDto {

}

export interface IDaodSeedIdDto {

}

export interface IDaodOriginIdentifierDto {

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

export interface IDaodItemTypesDto {

}

export interface IDaodItemTypeDto {

    /**
     * The display name for this item type in the i2 Analyze schema
     */
    displayName?: string;
    
    /**
     * The property types of this item type in the i2 Analyze schema
     */
    propertyTypes?: IDaodItemTypePropertiesDto;
    
    /**
     * The identifier of the semantic type for this item type in the i2 Analyze schema

     */
    semanticTypeId?: string

}

export interface IDaodItemTypePropertiesDto {

}

export interface IDaodItemTypePropertyTypeDto {

    /**
     * The display name for this property type in the i2 Analyze schema
     */
    displayName?: string;
    
    /**
     * The logical type for this property type in the i2 Analyze schema
     */
    logicalType?: string;
    
    /**
     * The identifier of the semantic type for this property type in the i2 Analyze schema

     */
    semanticTypeId?: string

}
