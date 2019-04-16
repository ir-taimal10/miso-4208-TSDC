import * as mysql from 'promise-mysql';

const config = {
    host: '',
    user: '',
    password: '',
    database: '',
    connectionLimit: 10,
    port: 3306
};

export class StrategyPersistence {
    public async getStrategies(): Promise<any> {
        const pool = mysql.createPool(config);
        let result = null;
        await pool.query('select * from strategy').then(function (rows) {
            result = rows;
            console.log(rows);
        });
        return result;
    }
}