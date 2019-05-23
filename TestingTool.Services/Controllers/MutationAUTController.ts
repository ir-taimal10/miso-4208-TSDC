import {Controller, Get, Post, Put} from "@tsed/common";
import * as Express from "express";
import {MultipartFile} from "@tsed/multipartfiles";
import {MulterFile} from "../../TestingTool.Persistence/Models/MulterFile";
import {MutationAUTPersistence} from "../../TestingTool.Persistence/Persistence/MutationAUTPersistence";

@Controller("/mutationAut")
export class MutationAUTController {
    private _mutationAutPersistence;

    constructor() {
        this._mutationAutPersistence = new MutationAUTPersistence();
    }

    @Get("")
    async getMutationAUTs(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await this._mutationAutPersistence.getMutationAUTs();
        return result || [];
    }

    @Get("/:idMutationAut")
    async getMutationAUT(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await this._mutationAutPersistence.getMutationAUT(request.params.idMutationAut);
        console.log(request.params.idMutationAut);
        console.log(result);
        return result[0] || {};
    }

    @Post("")
    async createMutationAUT(request: Express.Request, response: Express.Response): Promise<any> {
        const result = await this._mutationAutPersistence.createMutationAUT(request.body);
        return result || {};
    }

    @Put("/:idStrategy/:testType/scripts")
    async uploadStrategyScripts(@MultipartFile("files") files: MulterFile[]): Promise<any> {
        const response = JSON.stringify(files[0]);
        const responseJson = JSON.parse(response);
        await this._mutationAutPersistence.updateFileMutationAUT({
            scriptPath: responseJson.key,
            idMutationAut: responseJson.metadata.idStrategy,
        });
        return responseJson;
    }

}
