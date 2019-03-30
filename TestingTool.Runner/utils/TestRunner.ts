import * as AWS from 'aws-sdk';
import {UtilsService} from "./UtilsService";
import * as Q from "q";
import * as PB from "progress";
import * as fs from "fs";
import * as Path from "path";

export class TestRunner {
    private sqs: any;
    private s3: any;
    private params: any = {
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: process.env.TSDC_SERVICES_QUEUE_URL,
        VisibilityTimeout: 0,
        WaitTimeSeconds: 0
    };

    constructor() {
        AWS.config.update({
            accessKeyId: process.env.TSDC_SERVICES_ACCESS_KEY_ID,
            secretAccessKey: process.env.TSDC_SERVICES_SECRET_KEY,
            region: 'us-west-2'
        });
        this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});
        this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
    }

    async getTaskFromQueue() {
        await this.sqs.receiveMessage(this.params, async (err, data) => {
            if (err) {
                console.log("Receive Error", err);
            } else {
                if (data && data.Messages) {
                    data.Messages.forEach(async (message, index) => {
                        await this.deleteTaskFromQueue(message.ReceiptHandle);
                        await this.processTask(message.Body);
                    });
                } else {
                    console.log("No message to process");
                }
            }
        });
    }

    public async deleteTaskFromQueue(receiptHandle) {
        const deleteParams = {
            QueueUrl: process.env.TSDC_SERVICES_QUEUE_URL,
            ReceiptHandle: receiptHandle
        };
        await this.sqs.deleteMessage(deleteParams, async (err, data) => {
            if (err) {
                console.log("Delete Error", err);
            }
        });
    }

    async processTask(strategy: string) {
        console.log("Test to execute: ", strategy);
        //const testsToRun = testTypes.split(',');
        const testStrategy = JSON.parse(strategy);
        if (testStrategy.appType == "mobile") {
            testStrategy.tests.forEach(async (testName, index) => {
                await this.runMobileTest(testName, testStrategy.domain, testStrategy.apkName);
            });
        }
        else if (testStrategy.appType == "web") {
            testStrategy.tests.forEach(async (testName, index) => {
                await this.runWebTest(testName, testStrategy.domain);
            });
        } else {
            console.log("App type not supported ");
        }
    }

    async runWebTest(testName, domain) {
        console.log("Running test: ", testName);
        const util = new UtilsService();
        const platform = process.platform;
        let command = `npm run test: ${testName}`;
        if (platform == 'win32') {
            command = `npm.cmd run test: ${testName}`;
        }
        await util.executeCommand(command)
            .then(response => console.log("output", response));
        console.log(`Test ${testName}, ${domain} finished`, platform);
    }

    async runMobileTest(testName, domain, apkName) {
        console.log("Running test: ", testName);
        const platform = process.platform;
        if (testName == "adb_monkey") {
            let command = `./adb`;
            if (platform == 'win32') {
                command = `adb`;
            }
            new UtilsService().executeCommand('emulator @Pixel_2_API_28')
                .then(response => {
                    new UtilsService().executeCommand(`${command} shell monkey -p ${domain} -v 10000`)
                        .then(response => {
                            console.log("output", response);
                            new UtilsService().executeCommand(`${command} -e emu kill`).then(response => {
                                console.log("Test Mobile finished", platform)
                            });
                        });
                });
        }

        else if (testName == "calabash") {
            let command = `calabash-android run ${apkName}`;
            if (platform == 'win32') {
                command = `calabash-android run ${apkName}`;
            }
            new UtilsService().executeCommand(command)
                .then(response => console.log("output", response));
            console.log("Test Mobile finished", platform);
        }
        else {
            console.log("Test mobile not supported");
        }
    }

    public async downloadFile(filename) {
        const outputDir = Path.join(__dirname, '..', '..', '..');
        const deferred = Q.defer(),
            output = Path.join(outputDir, filename),
            stream = fs.createWriteStream(output),
            params = {
                Bucket: 'tsdcgrupo5',
                Key: filename
            };
       /* if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }*/
        let bar;
        console.log('get file from s3', Path.join(__dirname, filename));
        this.s3.getObject(params)
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
        return deferred.promise;
    }

    public async downloadSimple(filename) {
        const file = fs.createWriteStream(Path.join(__dirname, '..', '..', '..', filename));
        this.s3
            .getObject({
                Bucket: 'tsdcgrupo5',
                Key: filename
            })
            .on('error', function (err) {
                console.log(err);
            })
            .on('httpData', function (chunk) {
                file.write(chunk);
            })
            .on('httpDone', function () {
                file.end();
            })
            .send();
    }

}
