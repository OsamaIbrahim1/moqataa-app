import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { Admin } from "./admin.model";

@Table({
    tableName: 'denotion',
    timestamps: true
})

export class Denotion extends Model<Denotion> {
    @Column({
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
    image: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    link: string;

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