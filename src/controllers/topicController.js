const topicQueries = require("../db/queries.topics.js");
const Authorizer = require("../policies/topic");

module.exports = {
  index(req, res, next) {
    topicQueries.getAllTopics((err, topics) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("topics/index", {topics});
      }
    })
  },

  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();

    if (authorized) {
      console.log('authorized');
      res.render("topics/new");
    } else {
      console.log('not authorized');
      console.log('req.user.role' + req.user.role);
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/topics");
    }

  },

  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();

    if (authorized) {
      let newTopic = {
        title: req.body.title,
        image: req.body.image
      };
      topicQueries.addTopic(newTopic, (err, topic) => {
        if (err) {
          res.redirect(500, "/topics/new");
        } else {
          res.redirect(303, `/topics/${topic.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/topics");
    }
  },

  show(req, res, next) {
    topicQueries.getTopic(req.params.id, (err, topic) => {
      if (err || topic === null) {
        res.redirect(404, "/");
      } else {
        res.render("topics/show", {topic});
      }
    });
  },

  edit(req, res, next) {
    topicQueries.getTopic(req.params.id, (err, topic) => {
      if (err || topic === null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, topic).edit();

        if (authorized) {
          res.render("topics/edit", {topic});
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/topics/${req.params.id}`);
        }
      }
    });
  },

  /*update(req, res, next) {
    const authorized = new Authorizer(req.user, topic).update();
    console.log(`topic ${topic}`);
    console.log(`topic id ${topic.id}`);

    if (authorized) {
      topicQueries.updateTopic(req.params.id, req.body, (err, topic) => {
        if  (err || topic === null) {
          res.redirect(404, `/topics/${req.params.id}/edit`);
        } else {
          res.redirect(`/topics/${topic.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect(`/topics/${req.params.id}`);
    }

  },*/
  update(req, res, next) {
    topicQueries.updateTopic(req, req.body, (err, topic) => {
      if (err || topic == null) {
        res.redirect(401, `/topics/${req.params.id}/edit`);
      } else {
        res.redirect(`/topics/${req.params.id}`);
      }
    });
  },

  /*destroy(req, res, next) {
    const authorized = new Authorizer(req.user, topic).destroy();

    if (authorized) {
      topicQueries.deleteTopic(req.params.id, (err, topic) => {
        if (err) {
          res.redirect(500, `/topics/${topics.id}`)
        } else {
          res.redirect(303, "/topics")
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect(`/topics/${req.params.id}`);
    }

  }*/
  destroy(req, res, next) {
    topicQueries.deleteTopic(req, (err, topic) => {
      if (err) {
        res.redirect(err, `/topics/${req.params.id}`)
      } else {
        res.redirect(303, "/topics")
      }
    });
  }
}
