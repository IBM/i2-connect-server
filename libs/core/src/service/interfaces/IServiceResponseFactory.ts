import { IDaodResults } from "../marshalers/DaodResultsMarshaler";
import { IDaodValidationResponse } from "../marshalers/DaodValidationResponseMarshaler";
import { IConnectorServiceAquireResponse } from "../ServiceAquireResponse";
import { IConnectorServiceValidateResponse } from "../ServiceValidateResponse";
import { IServiceRequestQuery } from "../marshalers/ServiceRequestQueryMarshaler";

export interface IConnectorServiceResponseFactory {

    createConnectorServiceAquireResponse(
        daodResults: IDaodResults, 
        requestQuery: IServiceRequestQuery
    ) : IConnectorServiceAquireResponse;

    createConnectorServiceValidateResponse(
        validationResponse: IDaodValidationResponse, 
        requestQuery: IServiceRequestQuery
    ) : IConnectorServiceValidateResponse;

}
