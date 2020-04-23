import { LoaderService, ILoaderService } from "./loader.service";

export class LoaderServiceFactory {

    public static async createLoaderServiceAsync(connectorManifestsPath: string): Promise<LoaderService> {
        const loaderService = new LoaderService();
        await loaderService.initializeAsync(connectorManifestsPath);
        return loaderService;
    }

}
