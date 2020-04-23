import { IConnectorSetting, ConnectorSettingTypeEnum, IConnectorFolderSetting } from "../manifest/marshalers/ConnectorManifestMarshaler";
import { UtilFileIO } from "./fileio";
import { NotImplementedException, Logger } from "@nestjs/common";

export interface ISettingsValue {
    type: ConnectorSettingTypeEnum;
    value: any;
}

export interface ISettingsItemData {
    id: string;
    data: string;
}

// TODO: needs a lot of clean up and refactoring
export class UtilSettings {

    static async getSettingsValue(connectorSetting: IConnectorSetting): Promise<ISettingsValue> {
        switch (connectorSetting.type) {
            case ConnectorSettingTypeEnum.FILE:
                return await this.getFileSettingsValue(connectorSetting);
            case ConnectorSettingTypeEnum.FOLDER:
                return await this.getFolderSettingsValue(connectorSetting as IConnectorFolderSetting);
            case ConnectorSettingTypeEnum.LITERAL:
                return await this.getLiteralSettingsValue(connectorSetting);
            case ConnectorSettingTypeEnum.URL:
                return await this.getUrlSettingsValue(connectorSetting);
            case ConnectorSettingTypeEnum.ENV:
                return await this.getEnvSettingsValue(connectorSetting);
            default:
                throw Error(`Unknown connector setting type '${connectorSetting.type}'`)
        }
    }

    private static async getFileSettingsValue(connectorSetting: IConnectorSetting): Promise<ISettingsValue> {
        if (!connectorSetting.value) {
            this.throwError(connectorSetting.id, 'file settings must have a value.');
        }
        if (typeof connectorSetting.value !== 'string') {
            this.throwError(connectorSetting.id, 'file settings value must be a string.');
        }
        const filePath = connectorSetting.value as string;
        try {
            const fileData = await UtilFileIO.readFile(filePath);
            Logger.log(`Read file from '${filePath}'`, 'UtilSettings');
            const fileValue = {
                id: UtilFileIO.getFileNameNoExt(filePath),
                data: fileData
            } as ISettingsItemData;
            return {
                type: ConnectorSettingTypeEnum.FILE,
                value: fileValue
            };
        } catch (err) {
            this.throwError(connectorSetting.id, `error reading file '${filePath}'. ${err.message}`);
        }
    }

    private static async getFolderSettingsValue(connectorSetting: IConnectorFolderSetting): Promise<ISettingsValue> {
        if (!connectorSetting.value) {
            this.throwError(connectorSetting.id, 'folder settings must have a value.');
        }
        if (typeof connectorSetting.value !== 'string') {
            this.throwError(connectorSetting.id, 'folder settings value must be a string.');
        }
        const folderPath = connectorSetting.value as string;
        try {
            const fileList = UtilFileIO.FindFilesByExt(folderPath, connectorSetting.extensionFilter);
            const fileData = await Promise.all(fileList.map(async filePath => {
                return {
                    id: UtilFileIO.getFileNameNoExt(filePath),
                    data: await UtilFileIO.readFile(filePath)
                } as ISettingsItemData;
            })); 
            Logger.log(`Read files from '${folderPath}'`, 'UtilSettings');
            return {
                type: ConnectorSettingTypeEnum.FOLDER,
                value: fileData
            };
        } catch (err) {
            this.throwError(connectorSetting.id, `error reading files from '${folderPath}'. ${err.message}`);
        }
    }


    private static async getLiteralSettingsValue(connectorSetting: IConnectorSetting): Promise<ISettingsValue > {
        return {
            type: ConnectorSettingTypeEnum.LITERAL,
            value: connectorSetting.value
        };
    }
    
    private static async getUrlSettingsValue(connectorSetting: IConnectorSetting): Promise<ISettingsValue> {
        // TODO: implement this!
        throw new NotImplementedException();
    }
    
    private static async getEnvSettingsValue(connectorSetting: IConnectorSetting): Promise<ISettingsValue> {
        // TODO: implement this!
        throw new NotImplementedException();
    }

    private static throwError(connectorSettingId: string, errDetails: string): void {
        throw Error(`Setting '${connectorSettingId}': ${errDetails}`);
    }

}