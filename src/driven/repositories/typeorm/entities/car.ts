import {BaseEntity, Entity, OneToOne, PrimaryColumn, JoinColumn} from 'typeorm';
import {TypeORMCarModel} from './index';

@Entity()
export default class TypeORMCar extends BaseEntity {
    @PrimaryColumn()
    public id!: string;

    @OneToOne(() => TypeORMCarModel)
    @JoinColumn()
    model!: TypeORMCarModel;
}