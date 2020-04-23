import { Injectable } from '@nestjs/common';
import { IConnectorSetting } from '../manifest/marshalers/ConnectorManifestMarshaler';
import { UtilSettings, ISettingsItemData } from '../util/settings';
import { IConnectorTransformItem } from './interfaces/ITransformItem';

export interface IConnectorTransformService {
    getConnectorTransformItems(transformSetting: IConnectorSetting): Promise<IConnectorTransformItem[]>;
}

@Injectable()
export class ConnectorTransformService implements IConnectorTransformService {

    constructor() {}    

    static findConnectorTransformItem(connectorTransformItems: IConnectorTransformItem[], id: string): IConnectorTransformItem {
        return connectorTransformItems && connectorTransformItems.find(item => item.id === id);
    }

    async getConnectorTransformItems(transformSetting: IConnectorSetting): Promise<IConnectorTransformItem[]> {
        const settingsValue = await UtilSettings.getSettingsValue(transformSetting);
        // assumed that will be getting an array of item data
        const itemDataArray = settingsValue.value as ISettingsItemData[];
        return Promise.all(itemDataArray.map(async itemData => {
            return {
                id: itemData.id,
                transform: itemData.data // keep as string as a jsonata transform is not valid json
            }
        }));
    }


}