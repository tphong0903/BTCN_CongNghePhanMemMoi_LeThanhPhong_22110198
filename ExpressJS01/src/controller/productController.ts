import { Request, Response } from "express";
import {
  getProductsService,
  createProductService,
  syncProductService,
  getSimilarProductsService,
  getProductByIdService,
} from "../services/ProductService";

export const getProducts = async (req: Request, res: Response) => {
  const filterDto = req.query;
  const page = Number(filterDto.page) || 1;
  const limit = Number(filterDto.limit) || 10;
  const search = String(filterDto.search || "");
  const brandName = String(filterDto.brandName || "");
  const categoryName = String(filterDto.categoryName || "");
  const sortBy = String(filterDto.sortBy || "createdAt");
  const sortOrder = String(filterDto.sortOrder || "DESC").toUpperCase();
  const response = await getProductsService(
    page,
    limit,
    search,
    brandName,
    categoryName,
    sortBy,
    sortOrder
  );
  return res.status(200).json(response);
};

export const createProduct = async (req: Request, res: Response) => {
  const response = await createProductService(req.body);
  return res.status(200).json(response);
};

export const syncProduct = async (req: Request, res: Response) => {
  const response = await syncProductService();
  return res.status(200).json(response);
};
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        EC: 1,
        EM: "Invalid Product ID",
        data: null,
      });
    }

    const response = await getProductByIdService(Number(id));
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      EM: "Internal Server Error",
      data: null,
    });
  }
};

export const getSimilarProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        EC: 1,
        EM: "Invalid Product ID",
        data: [],
      });
    }

    const response = await getSimilarProductsService(Number(id));
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      EM: "Internal Server Error",
      data: [],
    });
  }
};
