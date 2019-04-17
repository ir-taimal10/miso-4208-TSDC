import {Controller, Get, Post, Put} from "@tsed/common";
import * as Express from "express";
import {StrategyPersistence} from "../../TestingTool.Persistence/Persistence/StrategyPersistence";
import {StorageService} from "../Services/StorageService";
import {MulterOptions, MultipartFile} from "@tsed/multipartfiles";
import {MulterFile} from "../../TestingTool.Persistence/Models/MulterFile";

@Controller("/strategy")
export class StrategyController {
    private _strategyPersistence;
    private _storageService;

    constructor() {
        this._strategyPersistence = new StrategyPersistence();
        this._storageService = new StorageService();
    }

    @Get("")
    async getStrategies(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await  this._strategyPersistence.getStrategies();
        return result || [];
    }

    @Get("/:idStrategy")
    async getStrategy(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await  this._strategyPersistence.getStrategy(request.params.idStrategy);
        return result[0] || {};
    }

    @Post("")
    async createStrategy(request: Express.Request, response: Express.Response): Promise<any> {
        await this._storageService.createFolder();
        const result = await  this._strategyPersistence.createStrategy(request.body);
        return result || {};
    }

    @Put("/:idStrategy/scripts")
    async uploadStrategyScripts(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await  this._strategyPersistence.getStrategy(request.params.idStrategy);
        return result[0] || {};
    }


    @Post('/file')
    @MulterOptions({dest: "/other-dir"})
    async uploadFile(@MultipartFile('file') file: MulterFile): Promise<any> {
        return {};
    }


    @Post('/files')
    async uploadFiles(@MultipartFile("files", 4) files: MulterFile[]): Promise<any> {
        console.log("files: ", files);
        return {};
    }

}