import { Request, Response } from "express";
import {
  getCommentsService,
  createCommentService,
} from "../services/CommentService";

export const getComments = async (req: Request, res: Response) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({
        EC: 1,
        EM: "Missing productId query parameter",
        data: [],
      });
    }

    const response = await getCommentsService(Number(productId));
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      EM: "Internal Server Error",
      data: [],
    });
  }
};

export const createComment = async (req: any, res: Response) => {
  try {
    const user = req.user;
    const data = {
      ...req.body,
      userId: user?.id,
      username: user?.firstName,
    };

    const response = await createCommentService(data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      EC: -1,
      EM: "Internal Server Error",
      data: null,
    });
  }
};
