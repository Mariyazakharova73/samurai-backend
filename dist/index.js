"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3001;
const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
let db = {
    courses: [
        { id: 0, title: "front" },
        { id: 1, title: "back" },
        { id: 3, title: "testback" },
        { id: 4, title: "testfront" },
    ],
};
app.get("/courses", (req, res) => {
    let foundCourses = db.courses;
    if (req.query.title) {
        foundCourses = foundCourses.filter((c) => c.title.indexOf(req.query.title) > -1);
    }
    res.json(foundCourses);
});
app.get("/courses/:id", (req, res) => {
    const course = db.courses.find((c) => c.id === +req.params.id);
    if (!course) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(course);
});
app.post("/courses", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const createdCourse = { id: +new Date(), title: req.body.title };
    db.courses.push(createdCourse);
    res.status(HTTP_STATUSES.CREATED_201).json(createdCourse);
});
app.delete("/courses/:id", (req, res) => {
    db.courses = db.courses.filter((c) => c.id !== +req.params.id);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
app.put("/courses/:id", (req, res) => {
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
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});