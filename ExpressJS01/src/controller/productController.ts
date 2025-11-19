import { Request, Response } from "express";
import {
  getProductsService,
  createProductService,
} from "../services/ProductService";

export const getProducts = async (req: Request, res: Response) => {
  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 10;

  const response = await getProductsService(page, limit);
  return res.status(200).json(response);
};

export const createProduct = async (req: Request, res: Response) => {
  const response = await createProductService(req.body);
  return res.status(200).json(response);
};
