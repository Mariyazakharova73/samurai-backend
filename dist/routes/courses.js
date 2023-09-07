"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCoursesRoutes = exports.getCourseViewModel = exports.HTTP_STATUSES = void 0;
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
const getCourseViewModel = (course) => {
    return {
        id: course.id,
        title: course.title,
    };
};
exports.getCourseViewModel = getCourseViewModel;
const addCoursesRoutes = (app, db) => {
    app.get("/courses", (req, res) => {
        let foundCourses = db.courses;
        if (req.query.title) {
            foundCourses = foundCourses.filter((c) => c.title.indexOf(req.query.title) > -1);
        }
        res.json(foundCourses.map((dbCourse) => {
            return {
                id: dbCourse.id,
                title: dbCourse.title,
            };
        }));
    });
    app.get("/courses/:id", (req, res) => {
        const course = db.courses.find((c) => c.id === +req.params.id);
        if (!course) {
            res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.json((0, exports.getCourseViewModel)(course));
    });
    app.post("/courses", (req, res) => {
        if (!req.body.title) {
            res.sendStatus(exports.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const createdCourse = {
            id: +new Date(),
            title: req.body.title,
            studentsCount: 0,
        };
        db.courses.push(createdCourse);
        res.status(exports.HTTP_STATUSES.CREATED_201).json((0, exports.getCourseViewModel)(createdCourse));
    });
    app.delete("/courses/:id", (req, res) => {
        db.courses = db.courses.filter((c) => c.id !== +req.params.id);
        res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
    });
    app.put("/courses/:id", (req, res) => {
        if (!req.body.title) {
            res.sendStatus(exports.HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }
        const course = db.courses.find((c) => c.id === +req.params.id);
        if (!course) {
            res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        course.title = req.body.title;
        res.status(exports.HTTP_STATUSES.NO_CONTENT_204).json(course);
    });
};
exports.addCoursesRoutes = addCoursesRoutes;
