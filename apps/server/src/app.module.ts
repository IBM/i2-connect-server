import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServerEnvironmentModule } from '@app/core/settings';
import { LoadersModule } from '@app/core/loader';
import { ExampleConnectorModule } from 'libs/connectors/example';

@Module({
    imports: [
        ExampleConnectorModule,
        ServerEnvironmentModule,
        LoadersModule.registerAsync()
    ],
    controllers: [
        AppController
    ],
    providers: [
        AppService,
    ],
    exports: [
        
    ],
})
export class AppModule {}
