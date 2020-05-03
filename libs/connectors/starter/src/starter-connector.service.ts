
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Connector, IBaseConnectorService } from '@app/core/connectors';

// connector specific imports
import { CONNECTOR_ID } from './constants';
import { IConnectorServiceRequest, IDaodResults, IDaodValidationResponse } from '@app/core/service';


@Injectable()
export class StarterConnectorService implements OnModuleInit {

    constructor(@Connector(CONNECTOR_ID) private baseConnectorService: IBaseConnectorService) {}    
    
    async onModuleInit() {
        Logger.debug('Initializing connector.', 'StarterConnector')
        // perform any initialization logic here if needed
    }

    async service1Aquire(serviceRequest: IConnectorServiceRequest): Promise<IDaodResults> {
        return {
            entities: [],
            links: []
        };
    }

    async service1Validate(serviceRequest: IConnectorServiceRequest): Promise<IDaodValidationResponse> {
        return {
            errorMessage: undefined
        };
    }

}