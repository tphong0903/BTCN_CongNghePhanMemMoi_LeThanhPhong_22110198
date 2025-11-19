import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface ProductAttributes {
  id: number;
  productName?: string;
  brand?: string;
  category?: string;
  address?: string;
  price?: number;
  image?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

type ProductCreationAttributes = Optional<ProductAttributes, "id">;

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public productName?: string;
  public brand?: string;
  public category?: string;
  public address?: string;
  public price?: number;
  public image?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {}
}

export default (sequelize: Sequelize): typeof Product => {
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      brand: DataTypes.STRING,
      category: DataTypes.STRING,
      address: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
    }
  );

  return Product;
};
