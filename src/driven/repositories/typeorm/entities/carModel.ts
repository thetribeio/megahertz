import {BaseEntity, Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export default class TypeORMCarModel extends BaseEntity {
    @PrimaryColumn()
    public id!: string;

    @Column()
    dailyRate!: number;
}