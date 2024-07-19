import { Column, DataType, Model, Table, } from "sequelize-typescript";

@Table({
    tableName: 'User',
    timestamps: true,
})

export class User extends Model<User> {
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
        unique: true,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.JSON,
        allowNull: false
    })
    image: object;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    folderId: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isEmailVerified: boolean

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    token: string;
}