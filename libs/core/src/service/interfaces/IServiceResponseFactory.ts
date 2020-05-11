import { IDaodResults } from "../marshalers/DaodResultsMarshaler";
import { IDaodValidationResponse } from "../marshalers/DaodValidationResponseMarshaler";
import { IConnectorServiceAcquireResponse } from "../ServiceAcquireResponse";
import { IConnectorServiceValidateResponse } from "../ServiceValidateResponse";
import { IServiceRequestQuery } from "../marshalers/ServiceRequestQueryMarshaler";

export interface IConnectorServiceResponseFactory {

    createConnectorServiceAcquireResponse(
        daodResults: IDaodResults, 
        requestQuery: IServiceRequestQuery
    ) : IConnectorServiceAcquireResponse;

    createConnectorServiceValidateResponse(
        validationResponse: IDaodValidationResponse, 
        requestQuery: IServiceRequestQuery
    ) : IConnectorServiceValidateResponse;

}
