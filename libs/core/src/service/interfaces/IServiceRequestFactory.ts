
import { IConnectorServiceRequest } from "../ServiceRequest";
import { IDaodRequest } from "../marshalers/DaodRequestMarshaler";
import { IServiceRequestQuery } from "../marshalers/ServiceRequestQueryMarshaler";

export interface IConnectorServiceRequestFactory {

    createConnectorServiceRequest(
        daodRequest: IDaodRequest, 
        requestQuery: IServiceRequestQuery
    ) : IConnectorServiceRequest;

}
