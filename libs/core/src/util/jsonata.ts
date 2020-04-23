import * as jsonata from 'jsonata'

export class UtilJsonata {

    /**
     * Transforms json from one object to another using the jsonata library
     * @param rawData json input data to be processed
     * @param transform the jsonata transform definition
     */
    static transform(rawData: any, transform: string): any {
        const expression = jsonata(transform);
        return expression.evaluate(rawData);
    }

}