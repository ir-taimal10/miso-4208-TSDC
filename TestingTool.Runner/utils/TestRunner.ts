import {UtilsService} from "./UtilsService";
import * as Path from "path";
import {StrategyPersistence} from "../../TestingTool.Persistence/Persistence/StrategyPersistence";
import {StorageService} from "../../TestingTool.Services/Services/StorageService";
import {QueueService} from "../../TestingTool.Services/Services/QueueService";
import {AUTPersistence} from "../../TestingTool.Persistence/Persistence/AUTPersistence";
import {Guid} from "guid-typescript";
import {StrategyTracePersistence} from "../../TestingTool.Persistence/Persistence/StrategyTracePersistence";
import {IProcess} from "../../TestingTool.Persistence/Models/Process";
import {ImageCompareService} from "../../TestingTool.Services/Services/ImageCompareService";

export class TestRunner {

    private _strategyPersistence;
    private _strategyTracePersistence;
    private _storageService;
    private _queueService;
    private _autPersistence;
    private _imageCompareService;
    private currentProcess: IProcess;
    private IMAGES_FOLDER = 'screenTests';

    constructor() {
        this._strategyPersistence = new StrategyPersistence();
        this._strategyTracePersistence = new StrategyTracePersistence();
        this._storageService = new StorageService();
        this._queueService = new QueueService();
        this._autPersistence = new AUTPersistence();
        this._imageCompareService = new ImageCompareService();
        this.currentProcess = {};
    }

    async runStrategy() {
        this.currentProcess.idProcess = Guid.raw();
        console.log("┌───────────────┬───────────────┬──────────────────────┐");
        console.log("│   Loading Task From Queue  ...                       │");
        const task = await this._queueService.getTaskFromQueue();
        task[0] ? console.log(`│   Loading Task From Queue   ${JSON.stringify(task)}  │`) : null;
        if (task) {
            await this.processTask(task[0]);
        }
        console.log("└───────────────┴───────────────┴──────────────────────┘");
    }

    async processTask(idStrategy: string) {
        console.log('│   Process Id: ', this.currentProcess.idProcess);
        idStrategy ? console.log('│   Process Task for strategy:', idStrategy) : null;
        const strategy = await this._strategyPersistence.getStrategy(idStrategy);
        if (strategy && strategy.idAUT && strategy.scriptPath) {
            const aut = await this._autPersistence.getAUT(strategy.idAUT);
            this.currentProcess.aut = aut;
            this.currentProcess.strategy = strategy;
            await this.registerStrategyTrace("INIT", `Init task ${idStrategy}`);
            await this._storageService.emptyFolderBase('scriptTests');
            await this._storageService.downloadFolder(strategy.scriptPath);
            const mutationPath = strategy.mutationPath;
            if (aut.type == "mobile") {
                if (mutationPath) {
                    const util = new UtilsService();
                    //await this.runMobileSuite(strategy, aut, aut.url);
                    await this._storageService.downloadFolder(mutationPath);
                    const apksTempFolder = Path.join(__dirname, '..', '..', '..', mutationPath);
                    const apksToTest = await this._storageService.findFilesOnFolder(apksTempFolder, '.apk');
                    for (let index = 0; index < apksToTest.length; index++) {
                        const apkPath = apksToTest[index];
                        console.log('Apk to test path: ', apkPath);
                        const pathMutation = Path.join(__dirname, '..', '..', '..', 'scriptTests','calabash', apkPath)
                        await util.copyFile(Path.join(__dirname, '..', '..', '..', mutationPath, apkPath), pathMutation);
                        await this.runMobileSuite(strategy, aut, pathMutation);
                    }
                } else {
                    await this.runMobileSuite(strategy, aut, aut.url);
                }
            } else if (aut.type == "web") {
                await this.runWebSuite(strategy, aut);
            } else {
                console.log("App type not supported ");
            }
        }
    }

    public async runMobileSuite(strategy, aut, apkPath) {
        const testStrategy = strategy.definition;
        if (testStrategy) {
            for (let index = 0; index < testStrategy.length; index++) {
                const testName = testStrategy[index];
                await this.runMobileTest(testName, apkPath);
            }
        }
    }

