import { Request, Response } from "express";
import * as CRUDService from "../services/CRUDservice";

export const getHomePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await CRUDService.getAllUser();
    console.log("..................");
    console.log(data);
    console.log("..................");
    res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error");
  }
};

export const getAboutPage = (req: Request, res: Response): void => {
  res.render("test/about.ejs");
};

export const getCRUD = (req: Request, res: Response): void => {
  res.render("crud.ejs");
};

export const getFindAllCrud = async (req: Request, res: Response): Promise<void> => {
  const data = await CRUDService.getAllUser();
  res.render("users/findAllUser.ejs", { datalist: data });
};

export const postCRUD = async (req: Request, res: Response): Promise<void> => {
  const message = await CRUDService.createNewUser(req.body);
  console.log(message);
  res.send("Post crud to server");
};

export const getEditCRUD = async (req: Request, res: Response): Promise<void> => {
  const userId = req.query.id as string | undefined;
  if (userId) {
    const userData = await CRUDService.getUserInfoById(userId as any);
    res.render("users/editUser.ejs", { data: userData });
  } else {
    res.status(400).send("không lấy được id");
  }
};

export const putCRUD = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  const data1 = await CRUDService.updateUser(data);
  res.render("users/findAllUser.ejs", { datalist: data1 });
};

export const deleteCRUD = async (req: Request, res: Response): Promise<void> => {
  const id = req.query.id as string | undefined;
  if (id) {
    await CRUDService.deleteUserById(id as any);
    res.send("Deleted!!!!!!!!!!");
  } else {
    res.status(400).send("Not find user");
  }
};

export default {
  getHomePage,
  getAboutPage,
  getCRUD,
  postCRUD,
  getFindAllCrud,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
