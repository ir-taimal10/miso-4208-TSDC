import {UtilsService} from "./UtilsService";
import * as Path from "path";
import {StrategyPersistence} from "../../TestingTool.Persistence/Persistence/StrategyPersistence";
import {StorageService} from "../../TestingTool.Services/Services/StorageService";
import {QueueService} from "../../TestingTool.Services/Services/QueueService";
import {AUTPersistence} from "../../TestingTool.Persistence/Persistence/AUTPersistence";
import {exec, cd} from "shelljs";
import {Guid} from "guid-typescript";
import {StrategyTracePersistence} from "../../TestingTool.Persistence/Persistence/StrategyTracePersistence";
import {IProcess} from "../../TestingTool.Persistence/Models/Process";

export class TestRunner {

    private _strategyPersistence;
    private _strategyTracePersistence;
    private _storageService;
    private _queueService;
    private _autPersistence;
    private currentProcess: IProcess;

    constructor() {
        this._strategyPersistence = new StrategyPersistence();
        this._strategyTracePersistence = new StrategyTracePersistence();
        this._storageService = new StorageService();
        this._queueService = new QueueService();
        this._autPersistence = new AUTPersistence();
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
            await this._storageService.downloadFolder(strategy.scriptPath);
            const testStrategy = strategy.definition;
            if (testStrategy) {
                if (aut.type == "mobile") {
                    for (let index = 0; index < testStrategy.length; index++) {
                        const testName = testStrategy[index];
                        await this.runMobileTest(testName, aut.url);
                    }
                } else if (aut.type == "web") {
                    for (let index = 0; index < testStrategy.length; index++) {
                        const testName = testStrategy[index];
                        await this.runWebTest(testName, aut.url);
                    }
                } else {
                    console.log("App type not supported ");
                }
            }
        }
    }


    public async runWebTest(testName: string, url: string) {
        console.log("Running test: ", testName);
        await this.registerStrategyTrace("RUNNING", `Running ${testName}`);
        const util = new UtilsService();
        const platform = process.platform;
        let command = 'npm run test:' + testName; // this run in IOS
        if (platform == 'win32') {
            command = 'npm.cmd run test:' + testName;
        }
        await util.executeCommand(command);
        console.log(`Test ${testName}, ${url} finished`, platform);
        await this.registerStrategyTrace("FINISHED", `Test ${testName}, ${url} finished`);
        // TODO COPY SCREENSHOTS TO UBICATIONS FOR LOAD TO S3
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

            const command = 'calabash-android run ' + Path.join(__dirname, '..', '..', '..', 'scriptTests', 'calabash', apkName);
            console.log("command " + command);
            await util.execute(command);
            await this.registerStrategyTrace("FINISHED", `Test ${testName}, ${apkName} finished`);
        } else {
            console.log("Test mobile not supported");
        }
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
