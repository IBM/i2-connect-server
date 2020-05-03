

export interface IDaodRequestDto {

    payload: IDaodRequestPayloadDto;

}

export interface IDaodRequestPayloadDto {

    conditions?: IDaodConditionDto[];
    seeds?: IDaodSeedsDto;

}

export interface IDaodConditionDto {

    id: string;
    logicalType: string;
    value: string;

}

export interface IDaodSeedsDto {

    entities?: IDaodSeedEntityDto[];
    links?: IDaodSeedLinkDto[];
    itemTypes?: IDaodItemTypesDto;

}

export interface IDaodSeedItemDto {

    accessDimensionValues?:	IDaodSecurityDimensionAndValueDto[];
    extensions?: IDaodSeedExtensionsDto;
    label?: string;
    properties?: IDaodSeedPropertiesDto;
    seedId:	IDaodSeedIdDto | string;
    sourceIds:	IDaodOriginIdentifierDto[];
    typeId:	string;

}

export type IDaodSeedEntityDto = IDaodSeedItemDto

export interface IDaodSeedLinkDto extends IDaodSeedItemDto {

    fromEndId: IDaodSeedIdDto | string;
    fromEndTypeId: string;
    toEndId: IDaodSeedIdDto | string;
    toEndTypeId: string;
    linkDirection: string;

}

export interface IDaodSecurityDimensionAndValueDto {

    dimensionId: string;
    ids: string[];

}

export interface IDaodSeedExtensionsDto {

}

export interface IDaodSeedPropertiesDto {

}

export interface IDaodSeedIdDto {

}

export interface IDaodOriginIdentifierDto {

    itemTypeId?: string;
    key: string[];
    type: string

}

export interface IDaodItemTypesDto {

}

export interface IDaodItemTypeDto {

    displayName?: string;
    propertyTypes?: IDaodItemTypePropertiesDto;
    semanticTypeId?: string

}

export interface IDaodItemTypePropertiesDto {

}

export interface IDaodItemTypePropertyTypeDto {

    displayName?: string;
    logicalType?: string;
    semanticTypeId?: string

}
