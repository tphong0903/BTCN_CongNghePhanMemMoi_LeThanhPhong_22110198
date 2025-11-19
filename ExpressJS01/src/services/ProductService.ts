import db from "../models";

export const getProductsService = async (page: number, limit: number) => {
  try {
    const offset = (page - 1) * limit;

    const { rows, count } = await db.Product.findAndCountAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      EC: 0,
      EM: "SUCCESS",
      data: rows,
      total: count,
      currentPage: page,
      totalPages: totalPages,
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
