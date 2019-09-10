module.exports = {
  init(app) {
    const staticRoutes = require("../routes/static");
    const topicRoutes = require("../routes/topics");
    const hackRoutes = require("../routes/hacks");

    app.use(staticRoutes);
    app.use(topicRoutes);
    app.use(hackRoutes);
  }
}
