import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Joi = require('@hapi/joi');
import { ENV_CONN_LOGPAYLOADS } from '../../constants';

@Injectable()
export class ConnectorEnvironmentService {

    constructor(private configService: ConfigService) {}

    static getValidator(): Joi.ObjectSchema<any> {

        const validatorDef = {};
        validatorDef[ENV_CONN_LOGPAYLOADS] = Joi.boolean();

        return Joi.object(validatorDef);
    }

    get logPayloads(): boolean {
        // TODO: check this - as should be able use direct support from nest config
        // to return boolean type, but doesn't appear to work, having to convert manually here
        // const val = Boolean(this.configService.get<boolean>(ENV_CONN_LOGPAYLOADS));
        return this.configService.get<string>(ENV_CONN_LOGPAYLOADS) === 'true';
    }
    
}