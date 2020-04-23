
export class UtilGeneral {

    /**
     * Clean an id to remove any invalid characters for i2 Analyze
     * @param {string} id 
     */
    public static cleanId(id: string): string {
        return String(id)
            .replace(/,/g, '') // filter commas
            .replace(/\s/g, '') // filter whitespace
            .replace(/=/g, '') // filter '=' signs
            .replace(/\$/g, '') // filter the '$' signs
            .replace(/_/g, '') // filter the '_' signs
            .replace(/~/g, '') // filter the '~' signs
            .replace(/\//g, '') // filter the '/' signs
            .replace(/#/g, '') // filter the '#' signs
            .replace(/\+/g, '') // filter the '+' signs
            .replace(/-/g, '') // filter the '-' signs 
            .replace(/[()]/g, '') // filter the '()' signs
            .trim(); 
    }

    /**
     * Clean a date string for compatibility with i2 Analyze
     * @param {string} dateTime 
     */
    public static cleanDate(dateTime: string): string {
        return dateTime.replace(/Z/g, '');
    }


}