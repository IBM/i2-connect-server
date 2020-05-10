
import { Controller, NotImplementedException } from '@nestjs/common';
import { BaseConnectorController, IBaseConnectorService, Connector } from '@app/core/connectors';
import { IConnectorServiceRequest, IDaodResults, IDaodValidationResponse } from '@app/core/service';

// connector specific imports
import { StarterConnectorService } from './starter-connector.service';
import { CONNECTOR_ID, CONTEXT_ROOT, SERVICE_NAMES } from './constants';

@Controller(CONTEXT_ROOT)
export class StarterConnectorController extends BaseConnectorController {

    constructor(@Connector(CONNECTOR_ID) protected baseConnectorService: IBaseConnectorService,
                private connectorService: StarterConnectorService) {
        super();
    }

    async executeAquireRequest(request: IConnectorServiceRequest): Promise<IDaodResults> {
        const serviceName = SERVICE_NAMES[request.params.serviceName];
        switch (serviceName) {
            case SERVICE_NAMES.servicename1:
                return await this.connectorService.service1Aquire(request);
            default:
                throw new NotImplementedException();
        } 
    }

    async executeValidateRequest(request: IConnectorServiceRequest): Promise<IDaodValidationResponse> {
        const serviceName = SERVICE_NAMES[request.params.serviceName];
        switch (serviceName) {
            case SERVICE_NAMES.servicename1:
                return await this.connectorService.service1Validate(request);
            default:
                throw new NotImplementedException();
        }
    }

}
