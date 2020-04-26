import path = require("path");

export const NODE_ENV: string = "NODE_ENV";
export const ENV_SERVER_PORT: string = "SERVER_PORT";
export const ENV_SSL_ENABLED: string = "SSL_ENABLED";
export const ENV_SSL_PORT: string = "SSL_PORT";
export const ENV_CONNECTORS_HOME = 'CONNECTORS_HOME'

export const DEFAULT_SERVER_PORT: number = 3000;
export const DEFAULT_CONNECTORS_HOME: string = 'libs/connectors';

export const ENV_CONN_LOGPAYLOADS: string = "CONN_LOGPAYLOADS";

export const SETTING_CONN_CONFIG: string = "i2.config";
export const SETTING_CONN_SCHEMAS: string = "i2.schemas";
export const SETTING_CONN_CHARTINGSCHEMES: string = "i2.chartingschemes";
export const SETTING_CONN_TYPEMAPS: string = "i2.typemaps";
export const SETTING_CONN_TRANSFORMS: string = "i2.transforms";

// default url paths for config/schema/chartingschemes
export const DEFAULT_URL_PATH_CONFIG = "config";
export const DEFAULT_URL_PATH_SCHEMA = "schema";
export const DEFAULT_URL_PATH_CHARTINGSCHEMES = "chartingschemes";
export const DEFAULT_URL_PATH_ACQUIRE = "acquire";
export const DEFAULT_URL_PATH_VALIDATE = "validate";
export const DEFAULT_URL_PATH_RELOAD = "reload";

export const DEFAULT_SITE_ID = "default";
export const DEFAULT_QUERY_SITE_ID = "siteid";
export const DEFAULT_QUERY_STRICT = "strict";
export const DEFAULT_QUERY_VERSION = "version";
export const DEFAULT_PARAM_SERVICE = "serviceName";
export const DEFAULT_PARAM_METHOD = "methodType";