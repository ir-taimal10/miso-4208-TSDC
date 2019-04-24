import * as mysql from 'promise-mysql';
import {config} from "../Config/PersistenceConfig";
import {IStrategyTrace} from "../Models/StrategyTrace";

export class StrategyTracePersistence {
    private _pool;

    constructor() {
        this._pool = mysql.createPool(config);
    }

    public async getStrategyTraces(idStrategy: string): Promise<any> {
        let result = null;
        await this._pool.query("select * from strategytrace where idStrategy = ? order by idProcess, creationDate desc", [idStrategy])
            .then(function (rows) {
                result = rows.map(row => {
                    return row;
                });
            });
        return result;
    }

    public async registerStrategyTrace(strategyTrace: IStrategyTrace): Promise<IStrategyTrace> {
        strategyTrace.creationDate = new Date();
        await this._pool.query("insert into strategytrace(idStrategy, idProcess, status, creationDate,trace) values (?,?,?,?,?)",
            [
                strategyTrace.idStrategy,
                strategyTrace.idProcess,
                strategyTrace.status,
                strategyTrace.creationDate,
                strategyTrace.trace
            ]
        ).then(function (rows) {
        });
        return strategyTrace;
    }


}