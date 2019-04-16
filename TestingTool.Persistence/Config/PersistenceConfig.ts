export const config = {
    host:  process.env.TSDC_BD_HOST,
    user: process.env.TSDC_BD_USER,
    password: process.env.TSDC_BD_PASSWORD,
    database: process.env.TSDC_BD_NAME,
    connectionLimit: 10,
    port: 3306
};