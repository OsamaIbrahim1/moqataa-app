import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { Product } from "./product.model";

@Table({
    tableName: 'Report',
    timestamps: true,
})

export class Report extends Model<Report> {
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
    message: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    productId: number;

    @BelongsTo(() => Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    product: Product;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    emailUser: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    username: string

    @BelongsTo(() => User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    user: User;
}