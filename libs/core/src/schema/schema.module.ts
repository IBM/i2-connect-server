import { Module } from '@nestjs/common';
import { ConnectorSchemaService } from './schema.service';

@Module({
    imports: [
    ],
    controllers: [
    ],
    providers: [
        ConnectorSchemaService
    ],
    exports: [
        ConnectorSchemaService
    ]
})
export class ConnectorSchemaModule {}