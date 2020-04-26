import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Joi = require('@hapi/joi');
import { NODE_ENV, ENV_SERVER_PORT, DEFAULT_SERVER_PORT, ENV_CONNECTORS_HOME, DEFAULT_CONNECTORS_HOME } from '../../constants';

@Injectable()
export class ServerEnvironmentService {

    constructor(private configService: ConfigService) {}

    static getValidator(): Joi.ObjectSchema<any> {

        const validatorDef = {};
        validatorDef[NODE_ENV] = Joi.string()
            .valid('development', 'production', 'test', 'provision')
            .default('development');
        validatorDef[ENV_SERVER_PORT] = Joi.number()
            .default(DEFAULT_SERVER_PORT);
        validatorDef[ENV_CONNECTORS_HOME] = Joi.string()
            .default(DEFAULT_CONNECTORS_HOME);

        return Joi.object(validatorDef);
    }

    get env(): string {
        return this.configService.get<string>(NODE_ENV);
    }

    get port(): number {
        return Number(this.configService.get<number>(ENV_SERVER_PORT));
    }

    get connectorsHome(): string {
        return this.configService.get<string>(ENV_CONNECTORS_HOME);
    }

}