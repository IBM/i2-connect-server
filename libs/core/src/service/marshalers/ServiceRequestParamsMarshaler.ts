import { IServiceRequestParamsDto } from "../dto/IServiceRequestParamsDto";
import { DEFAULT_URL_PATH_ACQUIRE, DEFAULT_URL_PATH_VALIDATE } from "../../constants";

export interface IServiceRequestParams {

    /**
     * The service name being requested - as defined by services listed in the i2 Connector configuration file
     */
    serviceName: string;
    
    /**
     * The method type of the service being requested, either an acquire (get data) or a validate (check request input).
     */
    methodType: IServiceRequestMethodTypeEnum;

}

export enum IServiceRequestMethodTypeEnum {
    ACQUIRE,
    VALIDATE
}

export class ServiceRequestParamsMarshaler {

    public static marshalFromDto(dto: IServiceRequestParamsDto): IServiceRequestParams {
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

