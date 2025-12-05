import db from "../models";
import { Op } from "sequelize";
import { meiliClient } from "../utils/meilisearch";

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

    const meiliQuery: any = {
      q: search || "",
      limit,
      offset,
      filter: [],
      matchingStrategy: "all",
    };

    if (brandName) meiliQuery.filter.push(`brand = "${brandName}"`);
    if (categoryName) meiliQuery.filter.push(`category = "${categoryName}"`);

    const searchResult = await meiliClient
      .index("products")
      .search(search || "", meiliQuery);

    const ids = searchResult.hits.map((h: any) => h.id);

    if (ids.length === 0) {
      return {
        EC: 0,
        EM: "SUCCESS",
        data: [],
        total: 0,
        currentPage: page,
        totalPages: 0,
        isLast: true,
      };
    }

    const { rows, count } = await db.Product.findAndCountAll({
      where: { id: ids },
      order: [[sortBy, sortOrder]],
    });

    // const countProduct = await db.Product.countProduct();
    const totalHits = searchResult.estimatedTotalHits ?? 0;
    const totalPages = Math.ceil(totalHits / limit);

    return {
      EC: 0,
      EM: "SUCCESS",
      data: rows,
      total: totalHits,
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
    await meiliClient.index("products").addDocuments([
      {
        id: product.id,
        productName: product.productName,
        brand: product.brand,
        category: product.category,
        address: product.address,
        price: product.price,
        image: product.image,
        createdAt: product.createdAt,
      },
    ]);
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

export const syncProductService = async () => {
  const products = await db.Product.findAll({ raw: true });

  await meiliClient.index("products").updateSettings({
    filterableAttributes: ["brand", "category", "address", "price"],
    sortableAttributes: ["createdAt", "price"],
    typoTolerance: {
      enabled: true,
      disableOnAttributes: [],
      minWordSizeForTypos: {
        oneTypo: 3,
        twoTypos: 4,
      },
    },
  });

  const mappedProducts = products.map((p: any) => ({
    id: p.id,
    productName: p.productName,
    brand: p.brand,
    category: p.category,
    address: p.address,
    price: p.price,
    image: p.image,
    createdAt: p.createdAt,
  }));

  await meiliClient.index("products").addDocuments(mappedProducts);

  return "success";
};

export const getProductByIdService = async (id: number) => {
  try {
    const product = await db.Product.findByPk(id);

    if (product) {
      return {
        EC: 0,
        EM: "Get product detail success",
        data: product,
      };
    } else {
      return {
        EC: 1,
        EM: "Product not found",
        data: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Something went wrong in service",
      data: null,
    };
  }
};

export const getSimilarProductsService = async (id: number) => {
  try {
    const currentProduct = await db.Product.findByPk(id);

    if (!currentProduct) {
      return {
        EC: 1,
        EM: "Product not found",
        data: [],
      };
    }

    const similarProducts = await db.Product.findAll({
      where: {
        category: currentProduct.category,
        id: { [Op.ne]: id },
      },
      limit: 4,
      order: [["createdAt", "DESC"]],
    });

    return {
      EC: 0,
      EM: "Get similar products success",
      data: similarProducts,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Something went wrong in service",
      data: [],
    };
  }
};
