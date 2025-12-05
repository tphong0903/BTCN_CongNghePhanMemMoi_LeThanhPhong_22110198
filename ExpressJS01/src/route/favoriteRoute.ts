import express from "express";
import {
  toggleFavorite,
  getMyFavorites,
} from "../controller/favoriteController";
import { authenticateJwt } from "../middleware/authJWT";

const favoriteRoute = express.Router();

favoriteRoute.post("/favorites/toggle", authenticateJwt, toggleFavorite);
favoriteRoute.get("/favorites", authenticateJwt, getMyFavorites);

export default favoriteRoute;
