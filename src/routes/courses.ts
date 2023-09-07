import { Response, Express } from "express";
import { Course, DBType } from "../db/db";
import { CourseCreateModel } from "../models/courseCreateModel";
import { CourseUpdateModel } from "../models/courseUpdateModel";
import { CourseViewModel } from "../models/courseViewModel";
import { CoursesQueryModel } from "../models/getCoursesQueryModel";
import { URIParamsCourseIdModel } from "../models/URIParamsCourseIdModel";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types";

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

export const getCourseViewModel = (course: Course): CourseViewModel => {
  return {
    id: course.id,
    title: course.title,
  };
};

export const addCoursesRoutes = (app: Express, db: DBType) => {
  app.get(
    "/courses",
    (req: RequestWithQuery<CoursesQueryModel>, res: Response<CourseViewModel[]>) => {
      let foundCourses = db.courses;
      if (req.query.title) {
        foundCourses = foundCourses.filter((c) => c.title.indexOf(req.query.title as string) > -1);
      }

      res.json(
        foundCourses.map((dbCourse) => {
          return {
            id: dbCourse.id,
            title: dbCourse.title,
          };
        })
      );
    }
  );

  app.get(
    "/courses/:id",
    (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {
      const course = db.courses.find((c) => c.id === +req.params.id);

      if (!course) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
      }

      res.json(getCourseViewModel(course));
    }
  );

  app.post("/courses", (req: RequestWithBody<CourseCreateModel>, res: Response) => {
    if (!req.body.title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const createdCourse: Course = {
      id: +new Date(),
      title: req.body.title,
      studentsCount: 0,
    };
    db.courses.push(createdCourse);
    res.status(HTTP_STATUSES.CREATED_201).json(getCourseViewModel(createdCourse));
  });

  app.delete("/courses/:id", (req: RequestWithParams<URIParamsCourseIdModel>, res: Response) => {
    db.courses = db.courses.filter((c) => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  });

  app.put(
    "/courses/:id",
    (req: RequestWithParamsAndBody<URIParamsCourseIdModel, CourseUpdateModel>, res: Response) => {
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
};
