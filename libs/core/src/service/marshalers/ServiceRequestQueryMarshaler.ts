import { IServiceRequestQueryDto } from "../dto/IServiceRequestQueryDto";

export interface IServiceRequestQuery {

    /**
     * Id of the site (i2 Analyze deployment) making the request - if it has been provided.
     */
    siteid?: string;

    /**
     * Whether the request should operate in strict mode for checking type mappings.  If true, then
     * any missing or invalid type mapping will throw an error.  If false, then missing or invalid
     * type ids will simply be ignored and removed from the request/response payloads.
     */
    strict?: boolean;
    
    /**
     * The version number attached to the request - if it has been provided.  This can allow the same
     * connector instance to support versioning, although an alternative is to deploy seperate
     * connector instances with different ids/context roots.
     */
    version?: string;

}

export class ServiceRequestQueryMarshaler {

    public static marshalFromDto(dto: IServiceRequestQueryDto): IServiceRequestQuery {
        return {
            siteid: dto.siteid,
            strict: dto.strict ? dto.strict && dto.strict === "true" : false,
            version: dto.version
        };
    }

}

