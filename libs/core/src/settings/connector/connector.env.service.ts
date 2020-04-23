import { Injectable, Logger } from '@nestjs/common';
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

    logPayloads(): boolean {
        const val = this.configService.get<string>(ENV_CONN_LOGPAYLOADS);
        return val === 'true';
    }
    
}