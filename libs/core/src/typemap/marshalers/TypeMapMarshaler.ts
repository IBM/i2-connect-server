import { ITypeMapDto, ILinkMappingDto, IEntityMappingDto, IPropertyMappingDto } from "../dto/ITypeMapDto";

export interface ITypeMap {

    /**
     * Entity mappings for this type map
     */
    entityMappings: IEntityMapping[];

    /**
     * Link mappings for this type map
     */
    linkMappings: ILinkMapping[];

}

export interface IItemTypeMapping {

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
    propertyMappings: IPropertyMapping[];

}

export type IEntityMapping = IItemTypeMapping

export type ILinkMapping = IItemTypeMapping

export interface IPropertyMapping {

    /**
     * Unique id for this type (connector specific)
     */
    id: string;

    /**
     * Corresponding i2 Analyze schema type id (i2 Analyze deployment specific)
     */
    schemaPropertyId: string;

}

export class TypeMapMarshaler {

    public static marshalFromDto(dto: ITypeMapDto): ITypeMap {
        if (!dto.entityMappings) {
            throw new Error("Type map has no entityMappings property defined.");
        }
        if (!dto.linkMappings) {
            throw new Error("Type map has no linkMappings property defined.");
        }  
        return {
            entityMappings: dto.entityMappings.map((s) => EntityMappingMarshaler.marshalFromDto(s)),
            linkMappings: dto.linkMappings.map((s) => LinkMappingMarshaler.marshalFromDto(s)),
        };
    }

}

export class EntityMappingMarshaler {

    public static marshalFromDto(dto: IEntityMappingDto): IEntityMapping {
        if (!dto.propertyMappings) {
            throw new Error("Entity mapping has no propertyMappings property defined.");
        }
        if (!dto.id) {
            throw new Error("Entity mapping has no id property.");
        }
        if (!dto.schemaTypeId) {
            throw new Error("Entity mapping has no schemaId property.");
        }        
        return {
            id: dto.id,
            schemaTypeId: dto.schemaTypeId,
            propertyMappings: dto.propertyMappings.map((s) => PropertyMappingMarshaler.marshalFromDto(s)),
        };
    }

}

export class LinkMappingMarshaler {

    public static marshalFromDto(dto: ILinkMappingDto): ILinkMapping {
        if (!dto.propertyMappings) {
            throw new Error("Link mapping has no propertyMappings property defined.");
        }
        if (!dto.id) {
            throw new Error("Link mapping has no id property.");
        }
        if (!dto.schemaTypeId) {
            throw new Error("Link mapping has no schemaId property.");
        }       
        return {
            id: dto.id,
            schemaTypeId: dto.schemaTypeId,
            propertyMappings: dto.propertyMappings.map((s) => PropertyMappingMarshaler.marshalFromDto(s)),
        };
    }

}

export class PropertyMappingMarshaler {

    public static marshalFromDto(dto: IPropertyMappingDto): IPropertyMapping {
        if (!dto.id) {
            throw new Error("Entity mapping has no id property.");
        }
        if (!dto.schemaPropertyId) {
            throw new Error("Entity mapping has no schemaPropertyId property.");
        }       
        return {
            id: dto.id,
            schemaPropertyId: dto.schemaPropertyId,
        };
    }

}
