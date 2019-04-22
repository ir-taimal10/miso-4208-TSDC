import * as mysql from 'promise-mysql';
import {config} from "../Config/PersistenceConfig";
import {IStrategy} from "../Models/Strategy";
import {Guid} from "guid-typescript";

export class StrategyPersistence {
    private _pool;

    constructor() {
        this._pool = mysql.createPool(config);
    }

    public async getStrategies(): Promise<IStrategy> {
        let result = null;
        await this._pool.query('select * from strategy')
            .then(function (rows) {
                result = rows.map(row => {
                    row.definition = JSON.parse(row.definition);
                    return row;
                });
            });
        return result;
    }

    public async getStrategy(idStrategy: string): Promise<IStrategy> {
        let result = null;
        await this._pool.query("select * from strategy where idStrategy = ?", [idStrategy])
            .then(function (rows) {
                result = rows.map(row => {
                    row.definition = JSON.parse(row.definition);
                    return row;
                });
            });
        return result[0] || {};
    }

    public async createStrategy(strategy: IStrategy): Promise<any> {
        strategy.idStrategy = Guid.raw();
        strategy.scriptPath = `scriptTests/${strategy.idStrategy}`;
        strategy.creationDate = new Date();
        await this._pool.query("insert into strategy values(?,?,?,?,?,?,?)",
            [
                strategy.idStrategy,
                strategy.name,
                strategy.idAUT,
                strategy.description,
                strategy.scriptPath,
                strategy.creationDate,
                JSON.stringify(strategy.definition)
            ])
            .then(function (rows) {
            });
        return strategy;
    }

    public async createScriptPathStrategy(scriptPath: string, idStrategy: string): Promise<any> {
        await this._pool.query("insert into script_path (idScriptPath,creationDate,scriptPath,idStrategy) values (?,?,?,?)",
            [
                Guid.raw(),
                Date.now(),
                scriptPath,
                idStrategy
            ]
        ).then(function (rows) {
        });
        return true;
    }

    public async getScriptsPathStrategy(idStrategy: string): Promise<IStrategy> {
        let result = null;
        await this._pool.query("select * from script_path where idStrategy = '" + idStrategy + "'")
            .then(function (rows) {
                result = rows;
            });
        return result;

    }

}