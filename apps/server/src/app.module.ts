import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServerEnvironmentModule } from '@app/core/settings';
import { LoadersModule } from '@app/core/loader';

@Module({
    imports: [
        // ExampleConnectorModule,
        ServerEnvironmentModule,
        LoadersModule.registerAsync('libs/connectors')
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
