"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTestsRoutes = void 0;
const courses_1 = require("./courses");
const addTestsRoutes = (app, db) => {
    app.delete("/test/data", (req, res) => {
        db.courses = [];
        res.sendStatus(courses_1.HTTP_STATUSES.NO_CONTENT_204);
    });
};
exports.addTestsRoutes = addTestsRoutes;
