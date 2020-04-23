

export interface IConnectorManifestDto {

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
     * Connector author
     */
    author: string;

    /**
     * Connector author
     */
    moduleFilePath: string;

    /**
     * Connector settings
     */
    settings: IConnectorSettingDto[];

}

export interface IConnectorSettingDto {

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
    type: string;

}

export interface IConnectorFolderSettingDto extends IConnectorSettingDto {

    extensionFilter: string;

}
