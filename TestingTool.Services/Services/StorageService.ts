import * as AWS from "aws-sdk";
import * as fs from "fs-extra";
import * as Q from "q";
import * as PB from "progress";
import {awsConfig} from "../Config/AWSConfig";
import * as Path from "path";

export class StorageService {
    private _s3;

    constructor() {
        AWS.config.update(awsConfig);
        this._s3 = new AWS.S3({apiVersion: '2006-03-01'});
    }

    public async createFolder(){

    }


    public async downloadFile(filename) {
        const self = this;
        const outputDir = Path.join(__dirname, '..', '..', '..');
        const deferred = Q.defer();
        const output = Path.join(outputDir, filename);
        const params = {
            Bucket: 'tsdcgrupo5',
            Key: filename
        };
        let bar;
        if (!fs.existsSync(Path.dirname(output))) {
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
                                deferred.reject(response.error);
                            } else {
                                deferred.resolve(output);
                            }
                            stream.end();
                        })
                        .send();
                })
                .catch(err => {
                    console.error(err)
                })
        }
        return deferred.promise;
    }

    public async downloadFolder() {
        this._s3.listObjects({
            Bucket: 'tsdcgrupo5'
        }, (err, data) => {
            if (err) {
                console.log(err);
            }
            if (data && data.Contents && data.Contents.length > 0) {
                data.Contents.forEach(async (elementData, index) => {
                    if (elementData.Size != 0) {
                        await this.downloadFile(elementData.Key)
                    }
                });
            }
        });
    }
}