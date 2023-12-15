import {BaseEntity, Column, Entity, OneToOne, PrimaryColumn, JoinColumn} from 'typeorm';
import {TypeORMCar, TypeORMCustomer} from './index';

@Entity()
export default class TypeORMCarRental extends BaseEntity {
    @PrimaryColumn()
    public id!: string;

    @Column()
    public totalPrice!: number;

    @Column()
    public pickupDateTime!: Date;

    @Column()
    public dropOffDateTime!: Date;

    @OneToOne(() => TypeORMCustomer)
    @JoinColumn()
    customer!: TypeORMCustomer;

    @OneToOne(() => TypeORMCar)
    @JoinColumn()
    car!: TypeORMCar;
}