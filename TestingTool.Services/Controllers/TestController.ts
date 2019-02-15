import {Controller, Get} from "@tsed/common";
import * as Express from "express";
import {UtilsService} from "../../TestingTool.Runner/utils/UtilsService";

@Controller("/test")
export class TestController {
    @Get("/:id")
    async get(request: Express.Request, response: Express.Response): Promise<any>{
        return {id: request.params.id, name: "test"};
    }
}