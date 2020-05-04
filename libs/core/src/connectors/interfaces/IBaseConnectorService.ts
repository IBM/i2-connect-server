import { IConnectorManifest } from "../../manifest/marshalers/ConnectorManifestMarshaler";
import { IConnectorConfigDto } from "../../config/dto/ConnectorConfigDto";
import { ISettingsItemData } from "../../util/settings";
import { ITypeMap } from "../../typemap/marshalers/TypeMapMarshaler";
import { IReloadCacheResponseDto, IServiceRequestQuery } from "@app/core/service";

export interface IBaseConnectorService {

    readonly connectorId: string;
    readonly connectorName: string;

    initializeAsync(connectorManifest: IConnectorManifest): Promise<void>;
    getConnectorConfigAsDto(requestQuery: IServiceRequestQuery): IConnectorConfigDto;
    getConnectorSchemaAsDto(requestQuery: IServiceRequestQuery): string;
    getConnectorChartingSchemesAsDto(requestQuery: IServiceRequestQuery): string;

    getTypeMap(siteId: string): ITypeMap;
    getTransform(id: string): string;
    getSettingValueAsync(id: string, isRequired?: boolean): Promise<any>;

    getSettingLogPayloads(): boolean;
    reloadCachesAsync(): Promise<IReloadCacheResponseDto>;
}
