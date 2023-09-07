import { Response, Express } from "express";
import { DBType } from "../db/db";
import { HTTP_STATUSES } from "./courses";

export const addTestsRoutes = (app: Express, db: DBType) => {
  app.delete("/test/data", (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });
};
