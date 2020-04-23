import { IConnectorManifest } from "../../manifest/marshalers/ConnectorManifestMarshaler";
import { IConnectorConfigDto } from "../../config/dto/ConnectorConfigDto";
import { ISettingsItemData } from "../../util/settings";
import { ITypeMap } from "../../typemap/marshalers/TypeMapMarshaler";

export interface IBaseConnectorService {

    readonly connectorId: string;
    readonly connectorName: string;

    initializeAsync(connectorManifest: IConnectorManifest): Promise<void>;
    getConnectorConfigAsDto(siteId: string, strict: boolean): IConnectorConfigDto;
    getConnectorSchemaAsDto(siteId: string, strict: boolean): string;
    getConnectorChartingSchemesAsDto(siteId: string, strict: boolean): string;

    getTypeMap(siteId: string): ITypeMap;
    getTransform(id: string): string;
    getSettingValueAsync(id: string): Promise<ISettingsItemData>;

    getSettingLogPayloads(): boolean;

}
