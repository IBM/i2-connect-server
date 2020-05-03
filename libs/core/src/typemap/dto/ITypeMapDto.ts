
export interface ITypeMapDto {

    /**
     * Entity mappings for this type map
     */
    entityMappings: IEntityMappingDto[];

    /**
     * Link mappings for this type map
     */
    linkMappings: ILinkMappingDto[];

}

export interface IItemTypeMappingDto {

    /**
     * Unique id for this type (connector specific)
     */
    id: string;

    /**
     * Corresponding i2 Analyze schema type id (i2 Analyze deployment specific)
     */
    schemaTypeId: string;

    /**
     * Property mappings for this entity/link type
     */
    propertyMappings: IPropertyMappingDto[];

}

export type IEntityMappingDto = IItemTypeMappingDto

export type ILinkMappingDto = IItemTypeMappingDto

export interface IPropertyMappingDto {

    /**
     * Unique id for this type (connector specific)
     */
    id: string;

    /**
     * Corresponding i2 Analyze schema type id (i2 Analyze deployment specific)
     */
    schemaPropertyId: string;

}