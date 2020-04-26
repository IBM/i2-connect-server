// nest js
import { Controller, NotImplementedException } from '@nestjs/common';

// base connector components
import { BaseConnectorController, IBaseConnectorService, Connector } from '@app/core/connectors';
import { IConnectorServiceRequest, IDaodResults, IDaodValidationResponse } from '@app/core/service';

// the connector service itself
import { ExampleConnectorService } from './example.connector.service';
import { CONNECTOR_ID, CONTEXT_ROOT,
         SERVICE_NAME_EXAMPLESEARCH,
         SERVICE_NAME_EXAMPLESCHEMAEXTENSION, 
         SERVICE_NAME_EXAMPLESEEDEDSEARCH1, 
         SERVICE_NAME_EXAMPLESEEDEDSEARCH2, 
         SERVICE_NAME_EXAMPLESEEDEDSEARCH3, 
         SERVICE_NAME_EXAMPLESEEDEDSEARCH4 } from './constants';

@Controller(CONTEXT_ROOT)
export class ExampleConnectorController extends BaseConnectorController {

    constructor(@Connector(CONNECTOR_ID) protected baseConnectorService: IBaseConnectorService,
                private connectorService: ExampleConnectorService) {
        super();
    }

    async executeAquireRequest(
        request: IConnectorServiceRequest
    ): Promise<IDaodResults> {
        switch (request.params.serviceName) {
            case SERVICE_NAME_EXAMPLESEARCH:
                return await this.connectorService.exampleSearchAquire(request);
            case SERVICE_NAME_EXAMPLESEEDEDSEARCH1:
                return await this.connectorService.exampleSeededSearch1Aquire(request);
            case SERVICE_NAME_EXAMPLESEEDEDSEARCH2:
                return await this.connectorService.exampleSeededSearch2Aquire(request);
            case SERVICE_NAME_EXAMPLESEEDEDSEARCH3:
                return await this.connectorService.exampleSeededSearch3Aquire(request);
            case SERVICE_NAME_EXAMPLESEEDEDSEARCH4:
                return await this.connectorService.exampleSeededSearch4Aquire(request);
            case SERVICE_NAME_EXAMPLESCHEMAEXTENSION:
                return await this.connectorService.exampleSchemaExtensionAquire(request);
            default:
                throw new NotImplementedException();
        } 
    }

    async executeValidateRequest(
        request: IConnectorServiceRequest
    ): Promise<IDaodValidationResponse> {
        switch (request.params.serviceName) {
            case SERVICE_NAME_EXAMPLESEARCH:
                return await this.connectorService.exampleSearchValidate(request);
            default:
                throw new NotImplementedException();
        }
    }

}
