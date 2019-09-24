module.exports = {
  validateTopics(req, res, next) {
    if(req.method === "POST") {
      req.checkBody("title", "must be at least 2 characters in length").isLength({min: 2});
    }
    const errors = req.validationErrors();
    if(errors) {
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer)
    } else {
      return next();
    }
  },

  validateHacks(req, res, next) {
    if(req.method === "POST") {
      req.checkParams("topicId", "must be valid").notEmpty().isInt();
      req.checkBody("title", "must be at least 2 characters in length").isLength({min: 2});
      req.checkBody("body", "must be at least 5 characters in length").isLength({min: 5});
    }
    const errors = req.validationErrors();
    if(errors) {
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer);
    } else {
      return next();
    }
  },

  validateUsers(req, res, next) {
    if(req.method === "POST") {
      req.checkBody("email", "must be a valid email").isEmail();
      req.checkBody("password", "must be at least 6 characters long").isLength({min: 6});
      req.checkBody("passwordConfirmation", "must match the password provided").optional().matches(req.body.password);
    }
    const errors = req.validationErrors();
    if(errors) {
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      return next();
    }
  }
}
