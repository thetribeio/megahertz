import {container} from 'tsyringe';
import {DataSource} from 'typeorm';

export const runDataSourceAfterEachOps = async () => {
    const dataSource: DataSource = container.resolve("DataSource");
    await dataSource.dropDatabase();
    await dataSource.destroy();
}