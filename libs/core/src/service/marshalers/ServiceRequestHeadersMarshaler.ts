import { IServiceRequestHeadersDto } from "../dto/IServiceRequestHeadersDto";

export interface IServiceRequestHeaders {

}

export class ServiceRequestHeadersMarshaler {

    public static marshalFromDto(dto: IServiceRequestHeadersDto): IServiceRequestHeaders {
        return dto;  // no actual marshalling right now
    }

}

