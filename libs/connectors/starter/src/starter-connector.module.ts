import { Module } from '@nestjs/common';
import { StarterConnectorService } from './starter-connector.service';
import { StarterConnectorController } from './starter-connector.controller';

@Module({
    providers: [
        StarterConnectorService
    ],
    controllers: [
        StarterConnectorController
    ]
})
export class StarterConnectorModule {}
