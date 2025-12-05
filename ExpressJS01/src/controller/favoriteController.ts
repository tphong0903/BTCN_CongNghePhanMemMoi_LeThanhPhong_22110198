import { Request, Response } from "express";
import {
  toggleFavoriteService,
  getMyFavoritesService,
} from "../services/FavoriteService";

export const toggleFavorite = async (req: any, res: Response) => {
  try {
    const useremail = req.user?.email;
    const { productId } = req.body;

    if (!useremail || !productId) {
      return res.status(400).json({
        EC: 1,
        EM: "Missing required params",
        data: null,
      });
    }

    const response = await toggleFavoriteService(useremail, productId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      EM: "Internal Server Error",
      data: null,
    });
  }
};

export const getMyFavorites = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    const response = await getMyFavoritesService(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      EM: "Internal Server Error",
      data: null,
    });
  }
};
