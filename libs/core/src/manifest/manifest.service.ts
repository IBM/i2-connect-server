import { Injectable, Logger } from '@nestjs/common';
import { ConnectorSettingsMarshaler, IConnectorSetting, IConnectorManifest } from './marshalers/ConnectorManifestMarshaler';
import { UtilFileIO } from '../util/fileio';
import { SETTING_CONN_CONFIG, SETTING_CONN_SCHEMAS, SETTING_CONN_CHARTINGSCHEMES, SETTING_CONN_TYPEMAPS, SETTING_CONN_TRANSFORMS } from '../constants';
import { IConnectorManifestDto } from './dto/IConnectorManifestDto';

export interface IConnectorManifestService {
    getConnectorManifest(manifestFilePath: string): Promise<IConnectorManifest>;
}

@Injectable()
export class ConnectorManifestService implements IConnectorManifestService {

    constructor() {}

    async getConnectorManifest(manifestFilePath: string): Promise<IConnectorManifest> {
        return this.readConnectorSettingsFromFile(manifestFilePath);
    }

    public static getConnectorConfigSetting(manifest: IConnectorManifest, isRequired?: boolean): IConnectorSetting {
        return this.getSetting(manifest, SETTING_CONN_CONFIG, isRequired);
    }

    public static getConnectorSchemasSetting(manifest: IConnectorManifest, isRequired?: boolean): IConnectorSetting {
        return this.getSetting(manifest, SETTING_CONN_SCHEMAS, isRequired);
    }
    
    public static getConnectorChartingSchemesSetting(manifest: IConnectorManifest, isRequired?: boolean): IConnectorSetting {
        return this.getSetting(manifest, SETTING_CONN_CHARTINGSCHEMES, isRequired);
    }

    public static getConnectorTypeMapsSetting(manifest: IConnectorManifest, isRequired?: boolean): IConnectorSetting {
        return this.getSetting(manifest, SETTING_CONN_TYPEMAPS, isRequired);
    }    

    public static getConnectorTransformsSetting(manifest: IConnectorManifest, isRequired?: boolean): IConnectorSetting {
        return this.getSetting(manifest, SETTING_CONN_TRANSFORMS, isRequired);
    }

    public static getSetting(manifest: IConnectorManifest, settingId: string, isRequired?: boolean): IConnectorSetting {
        const setting = manifest.settings.find(item => item.id === settingId);
        // check setting is available (if it is mandatory)
        if (!setting && isRequired) {
            throw Error(`Setting '${settingId}' is missing from connector manifest file.`);
        }
        return setting;
    }

    private async readConnectorSettingsFromFile(manifestFilePath: string): Promise<IConnectorManifest> {
        try {
            const manifestDto = await UtilFileIO.readJsonFile(manifestFilePath) as IConnectorManifestDto;
            const manifest = ConnectorSettingsMarshaler.marshalFromDto(manifestDto);
            Logger.log(`Loaded connector manifest from '${manifestFilePath}'`, "ConnectorManifestService");
            return manifest;
        } catch (err) {
            throw Error(`Error reading connector manifest file from '${manifestFilePath}'. ${err.message}`);
        }
    }
    
}