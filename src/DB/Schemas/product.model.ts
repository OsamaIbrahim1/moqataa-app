import { BelongsTo, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Admin } from "./admin.model";
import { Report } from "./report.model";


@Table({
    tableName: 'Product',
    timestamps: true,
})

export class Product extends Model<Product> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,

    })
    category: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    image: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    country: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    Boycott: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    resonOfBoycott: string;


    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    rate: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    adminId: number;

    @BelongsTo(() => Admin, {
        foreignKey: 'adminId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    admin: Admin;

    @HasMany(() => Report, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    reports: Report[]
}