    public async runWebSuite(strategy, aut) {
        const testStrategy = strategy.definition;
        if (testStrategy) {
            for (let index = 0; index < testStrategy.length; index++) {
                const testName = testStrategy[index];
                if (testName.toLocaleLowerCase() === "vrt") {
                    await this.runVRT(strategy.idStrategy);
                } else {
                    await this.runWebTest(testName, aut.url, strategy.headed, strategy.viewportWidth, strategy.viewportHeight);
                }
            }
        }
    }


    public async runWebTest(testName: string, url: string, headed: number, viewportWidth: number, viewportHeight: number) {
        console.log("Running test: ", testName);
        await this.registerStrategyTrace("RUNNING", `Running ${testName}`);
        const util = new UtilsService();
        const platform = process.platform;
        let command = 'npm run test:' + testName; // this run in IOS
        let customCommand = ' bar=';
        let customCommandFlag = false;

        if (platform == 'win32') {
            command = 'npm.cmd run test:' + testName;
        }

        if (viewportWidth != null && viewportHeight !== null) {
            customCommand = customCommand + "viewportWidth=" + viewportWidth + ",viewportHeight=" + viewportHeight
            customCommandFlag = true;
        }

        if (headed == 1) {
            customCommand = customCommand + " --headed ";
            customCommandFlag = true;
        }

        if (customCommandFlag == true) {
            //command = command + customCommand;
        }

        await util.executeCommand(command);
        console.log(`Test ${testName}, ${url} finished`, platform);
        await this.uploadScreenShots();
        await this.registerStrategyTrace("FINISHED", `Test ${testName}, ${url} finished`);
    }


    public async runVRT(idStrategy: string) {
        const lastStrategyProcess = await this._strategyTracePersistence.getLastStrategyTrace(idStrategy);
        if (lastStrategyProcess.length > 1) {
            const pathProcess0 = `${this.IMAGES_FOLDER}/${lastStrategyProcess[0].idProcess}`;
            const pathProcess1 = `${this.IMAGES_FOLDER}/${lastStrategyProcess[1].idProcess}`;
            const targetPathBefore = Path.join(__dirname, '..', '..', '..', 'screenTests', lastStrategyProcess[0].idProcess);
            const targetPathAfter = Path.join(__dirname, '..', '..', '..', 'screenTests', lastStrategyProcess[1].idProcess);
            const targetPathResult = Path.join(__dirname, '..', '..', '..', 'screenTests', 'result');
            await this._storageService.emptyFolderBase('screenTests');
            await this._storageService.downloadFolder(pathProcess0);
            await this._storageService.downloadFolder(pathProcess1);
            const result = await this._imageCompareService.compareImagesFromDir(targetPathBefore, targetPathAfter, targetPathResult);
            await this.registerStrategyTrace("VRT", JSON.stringify(result));
        }
    }

    public async runMobileTest(testName: string, url: string) {
        const self = this;
        await self.executeMobileCommand(testName, url);
    }

    public async executeMobileCommand(testName, apkName) {
        console.log('Running test:', testName);
        await this.registerStrategyTrace("RUNNING", `Running ${testName}`);
        const util = new UtilsService();
        if (testName == 'adb_monkey1') {
            /*
            let command = `./adb`;Running test:
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
             */
        } else if (testName == "calabash") {
            util.cd(Path.join(__dirname, '..', '..', '..', 'scriptTests', 'calabash'));
            await util.execute('pwd');
            const command = 'calabash-android run ' + apkName;
            await util.execute(command);
            await this.registerStrategyTrace("FINISHED", `Test ${testName}, ${apkName} finished`);
        } else {
            console.log("Test mobile not supported");
        }
    }

    private async uploadScreenShots() {
        const screenShotsDir = Path.join(__dirname, '..', '..', '..', 'scriptTests');
        await this._storageService.uploadFromDir(screenShotsDir, this.currentProcess.idProcess, '.png');
    }

    private async registerStrategyTrace(status: string, trace: string) {
        await this._strategyTracePersistence.registerStrategyTrace({
            status: status,
            idProcess: this.currentProcess.idProcess,
            idStrategy: this.currentProcess.strategy.idStrategy,
            trace: trace
        });
    }
}
