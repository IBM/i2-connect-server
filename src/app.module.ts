import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServerSettingsModule } from '@app/core/settings';
import { LoadersModule } from '@app/core/loader';

@Module({
    imports: [
        ServerSettingsModule,
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
