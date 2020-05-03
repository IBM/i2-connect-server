import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ServerSettingsService } from '@app/core/settings';

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule);
        const serverConfig: ServerSettingsService = app.get('ServerSettingsService');
        await app.listen(serverConfig.port);
        Logger.log(`Application server started at: ${await app.getUrl()}`, "Server");
    } catch (err) {
        Logger.error(`Could not start server: ${err.message}`, err.stack, "Server");
    }    
}
bootstrap();
