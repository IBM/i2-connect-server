import { Provider } from "@nestjs/common";

export interface IConnectorProvidersFactory {

    createConnectorProviders(): Provider[];

}