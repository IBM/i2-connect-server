import { createParamDecorator, Inject, Logger, Controller } from '@nestjs/common';

export const baseConnectorServices: string[] = new Array<string>();

export function Connector(connectorId: string = '') {
    if (!baseConnectorServices.includes(connectorId)) {
        baseConnectorServices.push(connectorId);
    }
    return Inject(`${connectorId}`);
}
