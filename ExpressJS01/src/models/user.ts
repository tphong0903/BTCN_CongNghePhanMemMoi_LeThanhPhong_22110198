import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface UserAttributes {
  id: number;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  gender?: boolean;
  image?: string;
  roleId?: string;
  positionId?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email?: string;
  public password?: string;
  public firstName?: string;
  public lastName?: string;
  public address?: string;
  public phoneNumber?: string;
  public gender?: boolean;
  public image?: string;
  public roleId?: string;
  public positionId?: string;
  public resetPasswordToken?: string;
  public resetPasswordTokenExpiry?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
  }
}

export default (sequelize: Sequelize): typeof User => {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordTokenExpiry: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });

  return User;
};