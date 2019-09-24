const hackQueries = require("../db/queries.hacks.js");
const Authorizer = require("../policies/application");

module.exports = {
  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();

    if (authorized) {
      res.render("hacks/new", {topicId: req.params.topicId});
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect(`/topics/${req.params.topicId}`);
    };
  },

  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();

    if (authorized) {
      let newHack = {
        title: req.body.title,
        body: req.body.body,
        topicId: req.params.topicId,
        userId: req.user.id
      };
      hackQueries.addHack(newHack, (err, hack) => {
        if(err) {
          res.redirect(500, "/hacks/new");
        } else {
          res.redirect(303, `/topics/${newHack.topicId}/hacks/${hack.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect(`/topics/${req.params.topicId}`);
    }
  },

  show(req, res, next) {
    hackQueries.getHack(req.params.id, (err, hack) => {
      if(err || hack == null) {
        res.redirect(404, "/");
      } else {
        res.render("hacks/show", {hack});
      }
    });
  },

  edit(req, res, next) {
    hackQueries.getHack(req.params.id, (err, hack) => {
      if(err || hack == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, hack).edit();

        if (authorized) {
          res.render("hacks/edit", {hack});
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/topics/${req.params.topicId}`);
        }

      }
    })
  },

  update(req, res, next) {
    hackQueries.updateHack(req, req.body, (err, hack) => {
      if(err || hack == null) {
        res.redirect(404, `/topics/${req.params.topicId}/hacks/${req.params.id}/edit`);
      } else {
        res.redirect(`/topics/${req.params.topicId}/hacks/${req.params.id}`);
      }
    });
  },

  destroy(req, res, next) {
    hackQueries.deleteHack(req, (err) => {
      if(err) {
        console.log(`err happened: ${err}`);
        res.redirect(err, `/topics/${req.params.topicId}/hacks/${req.params.id}`)
      } else {
        console.log(`executing else controller`);
        res.redirect(`/topics/${req.params.topicId}`)
      }
    });
  }

  /*destroy(req, res, next) {
    hackQueries.deleteHack(req.params.id, (err, deletedRecordsCount) => {
      if (err) {
        res.redirect(500, `/topics/${req.params.topicId}/hacks/${req.params.id}`)
      } else {
        res.redirect(303, `/topics/${req.params.topicId}`)
      }
    });
  }*/
}
