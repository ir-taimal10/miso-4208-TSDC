import * as mysql from 'promise-mysql';
import {config} from "./PersistenceConfig";

export class StrategyPersistence {
    private _pool;

    constructor() {
        this._pool = mysql.createPool(config);
    }

    public async getStrategies(): Promise<any> {
        let result = null;
        await this._pool.query('select * from strategy')
            .then(function (rows) {
                result = rows;
            });
        return result;
    }

    public async getStrategy(): Promise<any> {
        let result = null;
        const idStrategy = '121212';
        await this._pool.query("select * from strategy where idStrategy = @idStrategy",[idStrategy])
            .then(function (rows) {
                result = rows;
            });
        return result;
    }
}