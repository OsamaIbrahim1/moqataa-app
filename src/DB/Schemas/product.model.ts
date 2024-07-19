import { Model, Table } from "sequelize-typescript";


@Table({
    tableName: 'Product',
    timestamps: true,
})

export class Product extends Model<Product> {



}