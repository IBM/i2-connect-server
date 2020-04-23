import * as xml2js from "xml2js";

export class UtilXml2Json {

    static async parseXmlToJson(schemaXml: any): Promise<any> {
        const promise = await new Promise((resolve, reject) => {
            const parser = new xml2js.Parser({ explicitArray: false });
        
            parser.parseString(schemaXml, (error: Error, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
        return promise;
    }

    static parseJsonToXmlString(json: any) {
        return new xml2js.Builder().buildObject(json);
    }

}