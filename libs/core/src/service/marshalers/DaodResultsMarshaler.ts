import { LinkDirectionEnum } from "../../config/marshalers/ConnectorConfigMarshaler";
import { IDaodResultsDto, IDaodEntityDto, IDaodLinkDto, IDaodItemPropertiesDto, IDaodItemIdDto, IDaodSourceReferenceDto, IDaodSourceReferenceInfoDto } from "../dto/IDaodResultsDto";

export interface IDaodResults {

    /**
     * The entity data returned from a connector
     */
    entities: IDaodEntity[];

    /**
     * The link data returned from a connector
     */
    links: IDaodLink[];

}

export interface IDaodItem {

    /**
     * The identifier of the data for a record in its source
     */
    id: IDaodItemId | string;
    
    /**
     * The property data for a record
     */
    properties?: IDaodItemProperties;

    /**
     * The source reference for a record
     */
    sourceReference?: IDaodSourceReference;

    /**
     * The type identifier for a record
     */
    typeId: string;
    
    /**
     * The version for a record
     */
    version?: number;

}

export type IDaodEntity = IDaodItem

export interface IDaodLink extends IDaodItem {

    /**
     * The identifier of the data for the record at the “from” end of a link
     */
    fromEndId: IDaodItemId | string;

    /**
     * The direction for a link record, which overrides any default setting
     */
    linkDirection: LinkDirectionEnum;

    /**
     * The identifier of the data for the record at the “to” end of a link
     */
    toEndId: IDaodItemId | string;
}

export interface IDaodItemProperties {

}

export interface IDaodItemId {

}

export interface IDaodSourceReference {

    /**
     * The unique identifier of this source reference
     */
    id?: string
    
    /**
     * The source reference details
     */
    source:	IDaodSourceReferenceInfo;
    
    /**
     * true if users can edit or delete this source reference; false otherwise, and by default
     */
    userModifiable?: boolean;
    
}

export interface IDaodSourceReferenceInfo {

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

export class DaodResultsMarshaler {

    public static marshalFromDto(dto: IDaodResultsDto): IDaodResults {
        if (!dto) {
            throw new Error("Results can't be empty or null.");
        }
        return {
            entities: dto.entities && dto.entities.map((s) => DaodEntityMarshaler.marshalFromDto(s)),
            links: dto.links && dto.links.map((s) => DaodLinkMarshaler.marshalFromDto(s)),
        };
    }

    public static marshalToDto(results: IDaodResults): IDaodResultsDto {
        return {
            entities: results.entities && results.entities.map((s) => DaodEntityMarshaler.marshalToDto(s)),
            links: results.links && results.links.map((s) => DaodLinkMarshaler.marshalToDto(s)),
        };
    }

}

export class DaodEntityMarshaler {

    public static marshalFromDto(dto: IDaodEntityDto): IDaodEntity {
        if (!dto.id) {
            throw new Error("Entity has no id property.");
        }
        return {
            id: DaodItemIdMarshaler.marshalFromDto(dto.id),
            properties: dto.properties && DaodItemPropertiesMarshaler.marshalFromDto(dto.properties),
            sourceReference: dto.sourceReference && DaodSourceReferenceMarshaler.marshalFromDto(dto.sourceReference),
            typeId: dto.typeId,
            version: dto.version
        };
    }

    public static marshalToDto(entity: IDaodEntity): IDaodEntityDto {
        return {
            id: DaodItemIdMarshaler.marshalToDto(entity.id),
            properties: entity.properties && DaodItemPropertiesMarshaler.marshalToDto(entity.properties),
            sourceReference: entity.sourceReference && DaodSourceReferenceMarshaler.marshalToDto(entity.sourceReference),
            typeId: entity.typeId,
            version: entity.version
        };
    }

}

export class DaodLinkMarshaler {

