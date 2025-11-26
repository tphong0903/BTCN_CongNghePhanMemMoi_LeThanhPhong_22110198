import db from "../models";
import { Op } from "sequelize";
export const getProductsService = async (
  page: number,
  limit: number,
  search: string,
  brandName: string,
  categoryName: string,
  sortBy: string = "createdAt",
  sortOrder: string = "DESC"
) => {
  try {
    const offset = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where[Op.or] = [{ productName: { [Op.like]: `%${search}%` } }];
    }

    if (brandName) {
      where.brand = { [Op.like]: `%${brandName}%` };
    }

    if (categoryName) {
      where.category = { [Op.like]: `%${categoryName}%` };
    }

    const { rows, count } = await db.Product.findAndCountAll({
      where,
      offset,
      limit,
      order: [[sortBy, sortOrder]],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      EC: 0,
      EM: "SUCCESS",
      data: rows,
      total: count,
      currentPage: page,
      totalPages,
      isLast: page >= totalPages,
    };
  } catch (error: any) {
    return {
      EC: 1,
      EM: error.message,
      data: [],
      total: 0,
      currentPage: page,
      totalPages: 0,
      isLast: true,
    };
  }
};

export const createProductService = async (data: any) => {
  try {
    const product = await db.Product.create(data);

    return {
      EC: 0,
      EM: "Product created",
      data: product,
    };
  } catch (error: any) {
    return {
      EC: 1,
      EM: error.message,
      data: null,
    };
  }
};
