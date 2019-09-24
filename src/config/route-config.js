module.exports = {
  init(app) {
    const staticRoutes = require("../routes/static");
    const topicRoutes = require("../routes/topics");
    const hackRoutes = require("../routes/hacks");
    const userRoutes = require("../routes/users");

    if (process.env.NODE_ENV === "test") {
      const mockAuth = require("../../spec/support/mock-auth.js");
      mockAuth.fakeIt(app);
    }

    app.use(staticRoutes);
    app.use(topicRoutes);
    app.use(hackRoutes);
    app.use(userRoutes);
  }
}
