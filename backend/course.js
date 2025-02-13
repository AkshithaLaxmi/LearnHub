function createCourseRoutes(app) {
  app.post("/course/purchase", (req, res) => {});

  app.get("/course/preview", (req, res) => {});
}

module.exports = {
    createCourseRoutes: createCourseRoutes
}