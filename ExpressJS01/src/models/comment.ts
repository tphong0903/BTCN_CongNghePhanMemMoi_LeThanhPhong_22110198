import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface CommentAttributes {
  id: number;
  productId: number;
  userId?: number;
  username: string;
  content: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type CommentCreationAttributes = Optional<CommentAttributes, "id">;

class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: number;
  public productId!: number;
  public userId!: number;
  public username!: string;
  public content!: string;
  public rating!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    Comment.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  }
}

export default (sequelize: Sequelize): typeof Comment => {
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Anonymous",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
    }
  );

  return Comment;
};
