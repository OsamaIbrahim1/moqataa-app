import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { Admin } from "./admin.model";

@Table({
    tableName: 'CountryCode',
    timestamps: true,
})

export class CountryCode extends Model<CountryCode> {
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
    firstCode: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    lastCode: string;

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
}