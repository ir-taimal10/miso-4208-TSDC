import * as AWS from "aws-sdk";
import * as fs from "fs-extra";
import * as PB from "progress";
import {awsConfig} from "../Config/AWSConfig";
import * as Path from "path";
import * as Extract from 'extract-zip';

export class StorageService {
    private _s3;
    private BUCKET_NAME = "tsdcgrupo5";
    private WORK_FOLDER = Path.join(__dirname, '..', '..', '..');

    constructor() {
        AWS.config.update(awsConfig);
        this._s3 = new AWS.S3({apiVersion: '2006-03-01'});
    }

    public async downloadFile(filename) {
        const self = this;
        const outputDir = self.WORK_FOLDER;
        const output = Path.join(outputDir, filename);
        const params = {
            Bucket: this.BUCKET_NAME,
            Key: filename
        };
        let bar;
        return new Promise(function (resolve, reject) {
            fs.ensureDir(Path.dirname(output))
                .then(() => {
                    const stream = fs.createWriteStream(output);
                    self._s3.getObject(params)
                        .on('httpHeaders', function (statusCode, headers, resp) {
                            // console.log('get file from s3 headers');
                            const len = parseInt(headers['content-length'], 10);
                            bar = new PB('  ' + filename + ': [:bar] :percent :etas', {
                                complete: '=',
                                incomplete: ' ',
                                width: 20,
                                total: len
                            });
                        })
                        .on('httpData', function (chunk) {
                            // console.log('get file from s3 data');
                            stream.write(chunk);
                            bar.tick(chunk.length);
                        })
                        .on('httpDone', function (response) {
                            // console.log('get file from s3 done');
                            if (response.error) {
                                reject(response.error);
                            } else {
                                resolve(output);
                            }
                            stream.end();
                        })
                        .send();
                })
                .catch(err => {
                    console.error(err)
                })
        });
    }


    private async listObjects() {
        const self = this;
        return new Promise(function (resolve, reject) {
            self._s3.listObjects({
                Bucket: self.BUCKET_NAME
            }, (err, data: any) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve(data);
            });
        });
    }

    private async extractZip(filePath) {
        const dir = Path.parse(filePath).dir;
        const name = Path.parse(filePath).name;
        return new Promise(function (resolve, reject) {
            Extract(filePath, {dir: Path.join(dir, '..', name)},
                async (err, data) => {
                    if (err) {
                        console.error('extraction failed.');
                        reject();
                    }
                    resolve(data);
                });
        })
    }

    private async emptyFolderBase() {
        await fs.emptyDirSync(Path.join(this.WORK_FOLDER, 'scriptTests'));
    }

    public async downloadFolder(folderPath: string) {
        await this.emptyFolderBase();
        const object: any = await this.listObjects();
        let elementsDownloaded = [];
        if (object && object.Contents && object.Contents.length > 0) {
            for (let index = 0; index < object.Contents.length; index++) {
                const elementData = object.Contents[index];
                if (elementData.Size != 0 && elementData.Key.indexOf(folderPath) >= 0) {
                    elementsDownloaded.push(elementData.Key);
                    const output = await this.downloadFile(elementData.Key);
                    if (elementData.Key.indexOf(".zip") >= 0) {
                        await this.extractZip(output);
                        console.log("output", output);
                    }
                }
            }
            if (elementsDownloaded.length > 0) {
                console.log("elementsDownloaded", elementsDownloaded);
            }
        }
    }

    public async uploadFromDir(startPath, idProcess, filter) {
        const self = this;
        if (!fs.existsSync(startPath)) {
            console.log("no dir ", startPath);
            return;
        }
        let files = fs.readdirSync(startPath);
        for (let i = 0; i < files.length; i++) {
            let filePath = Path.join(startPath, files[i]);
            let stat = fs.lstatSync(filePath);
            if (stat.isDirectory()) {
                await this.uploadFromDir(filePath, idProcess, filter); //recurse
            }
            else if (filePath.indexOf(filter) >= 0) {
                console.log('-- found: ', filePath);
                const baseName = Path.basename(filePath);
                await self.uploadFileToS3(filePath, `${idProcess}/${baseName}`);
            }
        }
    }


    public async uploadFileToS3(filePath, key) {
        let location = "";
        const uploadParams = {
            Bucket: this.BUCKET_NAME,
            Key: '',
            Body: ''
        };
        const fileStream = fs.createReadStream(filePath);
        fileStream.on('error', function (err) {
            console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        uploadParams.Key = 'screenTests/' + key;

        // call S3 to retrieve upload file to specified bucket
        await this._s3.upload(uploadParams, function (err, data) {
            if (err) {
                console.log("Error", err);
            }
            if (data) {
                console.log("uploadFileToS3: OK ", data);
            }
            //fs.unlink(filePath);

        });
        return location;
    }

}