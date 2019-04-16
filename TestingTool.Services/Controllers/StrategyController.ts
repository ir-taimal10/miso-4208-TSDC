import {Controller, Get, Post} from "@tsed/common";
import * as Express from "express";
import {StrategyPersistence} from "../../TestingTool.Persistence/StrategyPersistence";

@Controller("/strategy")
export class StrategyController {
    private _strategyPersistence;

    constructor() {
        this._strategyPersistence = new StrategyPersistence();
    }

    @Get("")
    async getStrategies(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await  this._strategyPersistence.getStrategies();
        return result || [];
    }

    @Get("/:id")
    async getStrategy(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await  this._strategyPersistence.getStrategy(request.params.id);
        return result[0] || {};
    }

    @Post("")
    async createStrategy(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await  this._strategyPersistence.createStrategy(request.body);
        return result || {};
    }

}