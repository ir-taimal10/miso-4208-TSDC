import {Controller, Get, Post} from "@tsed/common";
import * as Express from "express";
import {AUTPersistence} from "../../TestingTool.Persistence/Persistence/AUTPersistence";

@Controller("/aut")
export class AUTController {
    private _autPersistence;

    constructor() {
        this._autPersistence = new AUTPersistence();
    }

    @Get("")
    async getAUTs(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await  this._autPersistence.getAUTs();
        return result || [];
    }

    @Get("/:idAut")
    async getAUT(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await  this._autPersistence.getAUT(request.params.idAut);
        return result[0] || {};
    }

    @Post("")
    async createAUT(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await  this._autPersistence.createAUT(request.body);
        return result || {};
    }

}