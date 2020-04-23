import { Module } from '@nestjs/common';
import { ConnectorEnvironmentService } from './connector.env.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: ConnectorEnvironmentService.getValidator()
        }),
    ],
    providers: [
        ConnectorEnvironmentService
    ],
    exports: [
        ConnectorEnvironmentService
    ],
})
export class ConnectorEnvironmentModule {}
