
import { IDaodValidationResponseDto } from './dto/IDaodValidationResponseDto';
import { IDaodValidationResponse, DaodValidationResponseMarshaler } from "./marshalers/DaodValidationResponseMarshaler";
import { IServiceRequestQuery } from './marshalers/ServiceRequestQueryMarshaler';

export interface IConnectorServiceValidateResponse {

    readonly validationResponseDto: IDaodValidationResponseDto;
    
}

export class ConnectorServiceValidateResponse implements IConnectorServiceValidateResponse {

    constructor(private _validationResponseDto: IDaodValidationResponseDto) {}

    public get validationResponseDto(): IDaodValidationResponseDto {
        return this._validationResponseDto;
    }

    public static createConnectorServiceAcquireResponse(
        daodValidationResponse: IDaodValidationResponse, 
        requestQuery: IServiceRequestQuery
    ) : IConnectorServiceValidateResponse {
        const validationResponseDto = DaodValidationResponseMarshaler.marshalToDto(daodValidationResponse);
        return new ConnectorServiceValidateResponse(validationResponseDto);
    }

}