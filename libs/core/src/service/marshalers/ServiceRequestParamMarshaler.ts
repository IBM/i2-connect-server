import { IServiceRequestParamDto } from "../dto/IServiceRequestParamDto";
import { DEFAULT_URL_PATH_ACQUIRE, DEFAULT_URL_PATH_VALIDATE } from "../../constants";

export interface IServiceRequestParam {

    serviceName: string;
    methodType: IServiceRequestMethodTypeEnum;

}

export enum IServiceRequestMethodTypeEnum {
    ACQUIRE,
    VALIDATE
}

export class ServiceRequestParamMarshaler {

    public static marshalFromDto(dto: IServiceRequestParamDto): IServiceRequestParam {
        if (!dto.serviceName) {
            throw new Error("Request route (params) has no serviceName, check the service acquire/validate url structure.");
        }
        if (!dto.methodType) {
            throw new Error("Request route (params) has no methodType, check the service acquire/validate url structure.");
        }
        let methodType: IServiceRequestMethodTypeEnum;
        switch (dto.methodType) {
            case DEFAULT_URL_PATH_ACQUIRE:
                methodType = IServiceRequestMethodTypeEnum.ACQUIRE;
                break;
            case DEFAULT_URL_PATH_VALIDATE:
                methodType = IServiceRequestMethodTypeEnum.VALIDATE;
                break;
            default:
                throw Error(`Request route (params) has invalid methodType, check the service acquire/validate url structure.`)
        }
        return {
            serviceName: dto.serviceName,
            methodType: methodType
        };
    }

}