    public static marshalFromDto(dto: IDaodLinkDto): IDaodLink {
        if (!dto.id) {
            throw new Error("Link has no id property.");
        }
        if (!dto.fromEndId) {
            throw new Error("Link has no fromEndId property.");
        }
        if (!dto.toEndId) {
            throw new Error("Link has no toEndId property.");
        }
        if (!dto.linkDirection) {
            throw new Error("Link has no linkDirection property.");
        }
        return {
            id: DaodItemIdMarshaler.marshalFromDto(dto.id),
            properties: dto.properties && DaodItemPropertiesMarshaler.marshalFromDto(dto.properties),
            sourceReference: dto.sourceReference && DaodSourceReferenceMarshaler.marshalFromDto(dto.sourceReference),
            typeId: dto.typeId,
            version: dto.version,
            fromEndId: DaodItemIdMarshaler.marshalFromDto(dto.fromEndId),
            toEndId: DaodItemIdMarshaler.marshalFromDto(dto.toEndId),
            linkDirection: LinkDirectionEnum[dto.linkDirection]
        };
    }

    public static marshalToDto(link: IDaodLink): IDaodLinkDto {
        return {
            id: DaodItemIdMarshaler.marshalToDto(link.id),
            properties: link.properties && DaodItemPropertiesMarshaler.marshalToDto(link.properties),
            sourceReference: link.sourceReference && DaodSourceReferenceMarshaler.marshalToDto(link.sourceReference),
            typeId: link.typeId,
            version: link.version,
            fromEndId: DaodItemIdMarshaler.marshalToDto(link.fromEndId),
            toEndId: DaodItemIdMarshaler.marshalToDto(link.toEndId),
            linkDirection: LinkDirectionEnum[link.linkDirection]
        };
    }

}

export class DaodItemPropertiesMarshaler {

    public static marshalFromDto(dto: IDaodItemPropertiesDto): IDaodItemProperties {
        // simply return the json object as recieved (no other validation below this level)
        return dto as IDaodItemPropertiesDto;
    }

    public static marshalToDto(itemProperties: IDaodItemProperties): IDaodItemPropertiesDto {
        // simply return the json object as recieved (no other validation below this level)
        return itemProperties as IDaodItemPropertiesDto;
    }

}

export class DaodItemIdMarshaler {

    public static marshalFromDto(dto: IDaodItemIdDto | string): IDaodItemId | string {
        if (typeof dto === 'string') {
            return dto as string;
        } else {
            // simply return the json object as recieved (no other validation below this level)
            return dto as IDaodItemIdDto; 
        }
    }

    public static marshalToDto(id: IDaodItemId | string): IDaodItemIdDto | string {
        if (typeof id === 'string') {
            return id as string;
        } else {
            // simply return the json object as recieved (no other validation below this level)
            return id as IDaodItemIdDto; 
        }
    }

}

export class DaodSourceReferenceMarshaler {

    public static marshalFromDto(dto: IDaodSourceReferenceDto): IDaodSourceReference {
        if (!dto.source) {
            throw new Error("Source reference has no source property.");
        }
        return {
            id: dto.id,
            source: DaodSourceReferenceInfoMarshaler.marshalFromDto(dto.source),
            userModifiable: dto.userModifiable
        };
    }

    public static marshalToDto(sourceReference: IDaodSourceReference): IDaodSourceReferenceDto {
        return {
            id: sourceReference.id,
            source: DaodSourceReferenceInfoMarshaler.marshalToDto(sourceReference.source),
            userModifiable: sourceReference.userModifiable
        };
    }

}

export class DaodSourceReferenceInfoMarshaler {

    public static marshalFromDto(dto: IDaodSourceReferenceInfoDto): IDaodSourceReferenceInfo {
        if (!dto.name) {
            throw new Error("Source reference info has no name property.");
        }
        return {
            description: dto.description,
            image: dto.image,
            location: dto.location,
            name: dto.name,
            type: dto.type
        };
    }

    public static marshalToDto(info: IDaodSourceReferenceInfo): IDaodSourceReferenceInfoDto {
        return {
            description: info.description,
            image: info.image,
            location: info.location,
            name: info.name,
            type: info.type
        };
    }

}
