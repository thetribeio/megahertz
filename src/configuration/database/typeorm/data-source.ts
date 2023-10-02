import {DataSource} from 'typeorm';

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "user",
    password: "password",
    database: "megahertz",
    synchronize: true,
    logging: true,
    entities: ['src/driven/repositories/typeorm/entities/*.{ts,js}'],
    subscribers: [],
    migrations: ['src/driven/repositories/typeorm/migrations/*.{ts,js}'],
});


export default AppDataSource;