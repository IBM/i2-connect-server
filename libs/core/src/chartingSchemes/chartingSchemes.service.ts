import { Injectable, Logger } from '@nestjs/common';
import { IConnectorSetting } from '../manifest/marshalers/ConnectorManifestMarshaler';
import { IConnectorChartingSchemesItem } from './interfaces/IChartingSchemeItem';
import { UtilXml2Json, UtilSettings, ISettingsItemData } from '../util';

export interface IConnectorChartingSchemesService {
    getConnectorChartingSchemesItems(chartingSchemesSetting: IConnectorSetting): Promise<IConnectorChartingSchemesItem[]>;
}

@Injectable()
export class ConnectorChartingSchemesService implements IConnectorChartingSchemesService {

    constructor() {}    

    static getConnectorChartingSchemesAsDto(chartingSchemesItem: IConnectorChartingSchemesItem): string {
        return UtilXml2Json.parseJsonToXmlString(chartingSchemesItem.chartingSchemes);
    }

    static findConnectorChartingSchemesItem(chartingSchemesItems: IConnectorChartingSchemesItem[], siteId: string): IConnectorChartingSchemesItem {
        return chartingSchemesItems && chartingSchemesItems.find(item => item.siteId === siteId);
    }

    async getConnectorChartingSchemesItems(chartingSchemesSetting: IConnectorSetting): Promise<IConnectorChartingSchemesItem[]> {
        const settingsValue = await UtilSettings.getSettingsValue(chartingSchemesSetting);
        // assumed that will be getting an array of item data
        const itemDataArray = settingsValue.value as ISettingsItemData[];
        return Promise.all(itemDataArray.map(async itemData => {
            return {
                siteId: itemData.id,
                chartingSchemes: await UtilXml2Json.parseXmlToJson(itemData.data)
            }
        }));
    }

}