import { Request, Response } from "express";
import {
  getProductsService,
  createProductService,
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
