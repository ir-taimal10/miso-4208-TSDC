import * as mysql from 'promise-mysql';
import {config} from "../Config/PersistenceConfig";
import {IStrategy} from "../Models/Strategy";
import {Guid} from "guid-typescript";
import {IStrategyScriptPath} from "../Models/StrategyScriptPath";

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

    public async createScriptPathStrategy(strategyScriptPath: IStrategyScriptPath): Promise<any> {
        strategyScriptPath.creationDate = new Date();
        strategyScriptPath.idScriptPath = Guid.raw();
        await this._pool.query("insert into script_path (idScriptPath, creationDate, scriptPath, idStrategy, state,  testType) values (?,?,?,?,?,?)",
            [
                strategyScriptPath.idScriptPath,
                strategyScriptPath.creationDate,
                strategyScriptPath.scriptPath,
                strategyScriptPath.idStrategy,
                strategyScriptPath.status,
                strategyScriptPath.testType
            ]
        ).then(function (rows) {
        });
        return strategyScriptPath;
    }

    public async getScriptsPathStrategy(idStrategy: string): Promise<IStrategyScriptPath> {
        let result = null;
        await this._pool.query("select * from script_path where idStrategy = ?", [idStrategy])
            .then(function (rows) {
                result = rows;
            });
        return result;

    }

}