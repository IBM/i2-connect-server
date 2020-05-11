// nest js
import { Controller, NotImplementedException } from '@nestjs/common';

// base connector components
import { BaseConnectorController, IBaseConnectorService, Connector } from '@app/core/connectors';
import { IConnectorServiceRequest, IDaodResults, IDaodValidationResponse } from '@app/core/service';

// the connector service itself
import { ExampleConnectorService } from './example-connector.service';
import { CONNECTOR_ID, CONTEXT_ROOT, SERVICE_NAMES } from './constants';

@Controller(CONTEXT_ROOT)
export class ExampleConnectorController extends BaseConnectorController {

    constructor(@Connector(CONNECTOR_ID) protected baseConnectorService: IBaseConnectorService,
                private connectorService: ExampleConnectorService) {
        super();
    }

    async executeAcquireRequest(request: IConnectorServiceRequest): Promise<IDaodResults> {
        const serviceName = SERVICE_NAMES[request.params.serviceName];
        switch (serviceName) {
            case SERVICE_NAMES.exampleSearch:
                return await this.connectorService.exampleSearchAcquire(request);
            case SERVICE_NAMES.exampleSeededSearch1:
                return await this.connectorService.exampleSeededSearch1Acquire(request);
            case SERVICE_NAMES.exampleSeededSearch2:
                return await this.connectorService.exampleSeededSearch2Acquire(request);
            case SERVICE_NAMES.exampleSeededSearch3:
                return await this.connectorService.exampleSeededSearch3Acquire(request);
            case SERVICE_NAMES.exampleSeededSearch4:
                return await this.connectorService.exampleSeededSearch4Acquire(request);
            case SERVICE_NAMES.exampleSchemaExtension:
                return await this.connectorService.exampleSchemaExtensionAcquire(request);
            default:
                throw new NotImplementedException();
        } 
    }

    async executeValidateRequest(request: IConnectorServiceRequest): Promise<IDaodValidationResponse> {
        const serviceName = SERVICE_NAMES[request.params.serviceName];
        switch (serviceName) {
            case SERVICE_NAMES.exampleSearch:
                return await this.connectorService.exampleSearchValidate(request);
            default:
                throw new NotImplementedException();
        }
    }

}
