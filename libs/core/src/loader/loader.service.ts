import * as path from 'path';
import { Logger, DynamicModule, Provider } from '@nestjs/common';
import { IConnectorManifest } from '../manifest/marshalers/ConnectorManifestMarshaler';
import { ConnectorManifestService } from '../manifest/manifest.service';
import { BaseConnectorService } from '../connectors/base.connector.service';
import { IConnectorProvidersFactory } from '../connectors/interfaces/IBaseConnectorProvidersFactory';
import { IBaseConnectorService } from '../connectors/interfaces/IBaseConnectorService';
import { UtilFileIO } from '../util/fileio';

interface IConnectorModule {
    name: string;
    module: DynamicModule;
}

export interface ILoaderService {
    initializeAsync(connectorManifestsPath: string): Promise<void>;
}

export interface IConnectorModulesFactory {
    createConnectorModules(): Promise<DynamicModule[]>;
}

export class LoaderService implements ILoaderService, IConnectorModulesFactory, IConnectorProvidersFactory {

    private _manifests: IConnectorManifest[] = [];
    private _modulesArray: IConnectorModule[] = [];

    public async initializeAsync(connectorManifestsPath: string): Promise<void> {
        const fullManifestsPath = path.normalize(path.join(process.cwd(), connectorManifestsPath))
        this._manifests = await Promise.all(this.createManifestServices(fullManifestsPath));
    }

    public createConnectorProviders(): Provider[] {
        return this._manifests.map(item => {
            return this.createConnectorProvider(item);
        });        
    }

    public async createConnectorModules(): Promise<DynamicModule[]> {
        const filePaths = this._manifests.reduce((availableFilePaths, item) => {
            if (item.moduleFilePath) {
                const fullPath = path.normalize(path.join(process.cwd(), item.moduleFilePath));
                availableFilePaths.push(fullPath);
            } else {
                // do not throw an error but log and continue
                Logger.warn(`Error loading module for connector '${item.name}'. moduleFilePath not defined in connector manifest. Skipping.`)
            }
            return availableFilePaths;
        }, []);  

        return this.loadConnectorModulesFromFiles(filePaths);
    }

    private createManifestServices(connectorManifestsPath): Promise<IConnectorManifest>[] {
        Logger.log(`Searching for connector manifests in ${connectorManifestsPath}`, 'LoadConnectorManifests');
        const manifestFiles =  this.searchManifestsInFolder(connectorManifestsPath);
        // TODO: ideally inject this (See loader module comments for details)
        const manifestService = new ConnectorManifestService();
        return manifestFiles.map(async (filePath: string) => {
            return await manifestService.getConnectorManifest(filePath);
        });
    }

    private createConnectorProvider(manifest: IConnectorManifest): Provider {
        return {
            provide: manifest.id,
            useFactory: async (connectorProvider: IBaseConnectorService) => {
                return await this.connectorProviderFactory(connectorProvider, manifest)
            },
            inject: [BaseConnectorService],
        };
    }

    private async connectorProviderFactory(connectorService: IBaseConnectorService, manifest: IConnectorManifest): Promise<IBaseConnectorService> {
        if (connectorService) {
            await connectorService.initializeAsync(manifest);
        }
        return connectorService;
    }

    private async loadConnectorModulesFromFiles(filePaths: string[]): Promise<DynamicModule[]> {

        const loadedModules: Array<DynamicModule> = [];
        for (const filePath of filePaths) {
            Logger.log(`Loading connector module from ${filePath}`, 'LoadConnectorModule');
            loadedModules.push(await this.loadModule(filePath));
        }
        Logger.log(`All connector modules resolved: ${loadedModules.length} modules imported.`, 'LoadConnectorModules');

        if (loadedModules.length > 0) {
            for (const module of loadedModules) {
                const foundModuleEntryName = Object.keys(module).find(key => key.indexOf('Module'));
                if (foundModuleEntryName) {
                    this._modulesArray.push({ name: foundModuleEntryName, module: module[foundModuleEntryName] });
                    Logger.log(`Connector module '${foundModuleEntryName}' created`, 'LoadConnectorModules');
                }
            }
        }
        return this._modulesArray.map(plugin => plugin.module)
    }

    private async discoverAndLoadConnectorModules(connectorsModulePath: string): Promise<DynamicModule[]> {
        const moduleFiles =  this.searchModulesInFolder(connectorsModulePath);
        return this.loadConnectorModulesFromFiles(moduleFiles);
    }

    private loadModule(filePath: string): Promise<DynamicModule> {
        return import(filePath);
    }

    private searchManifestsInFolder(folder: string): string[] {
        return UtilFileIO.FindFilesByExt(folder, 'manifest.json');
    }

    private searchModulesInFolder(folder: string): string[] {
        return UtilFileIO.FindFilesByExt(folder, 'module.js');
    }

}