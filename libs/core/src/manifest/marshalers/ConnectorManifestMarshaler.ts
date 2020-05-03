import { IConnectorManifestDto, IConnectorSettingDto, IConnectorFolderSettingDto } from "../dto/IConnectorManifestDto";

export interface IConnectorManifest {

    /**
     * Connector id
     */
    id: string;

    /**
     * Connector version
     */
    version: string;

    /**
     * Connector name
     */
    name: string;

    /**
     * Connector description
     */
    description: string;

    /**
     * Whether to automatically load the connector on server startup
     */
    autoLoad?: boolean;

    /**
     * Connector author
     */
    author: string;

    /**
     * Connector author
     */
    moduleFilePath?: string;

    /**
     * Connector settings
     */
    settings: IConnectorSetting[];

}

export interface IConnectorSetting {

    /**
     * Unique key for the setting
     */
    id: string;

    /**
     * Value of the setting (string, number or boolean)
     */
    value?: string | number | boolean;

    /**
     * Type of the setting (FILE, URL, LITERAL)
     */
    type: ConnectorSettingTypeEnum;

}

export interface IConnectorFolderSetting extends IConnectorSetting {

    /**
     * File extension filter applied when searching for files within the given folder.  Must
     * be an extact match, can not contain any wildcards or regex.
     */
    extensionFilter: string;

}

export enum ConnectorSettingTypeEnum {
    LITERAL,
    FILE,
    FOLDER,
    URL,
    ENV
}

export class ConnectorSettingsMarshaler {

    public static marshalFromDto(dto: IConnectorManifestDto): IConnectorManifest {
        if (!dto.id) {
            throw new Error("Connector settings has no id property defined.");
        }
        if (!dto.version) {
            throw new Error("Connector settings has no version property defined.");
        }
        if (!dto.name) {
            throw new Error("Connector settings has no name property defined.");
        }
        if (!dto.description) {
            throw new Error("Connector settings has no description property defined.");
        }
        if (!dto.author) {
            throw new Error("Connector settings has no author property defined.");
        }
        if (!dto.settings) {
            throw new Error("Connector settings has no settings property defined.");
        }
        return {
            id: dto.id,
            version: dto.version,
            name: dto.name,
            description: dto.description,
            author: dto.author,
            autoLoad: dto.autoLoad,
            moduleFilePath: dto.moduleFilePath,
            settings: dto.settings.map((s) => ConnectorSettingMarshaler.marshalFromDto(s)),
        };
    }

}

export class ConnectorSettingMarshaler {

    // TODO: tidy up marshalling using generics?
    public static marshalFromDto(dto: IConnectorSettingDto): IConnectorSetting {
        if (!dto.id) {
            throw new Error("Connector setting has no id property defined.");
        }
        if (!dto.type) {
            throw new Error("Connector setting has no type property defined.");
        }
        const settingType = ConnectorSettingTypeEnum[dto.type];
        switch (settingType) {
            case ConnectorSettingTypeEnum.FOLDER:
                if (!(dto as IConnectorFolderSettingDto).extensionFilter) {
                    throw new Error("Connector setting for a folder has no extensionFilter property defined.");
                }
                return {
                    id: dto.id,
                    value: dto.value,
                    type: ConnectorSettingTypeEnum[dto.type],
                    extensionFilter: (dto as IConnectorFolderSettingDto).extensionFilter
                } as IConnectorFolderSetting;
            default:
                return {
                    id: dto.id,
                    value: dto.value,
                    type: ConnectorSettingTypeEnum[dto.type]
                } as IConnectorSetting;
        }
    }

}

