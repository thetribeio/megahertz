import {container} from 'tsyringe';
import {DataSource} from 'typeorm';

export const runDataSourceAfterEachOps = async () => {
    const queryDataSource: DataSource = container.resolve("QueryDataSource");
    const commandDataSource: DataSource = container.resolve("CommandDataSource");
    await commandDataSource.dropDatabase();
    await queryDataSource.destroy();
    await commandDataSource.destroy();
}