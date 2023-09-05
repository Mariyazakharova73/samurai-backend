import request from "supertest";
import { app, HTTP_STATUSES } from "../src/index";

describe("/course", () => {
  beforeAll(async () => {
    await request(app).delete("/__test__/data");
  });

  it("should return 200 and empty array", async () => {
    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });

  it("should return 404 for not existing course", async () => {
    await request(app).get("/courses/10").expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("should not create course with incorrect input data", async () => {
    await request(app).post("/courses").send({ title: "" }).expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  let createdCourse: any = null;

  it("should create course with correct input data", async () => {
    const createResponse = await request(app)
      .post("/courses")
      .send({ title: "new title" })
      .expect(HTTP_STATUSES.CREATED_201);

    createdCourse = createResponse.body;
    expect(createdCourse).toEqual({ title: "new title", id: expect.any(Number) });

    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, [createdCourse]);
  });

  it("should not update course with incorrect input data", async () => {
    await request(app)
      .put(`/courses/${createdCourse.id}`)
      .send({ title: "" })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get(`/courses/${createdCourse.id}`)
      .expect(HTTP_STATUSES.OK_200, createdCourse);
  });

  it("should update course with correct input model", async () => {
    await request(app)
      .put(`/courses/${createdCourse.id}`)
      .send({ title: "update title" })
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`/courses/${createdCourse.id}`)
      .expect(HTTP_STATUSES.OK_200, { ...createdCourse, title: "update title" });
  });

  it("should delete both courses", async () => {
    await request(app)
      .delete(`/courses/${createdCourse.id}`)
      .send({ title: "update title" })
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app).get(`/courses/${createdCourse.id}`).expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });
});
