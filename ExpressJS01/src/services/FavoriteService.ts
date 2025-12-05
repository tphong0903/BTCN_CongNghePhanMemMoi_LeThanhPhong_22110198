import db from "../models";

export const toggleFavoriteService = async (
  email: string,
  productId: number
) => {
  try {
    const user = await db.User.findOne({
      where: {
        email: email,
      },
    });
    const existingFavorite = await db.Favorite.findOne({
      where: {
        userId: user.id,
        productId: productId,
      },
    });

    if (existingFavorite) {
      await existingFavorite.destroy();
      return {
        EC: 0,
        EM: "Removed from favorites",
        data: { isLiked: false },
      };
    } else {
      await db.Favorite.create({
        userId: user.id,
        productId: productId,
      });
      return {
        EC: 0,
        EM: "Added to favorites",
        data: { isLiked: true },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Something went wrong in favorite service",
      data: null,
    };
  }
};

export const getMyFavoritesService = async (userId: number) => {
  try {
    const favorites = await db.Favorite.findAll({
      where: { userId: userId },
      include: [
        {
          model: db.Product,
          as: "product",
          attributes: ["id", "productName", "price", "image", "category"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      EC: 0,
      EM: "Get favorites success",
      data: favorites,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Something went wrong",
      data: [],
    };
  }
};
