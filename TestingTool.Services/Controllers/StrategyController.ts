import {Controller, Get, Post, Put} from "@tsed/common";
import * as Express from "express";
import {StrategyPersistence} from "../../TestingTool.Persistence/Persistence/StrategyPersistence";
import {StorageService} from "../Services/StorageService";
import {MultipartFile} from "@tsed/multipartfiles";
import {MulterFile} from "../../TestingTool.Persistence/Models/MulterFile";
import {QueueService} from "../Services/QueueService";
import {StrategyTracePersistence} from "../../TestingTool.Persistence/Persistence/StrategyTracePersistence";

@Controller("/strategy")
export class StrategyController {
    private _strategyPersistence;
    private _storageService;
    private _queueService;
    private _strategyTracePersistence;

    constructor() {
        this._strategyPersistence = new StrategyPersistence();
        this._strategyTracePersistence = new StrategyTracePersistence();
        this._storageService = new StorageService();
        this._queueService = new QueueService();
    }

    @Get("")
    async getStrategies(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await this._strategyPersistence.getStrategies();
        return result || [];
    }

    @Get("/:idStrategy")
    async getStrategy(request: Express.Request, response: Express.Response): Promise<any> {
        const strategy = await this._strategyPersistence.getStrategy(request.params.idStrategy);
        return strategy;
    }

    @Get("/:idStrategy/trace")
    async getStrategyTraces(request: Express.Request, response: Express.Response): Promise<any> {
        const strategyTraces = await  this._strategyTracePersistence.getStrategyTraces(request.params.idStrategy);
        return strategyTraces;
    }

    @Post("/:idStrategy/run")
    async runStrategy(request: Express.Request, response: Express.Response): Promise<any> {
        const strategy = await this._strategyPersistence.getStrategy(request.params.idStrategy);
        if (strategy && strategy.idStrategy) {
            await this._queueService.pushTaskToQueue(strategy.idStrategy);
            return strategy;
        } else {
            return {"error": "Strategy no exists"}
        }

    }

    @Post("")
    async createStrategy(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await this._strategyPersistence.createStrategy(request.body);
        return result || {};
    }

    @Put("/:idStrategy/:testType/scripts")
    async uploadStrategyScripts(@MultipartFile("files") files: MulterFile[]): Promise<any> {
        const response = JSON.stringify(files[0]);
        const responseJson = JSON.parse(response);
        await this._strategyPersistence.createScriptPathStrategy({
            scriptPath: responseJson.key,
            idStrategy: responseJson.metadata.idStrategy,
            testType: responseJson.metadata.testType
        });
        return responseJson;
    }
}