import {Controller, Get} from "@tsed/common";
import * as Express from "express";
import {StrategyPersistence} from "../../TestingTool.Persistence/StrategyPersistence";

@Controller("/test")
export class TestController {
    @Get("/:id")
    async get(request: Express.Request, response: Express.Response): Promise<any> {
        const strategy = new StrategyPersistence();
        const result = await  strategy.getStrategies();
        console.log("query result", result);
        return {id: request.params.id, result: result};
    }
}