import express from "express";
import { db } from "./db/db";
import { addCoursesRoutes } from "./routes/courses";
import { addTestsRoutes } from "./routes/tests";

export const app = express();
const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

addCoursesRoutes(app, db);
addTestsRoutes(app, db);
