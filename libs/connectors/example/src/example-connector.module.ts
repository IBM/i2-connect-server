import { Module } from '@nestjs/common';
import { ExampleConnectorController } from './example-connector.controller';
import { ExampleConnectorService } from './example-connector.service';
import { PeopleSearchService } from './people/people-search.service';

@Module({
    controllers: [
        ExampleConnectorController
    ],
    providers: [
        ExampleConnectorService,
        PeopleSearchService
    ]
})
export class ExampleConnectorModule {}