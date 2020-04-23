import { Module } from '@nestjs/common';
import { ExampleConnectorController } from './example.connector.controller';
import { ExampleConnectorService } from './example.connector.service';

@Module({
    providers: [
        ExampleConnectorService
    ],
    controllers: [
        ExampleConnectorController
    ]
})
export class ExampleConnectorModule {}