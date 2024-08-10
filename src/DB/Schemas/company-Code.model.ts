import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { Admin } from "./admin.model";

@Table({
    tableName: 'CompanyCode',
    timestamps: true,
})

export class CompanyCode extends Model<CompanyCode> {
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
        type: DataType.INTEGER,
        allowNull: false
    })
    barcodeNumber: number

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