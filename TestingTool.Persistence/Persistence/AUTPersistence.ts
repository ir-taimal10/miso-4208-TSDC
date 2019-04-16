import * as mysql from 'promise-mysql';
import {config} from "../Config/PersistenceConfig";
import {Guid} from "guid-typescript";
import {IAUT} from "../Models/AUT";

export class AUTPersistence {
    private _pool;

    constructor() {
        this._pool = mysql.createPool(config);
    }

    public async getAUTs(): Promise<IAUT> {
        let result = null;
        await this._pool.query('select * from aut')
            .then(function (rows) {
                result = rows;
            });
        return result;
    }

    public async getAUT(idStrategy: string): Promise<IAUT> {
        let result = null;
        await this._pool.query("select * from aut where idAut = ?", [idStrategy])
            .then(function (rows) {
                result = rows;
            });
        return result;
    }

    public async createAUT(aut: IAUT): Promise<any> {
        aut.idAUT = Guid.raw();
        aut.creationDate = new Date();
        await this._pool.query("insert into aut values(?,?,?,?,?,?)",
            [
                aut.idAUT,
                aut.name,
                aut.type,
                aut.version,
                aut.url,
                aut.creationDate
            ])
            .then(function (rows) {
            });
        return aut;
    }
}