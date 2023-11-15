import {container} from 'tsyringe';
import {DataSource} from 'typeorm';

export const runDataSourceBeforeEachOps = async () => {
    const queryDataSource: DataSource = container.resolve("QueryDataSource");
    await queryDataSource.initialize();
    await queryDataSource.synchronize();
    const commandDataSource: DataSource = container.resolve("CommandDataSource");
    await commandDataSource.initialize();
    await commandDataSource.synchronize();
}