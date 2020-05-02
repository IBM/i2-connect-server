
import { IConnectorServiceRequest } from "../ServiceRequest";
import { IDaodRequest } from "../marshalers/DaodRequestMarshaler";
import { IServiceRequestQuery } from "../marshalers/ServiceRequestQueryMarshaler";
import { IServiceRequestParams } from "../marshalers/ServiceRequestParamsMarshaler";
import { IServiceRequestHeaders } from "../marshalers/ServiceRequestHeadersMarshaler";

export interface IConnectorServiceRequestFactory {

    createConnectorServiceRequest(
        daodRequest: IDaodRequest, 
        requestQuery: IServiceRequestQuery,
        requestParams: IServiceRequestParams,
        requestHeaders: IServiceRequestHeaders
    ) : IConnectorServiceRequest;

}
