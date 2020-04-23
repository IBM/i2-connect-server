import { Injectable, Logger } from '@nestjs/common';
import { UtilXml2Json } from '../util/xml2json';
import { IConnectorSetting } from '../manifest/marshalers/ConnectorManifestMarshaler';
import { UtilSettings, ISettingsItemData } from '../util/settings';
import { IConnectorSchemaItem } from './interfaces/ISchemaItem';

export interface IConnectorSchemaService {
    getConnectorSchemaItems(schemasSetting: IConnectorSetting): Promise<IConnectorSchemaItem[]>;
}

@Injectable()
export class ConnectorSchemaService implements IConnectorSchemaService {

    constructor() {}    

    static getConnectorSchemaAsDto(connectorSchemaItem: IConnectorSchemaItem): string {
        return UtilXml2Json.parseJsonToXmlString(connectorSchemaItem.schema);
    }

    static findConnectorSchemaItem(connectorSchemaItems: IConnectorSchemaItem[], siteId: string): IConnectorSchemaItem {
        return connectorSchemaItems && connectorSchemaItems.find(item => item.siteId === siteId);
    }

    async getConnectorSchemaItems(schemasSetting: IConnectorSetting): Promise<IConnectorSchemaItem[]> {
        const settingsValue = await UtilSettings.getSettingsValue(schemasSetting);
        // assumed that will be getting an array of item data
        const itemDataArray = settingsValue.value as ISettingsItemData[];
        return Promise.all(itemDataArray.map(async itemData => {
            return {
                siteId: itemData.id,
                schema: await UtilXml2Json.parseXmlToJson(itemData.data)
            }
        }));
    }

}