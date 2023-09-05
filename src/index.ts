import express, { Request, Response } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "./types";
export const app = express();
const port = 4000;

interface Course {
  id: number;
  title: string;
}

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

let db: { courses: Course[] } = {
  courses: [
    { id: 0, title: "front" },
    { id: 1, title: "back" },
    { id: 3, title: "testback" },
    { id: 4, title: "testfront" },
  ],
};

app.delete("/__test__/data", (req, res) => {
  db.courses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.get("/courses", (req: RequestWithQuery<{ title: string }>, res: Response<Course[]>) => {
  let foundCourses = db.courses;
  if (req.query.title) {
    foundCourses = foundCourses.filter((c) => c.title.indexOf(req.query.title as string) > -1);
  }

  res.json(foundCourses);
});

app.get("/courses/:id", (req: RequestWithParams<{ id: string }>, res: Response) => {
  const course = db.courses.find((c) => c.id === +req.params.id);

  if (!course) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  res.json(course);
});

app.post("/courses", (req: RequestWithBody<{ title: string }>, res: Response) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const createdCourse = { id: +new Date(), title: req.body.title };
  db.courses.push(createdCourse);
  res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
});

app.delete("/courses/:id", (req: RequestWithParams<{ id: string }>, res) => {
  db.courses = db.courses.filter((c) => c.id !== +req.params.id);
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.put(
  "/courses/:id",
  (req: RequestWithParamsAndBody<{ id: string }, { title: string }>, res: Response) => {
    if (!req.body.title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const course = db.courses.find((c) => c.id === +req.params.id);

    if (!course) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    course.title = req.body.title;

    res.status(HTTP_STATUSES.NO_CONTENT_204).json(course);
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
