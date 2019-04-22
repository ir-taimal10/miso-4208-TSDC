import {Controller, Get, Post, Put} from "@tsed/common";
import * as Express from "express";
import {StrategyPersistence} from "../../TestingTool.Persistence/Persistence/StrategyPersistence";
import {StorageService} from "../Services/StorageService";
import {MultipartFile} from "@tsed/multipartfiles";
import {MulterFile} from "../../TestingTool.Persistence/Models/MulterFile";
import {QueueService} from "../Services/QueueService";

@Controller("/strategy")
export class StrategyController {
    private _strategyPersistence;
    private _storageService;
    private _queueService;

    constructor() {
        this._strategyPersistence = new StrategyPersistence();
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
        var response = JSON.stringify(files[0]);
        var responseJson = JSON.parse(response);
        await this._strategyPersistence.createScriptPathStrategy(responseJson.key, responseJson.metadata.idStrategy);
        return responseJson;
    }
}