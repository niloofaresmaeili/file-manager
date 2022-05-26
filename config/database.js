const config = {
    mysql: {
        HOST: `${process.env.MYSQL_HOST}`,
        USER: `${process.env.MYSQL_USERNAME}`,
        PASSWORD: `${process.env.MYSQL_PASSWORD}`,
        DB: `${process.env.MYSQL_DATABASE}`,
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },

    pg: {
        HOST: `${process.env.PGSql_HOST}`,
        USER: `${process.env.PGSql_USERNAME}`,
        PASSWORD: `${process.env.PGSql_PASSWORD}`,
        DB: `${process.env.PGSql_DATABASE}`,
        dialect: "postgres",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
  
};

module.exports = config[process.env.DATABASE_CONNECTION]