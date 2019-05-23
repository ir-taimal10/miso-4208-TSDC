import * as mysql from 'promise-mysql';
import {config} from "../Config/PersistenceConfig";
import {Guid} from "guid-typescript";
import {IMutationAUT} from "../Models/MutationAUT";
import {IAUT} from "../Models/AUT";

export class MutationAUTPersistence {
    private _pool;

    constructor() {
        this._pool = mysql.createPool(config);
    }

    public async getMutationAUTs(): Promise<IMutationAUT> {
        let result = null;
        await this._pool.query('select * from mutation_aut')
            .then(function (rows) {
                result = rows;
            });
        return result;
    }

    public async getMutationAUT(idMutationAut: string): Promise<IMutationAUT> {
        let result = null;
        await this._pool.query("select * from mutation_aut where idMutationAut = ?", [idMutationAut])
            .then(function (rows) {
                result = rows;
            });
        return result;
    }

    public async createMutationAUT(mutationAUT: IMutationAUT): Promise<any> {
        mutationAUT.idMutationAut = Guid.raw();
        await
            this._pool.query("insert into mutation_aut (idMutationAut, name, version, idAUT, creationDate) values(?,?,?,?,?)",
                [
                    mutationAUT.idMutationAut,
                    mutationAUT.name,
                    mutationAUT.version,
                    mutationAUT.idAUT
                ])
                .then(function (rows) {
                });
        return mutationAUT;
    }

    public async updateFileMutationAUT(autMutation: IMutationAUT): Promise<any> {
        await this._pool.query("update mutation_aut set scriptPath  = ? where idMutationAut = ?",
            [
                autMutation.scriptPath,
                autMutation.idMutationAut,
            ])
            .then(function (rows) {
            });
        return autMutation;
    }
}
