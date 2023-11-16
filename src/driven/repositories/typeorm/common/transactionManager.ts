import TransactionManagerInterface from "src/core/domain/common/interfaces/transactionManager";
import TransactionInterface from "src/core/domain/common/interfaces/transaction";
import {DataSource, QueryRunner} from "typeorm";
import {container, inject, singleton} from "tsyringe";

@singleton()
export default class TypeORMTransactionManager implements TransactionManagerInterface {

    private readonly dataSource: DataSource;

    constructor(@inject("DataSource") dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    async commit(): Promise<void> {
        const queryRunner: QueryRunner = container.resolve("CurrentQueryRunner");
        await queryRunner.commitTransaction();
        await queryRunner.release();
    }

    // @ts-ignore
    newTransaction(): TransactionInterface {
    }

    async startTransaction(): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        container.register("CurrentQueryRunner", {useValue: queryRunner});
    }

}