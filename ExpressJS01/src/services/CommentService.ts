import db from "../models";

export const getCommentsService = async (productId: number) => {
  try {
    const comments = await db.Comment.findAll({
      where: { productId: productId },
      order: [["createdAt", "DESC"]],
    });

    return {
      EC: 0,
      EM: "Get comments success",
      data: comments,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Something went wrong in comment service",
      data: [],
    };
  }
};

export const createCommentService = async (data: any) => {
  try {
    if (!data.productId || !data.content) {
      return {
        EC: 1,
        EM: "Missing required parameters (productId or content)",
        data: null,
      };
    }

    const product = await db.Product.findByPk(data.productId);
    if (!product) {
      return {
        EC: 2,
        EM: "Product not found",
        data: null,
      };
    }

    const newComment = await db.Comment.create({
      productId: data.productId,
      content: data.content,
      rating: data.rating || 5,
      username: data.username || "Khách ẩn danh",
      userId: data.userId || null,
    });

    return {
      EC: 0,
      EM: "Comment created successfully",
      data: newComment,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Something went wrong in comment service",
      data: null,
    };
  }
};
