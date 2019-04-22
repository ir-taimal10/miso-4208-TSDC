import * as AWS from 'aws-sdk';
import {UtilsService} from "./UtilsService";
import * as Q from "q";
import * as PB from "progress";
import * as fs from "fs-extra";
import * as Path from "path";
import {StrategyPersistence} from "../../TestingTool.Persistence/Persistence/StrategyPersistence";
import {StorageService} from "../../TestingTool.Services/Services/StorageService";
import {QueueService} from "../../TestingTool.Services/Services/QueueService";
import {AUTPersistence} from "../../TestingTool.Persistence/Persistence/AUTPersistence";
import Extract = require('extract-zip');

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

    private _strategyPersistence;
    private _storageService;
    private _queueService;
    private _autPersistence;

    constructor() {
        AWS.config.update({
            accessKeyId: process.env.TSDC_SERVICES_ACCESS_KEY_ID,
            secretAccessKey: process.env.TSDC_SERVICES_SECRET_KEY,
            region: 'us-west-2'
        });
        this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});
        this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
        this._strategyPersistence = new StrategyPersistence();
        this._storageService = new StorageService();
        this._queueService = new QueueService();
        this._autPersistence = new AUTPersistence();
    }

    async runStrategy() {
        console.log("┌───────────────┬───────────────┬──────────────────────┐");
        console.log("│   Loading Task From Queue  ...                            │");
        const task = await this._queueService.getTaskFromQueue();
        console.log(`│   Loading Task From Queue   ${JSON.stringify(task)}       │`);
        if (task) {
            await this.processTask(task[0]);
        }
        console.log("└───────────────┴───────────────┴──────────────────────┘");
    }

    async processTask(idStrategy: string) {
        console.log('ProcessTask for strategy:', idStrategy);
        const strategy = await this._strategyPersistence.getStrategy(idStrategy);
        if (strategy && strategy.idAUT) {
            const scriptPathStrategy = await this._strategyPersistence.getScriptsPathStrategy(idStrategy);
            const aut = await this._autPersistence.getAUT(strategy.idAUT);

            if (scriptPathStrategy && scriptPathStrategy.length > 0) {
                scriptPathStrategy.forEach(async (elementData) => {
                    const self = this;
                    this.downloadScripts(elementData.scriptPath, idStrategy).then(function (result) {
                        const testStrategy = strategy.definition;
                        if (aut.type == 'mobile') {
                            testStrategy.forEach(async (testName) => {
                                self.runMobileTest(testName, 'testStrategy.apkName');
                            });
                        } else if (aut.type == 'web') {
                            self.runWebTest(testStrategy, elementData, idStrategy, self);
                        } else {
                            console.log('App type not supported');
                        }
                    });
                });
            }
        }
    }


    public async runWebTest(testStrategy, elementData, idStrategy, self) {
        testStrategy.forEach(async (testName) => {
            const output = Path.join(Path.join(__dirname, '..', '..', '..'), "");
            const outputScriptTestsSpecific = output + '/runTests/' + idStrategy + '/' + testName + '/' + testName;
            Extract(output + '/' + elementData.scriptPath, {dir: output + '/runTests/' + idStrategy + '/'}, (err, data) => {
                if (err) {
                    console.error('extraction failed111.');
                }
                self.prepareWebTestName(outputScriptTestsSpecific, testName, output);
                self.executeCommand(testName);
            });
        });
    }

    public async prepareWebTestName(outputScriptTestsSpecific: string, testName: string, output: string) {
        if ('cypress' == testName) {
            //TODO REMOVE FILES miso-4208-TSDC/TestingTool.Runner/cypress because existing files..
            fs.copy(outputScriptTestsSpecific + '/integration', output + '/TestingTool.Runner/cypress/', err => {
                if (err) return console.error(err)
            });
            //TODO REMOVE FILES scriptTests and runTests
        } else {
            console.log('testName not supported!')
        }
    }

    public async executeCommand(testName: string) {
        // TODO UPDATE STATE THE script_path TO PROCESSING
        let command = 'npm run test:' + testName;
        console.log('Running test:', command);
        const util = new UtilsService();
        await util.executeCommand(command).then(response => console.log('output', response));
        // TODO UPDATE STATE THE script_path TO FINISHED
        // TODO COPY SCREENSHOTS TO UBICATIONS FOR LOAD TO S3 /Users/fredygonzalocaptuayonovoa/project/uniandes/miso-4208-TSDC/cypress/screenshots/limesurvey_test_e2e_spec.js
        console.log('Finished test:', command);
    }

    public async runMobileTest(testName, apkName) {
        console.log('Running test:', testName);
        const platform = process.platform;
        if (testName == 'adb_monkey') {
            let command = `./adb`;
            if (platform == 'win32') {
                command = `adb`;
            }
            new UtilsService().executeCommand('emulator @Pixel_2_API_28')
                .then(response => {
                    new UtilsService().executeCommand(`${command} shell monkey -p -v 10000`)
                        .then(response => {
                            console.log("output", response);
                            new UtilsService().executeCommand(`${command} -e emu kill`).then(response => {
                                console.log("Test Mobile finished", platform)
                            });
                        });
                });
        } else if (testName == "calabash") {
            let command = `calabash-android run ${apkName}`;
            if (platform == 'win32') {
                command = `calabash-android run ${apkName}`;
            }
            new UtilsService().executeCommand(command)
                .then(response => console.log("output", response));
            console.log("Test Mobile finished", platform);
        } else {
            console.log("Test mobile not supported");
        }
    }

    public async downloadFile(filename: string, scriptPathStrategy: string, idStrategy: string) {

        const self = this;
        const outputDir = Path.join(__dirname, '..', '..', '..');
        const deferred = Q.defer();
        const output = Path.join(outputDir, filename);
        const params = {
            Bucket: 'tsdcgrupo5',
            Key: filename
        };
        let bar;

        if (scriptPathStrategy === (filename)) {
            // TODO UPDATE STATE THE script_path TO SET_UP
            if (!fs.existsSync(Path.dirname(output))) {
                fs.ensureDir(Path.dirname(output))
                    .then(() => {
                            const stream = fs.createWriteStream(output);
                            self.s3.getObject(params)
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

                        }
                    )
                    .catch(err => {
                        console.error(err)
                    })
            }
        }
        return deferred.promise;
    }

    public downloadScripts(scriptPathStrategy: string, idStrategy: string) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.s3.listObjects({
                Bucket: 'tsdcgrupo5'
            }, (err, data) => {
                if (err) {
                    console.log(err);
                    resolve({});
                }
                if (data && data.Contents && data.Contents.length > 0) {
                    data.Contents.forEach(async (elementData, index) => {
                        if (elementData.Size != 0) {
                            if (scriptPathStrategy === (elementData.Key)) {
                                await self.downloadFile(elementData.Key, scriptPathStrategy, idStrategy).then(() => {
                                        resolve({});
                                    }
                                )
                            }
                        }
                    });
                } else {
                    resolve({});
                }
            });
        });
    }
}
