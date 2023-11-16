import {container} from 'tsyringe';
import {DataSource} from 'typeorm';
import 'dotenv/config';

/**
 * Configures tsyringe to instantiate a TypeORM DataSource using an env setting file.*
 */
const useAppDataSources = (): void => {
    // Most of the variables are currently not typed or parsed correctly
    // See ticket https://github.com/thetribeio/megahertz/issues/15
    const AppDataSource = new DataSource({
        type: "postgres",
        synchronize: true,
        logging: true,
        entities: ['src/driven/repositories/typeorm/entities/*.{ts,js}'],
        subscribers: [],
        migrations: ['src/driven/repositories/typeorm/migrations/*.{ts,js}'],
        replication: {
            master: {
                host: process.env.TYPEORM_MASTER_DATABASE_HOST as string,
                port: Number(process.env.TYPEORM_MASTER_DATABASE_PORT),
                username: process.env.TYPEORM_MASTER_DATABASE_USER as string,
                password: process.env.TYPEORM_MASTER_DATABASE_PASSWORD as string,
                database: process.env.TYPEORM_MASTER_DATABASE_NAME as string,
            },
            slaves: [{
                host: process.env.TYPEORM_DATABASE_HOST as string,
                port: Number(process.env.TYPEORM_DATABASE_PORT),
                username: process.env.TYPEORM_DATABASE_USER as string,
                password: process.env.TYPEORM_DATABASE_PASSWORD as string,
                database: process.env.TYPEORM_DATABASE_NAME as string,
            }]
        },
    });
    container.register("DataSource", {useValue: AppDataSource});
}

export default useAppDataSources;