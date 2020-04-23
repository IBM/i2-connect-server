import * as fse from "fs-extra";
import * as path from 'path';

export class UtilFileIO {

    static async readJsonFile(path: string): Promise<any> {
        return await fse.readJson(path);
    }

    static async readFile(path: string): Promise<string> {
        return await this.readFileWithEncoding(path, 'utf8');
    }

    static async readFileWithEncoding(path: string, encoding?: string): Promise<string> {
        return await fse.readFile(path, encoding);
    }

    static getFilesInFolder(folderPath: string, includeDirs: boolean = false) {
        const files = fse.readdirSync(folderPath);

        return files.filter((file) => {
            const filePath = path.join(folderPath, file);
            const isDir = fse.statSync(filePath).isDirectory();
            if (!isDir || includeDirs) {
                return filePath;
            }
        });
    }

    static getFileNameNoExt(filePath: string) {
        const fileName = path.basename(filePath);
        return fileName.substring(0, fileName.indexOf('.'));
    }

    /**
     * Recursive function to find all files in a given folder by their extension, will automatically
     * search in any subfolders.
     * @param folder The folder search in (and all subfolders)
     * @param ext The file extension
     */
    static FindFilesByExt(folder: string, ext: string, files?: string[], result?: string[]): string[] {

        files = files || fse.readdirSync(folder);
        result = result || [];

        files.forEach((file) => {
            const filePath = path.join(folder, file);
            if ((fse.statSync(filePath)).isDirectory()) {
                result = this.FindFilesByExt(filePath, ext, fse.readdirSync(filePath), result);
            } else {
                if (file.substr(-1 * (ext.length + 1)) === '.' + ext) {
                    if (result) {
                        result.push(filePath);
                    }
                }
            }
        });
        return result;
    }

}