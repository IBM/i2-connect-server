
export interface IDaodResultsDto {

    /**
     * The entity data returned from a connector
     */
    entities: IDaodEntityDto[];

    /**
     * The link data returned from a connector
     */
    links: IDaodLinkDto[];

}

export interface IDaodItemDto {

    /**
     * The identifier of the data for a record in its source
     */
    id: IDaodItemIdDto | string;
    
    /**
     * The property data for a record
     */
    properties?: IDaodItemPropertiesDto;

    /**
     * The source reference for a record
     */
    sourceReference?: IDaodSourceReferenceDto;

    /**
     * The type identifier for a record
     */
    typeId: string;
    
    /**
     * The version for a record
     */
    version?: number;

}

export interface IDaodEntityDto extends IDaodItemDto {


}

export interface IDaodLinkDto extends IDaodItemDto {

    /**
     * The identifier of the data for the record at the “from” end of a link
     */
    fromEndId: IDaodItemIdDto | string;

    /**
     * The direction for a link record, which overrides any default setting
     */
    linkDirection: string;

    /**
     * The identifier of the data for the record at the “to” end of a link
     */
    toEndId: IDaodItemIdDto | string;
}

export interface IDaodItemPropertiesDto {

}

export interface IDaodItemIdDto {

}

export interface IDaodSourceReferenceDto {

    /**
     * The unique identifier of this source reference
     */
    id?: string
    
    /**
     * The source reference details
     */
    source:	IDaodSourceReferenceInfoDto;
    
    /**
     * true if users can edit or delete this source reference; false otherwise, and by default
     */
    userModifiable?: boolean;
    
}

export interface IDaodSourceReferenceInfoDto {

    /**
     * The description of a source
     */
    description?: string;

    /**
     * The URL of an image of a source
     */
    image?: string;

    /**
     * The location of a source, which might be a URL
     */
    location?: string;    
    
    /**
     * The name of a source
     */
    name: string;
    
    /**
     * The type of a source
     */
    type?: string;
    
}
