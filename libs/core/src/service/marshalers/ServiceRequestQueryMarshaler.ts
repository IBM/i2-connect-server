import { IServiceRequestQueryDto } from "../dto/IServiceRequestQueryDto";

export interface IServiceRequestQuery {

    siteid?: string;
    strict?: boolean;

}

export class ServiceRequestQueryMarshaler {

    public static marshalFromDto(dto: IServiceRequestQueryDto): IServiceRequestQuery {
        return {
            siteid: dto.siteid,
            strict: dto.strict ? dto.strict && dto.strict === "true" : false
        };
    }

}

