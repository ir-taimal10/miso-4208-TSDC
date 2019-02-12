import * as xml2js from "xml2js";
import * as fs from "fs";
import * as node_cmd from 'node-run-cmd';


export class UtilsService {
    public xml2js(xml: any) {
        return new Promise((resolve, reject) => {
            xml2js.parseString(xml, function (err, result) {
                if (err) reject(err);
                resolve(result);
            });
        });
    }

    public copyFile = (source, target) => {
        return new Promise((resolve, reject) => {
            console.log(`UtilsService copyFile start: source = ${source}, target = ${target}`);
            fs.copyFile(source, target, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    };


    public removeFile = path => {
        return new Promise((resolve, reject) => {
            fs.unlink(path, (err) => {
                if (err) resolve(err);
                resolve();
            });
        });
    };

    public cleanFolder = path => {
        return new Promise((resolve, reject) => {
            fs.rmdir(path, (err) => {
                if (err) resolve(err);
                resolve();
            });
        });
    };

    public createFolder = path => {
        return new Promise((resolve, reject) => {
            console.log(`UtilsService createFolder start: path = ${path}`);
            fs.mkdir(path, (err) => {
                if (err) resolve(err);
                resolve();
            });
        });
    };

    public readFile = (path) => {
        return new Promise((resolve, reject) => {
            console.log(`UtilsService readFile start: path = ${path}`);
            fs.readFile(path, 'utf-8', (err, data) => {
                if (!err) resolve(data);
                else reject(err);
            });
        });
    };

    public writeFile = (path, content) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, content, (err) => {
                if (err) reject(err)
                resolve();
            });
        });
    };

    public appendFile = (path, content) => {
        try {
            fs.appendFileSync(path, content);
        } catch (err) {
            console.log('Error escribiendo en archivo:' + path + ' error: ' + err);
        }
    };

    public validateCreateFolder = (path) => {
        return new Promise((resolve, reject) => {
            fs.exists(path, (exists) => {
                if (!exists) {
                    this.createFolder(path);
                    resolve();
                }
            });
        });
    };

    public executeCommand = command => {
        return new Promise((resolve, reject) => {
            console.log(`UtilsService executeCommand start: command = ${command}`);
            node_cmd.run(command)
                .then(function (exitCodes) {
                    console.log(`UtilsService executeCommand ends: exitCodes = ${exitCodes}`);
                    resolve();
                }, function (err) {
                    console.log(`UtilsService executeCommand ends: error = ${err}`);
                    reject(err);
                });
        });
    };

    public executeCommandsWithOptions = (commands, options) => {
        return new Promise((resolve, reject) => {
            commands.forEach(function (command) {
                console.log(`UtilsService executeCommand start: command = ${command}`);
            });
            node_cmd.run(commands, options)
                .then(function (exitCodes) {
                    console.log(`UtilsService executeCommand ends: exitCodes = ${exitCodes}`);
                    resolve();
                }, function (err) {
                    console.log(`UtilsService executeCommand ends: error = ${err}`);
                    reject(err);
                });
        });
    };
}

