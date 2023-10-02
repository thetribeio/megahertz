import {container} from 'tsyringe';
import {DataSource} from 'typeorm';

export const runDataSourceBeforeEachOps = async () => {
    const dataSource: DataSource = container.resolve("DataSource");
    await dataSource.initialize();
    await dataSource.synchronize();
}