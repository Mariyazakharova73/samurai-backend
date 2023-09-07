import express from "express";
import { db } from "./db/db";
import { getCoursesRouter } from "./routes/courses";
import { getTestsRouter } from "./routes/tests";

export const app = express();
const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

app.use("/courses", getCoursesRouter(db));
app.use("/test", getTestsRouter(db));
