

export interface IConnectorManifestDto {

    id: string;
    version: string;
    name: string;
    description: string;
    autoLoad?: boolean;
    author: string;
    moduleFilePath?: string;
    settings: IConnectorSettingDto[];

}

export interface IConnectorSettingDto {

    id: string;
    value?: string | number | boolean;
    type: string;

}

export interface IConnectorFolderSettingDto extends IConnectorSettingDto {

    extensionFilter: string;

}
