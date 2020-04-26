
export interface IDaodResultsDto {

    entities: IDaodEntityDto[];
    links: IDaodLinkDto[];

}

export interface IDaodItemDto {

    id: IDaodItemIdDto | string;
    properties?: IDaodItemPropertiesDto;
    sourceReference?: IDaodSourceReferenceDto;
    typeId: string;
    version?: number;

}

export interface IDaodEntityDto extends IDaodItemDto {


}

export interface IDaodLinkDto extends IDaodItemDto {

    fromEndId: IDaodItemIdDto | string;
    linkDirection: string;
    toEndId: IDaodItemIdDto | string;
}

export interface IDaodItemPropertiesDto {

}

export interface IDaodItemIdDto {

}

export interface IDaodSourceReferenceDto {

    id?: string
    source:	IDaodSourceReferenceInfoDto;
    userModifiable?: boolean;
    
}

export interface IDaodSourceReferenceInfoDto {

    description?: string;
    image?: string;
    location?: string;    
    name: string;
    type?: string;
    
}
