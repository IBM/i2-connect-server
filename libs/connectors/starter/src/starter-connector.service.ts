
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Connector, IBaseConnectorService } from '@app/core/connectors';
import { IConnectorServiceRequest, IDaodResults, IDaodValidationResponse } from '@app/core/service';

// connector specific imports
import { CONNECTOR_ID, TRANSFORM_NAME_SERVICENAME1 } from './constants';
import { StarterApiService } from './api/starter-api.service';
import { StarterConditionsHelper } from './utils/StarterParamsHelpers';
import { UtilGeneral } from '@app/core/util';


@Injectable()
export class StarterConnectorService implements OnModuleInit {

    constructor(@Connector(CONNECTOR_ID) private baseConnectorService: IBaseConnectorService,
                private apiService: StarterApiService) {}    
    
    async onModuleInit() {
        Logger.debug('Initializing connector.', 'StarterConnector')
        // perform any initialization logic here if needed
    }

    async service1Validate(serviceRequest: IConnectorServiceRequest): Promise<IDaodValidationResponse> {
        /*
        try {
            return StarterConditionsHelper.service1GetParams(serviceRequest) && {};
        } catch (err) {
            return { errorMessage: err.message} 
        }
        */
       return {};
    }

    async service1Acquire(serviceRequest: IConnectorServiceRequest): Promise<IDaodResults> {
        /*
        const params =  StarterConditionsHelper.service1GetParams(serviceRequest);
        const apiData = await this.apiService.runSearchAsync('enter_api_url_here', params);
        const transform = this.baseConnectorService.getTransform(TRANSFORM_NAME_SERVICENAME1);
        const results = UtilGeneral.processResults(apiData, transform);
        */
        return {
            entities: [],
            links: []
        };
    }

}