module.exports = {
  fakeIt(app) {
    let role;
    let id;
    let email;

    function middleware(req, res, next) {
      role = req.body.role || role;
      id = req.body.id || id;
      email = req.body.email || email;

      if (id && id != 0) {
        req.user = {
          "id": id,
          "email": email,
          "role": role
        };
      } else if (id === 0) {
        delete req.user;
      }

      if (next) {
        next();
      }

      function route(req, res) {
        res.redirect("/");
      }

      app.use(middleware);
      app.get("/auth/fake", route);
    }
  }
}
