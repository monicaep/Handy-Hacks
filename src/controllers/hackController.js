const hackQueries = require("../db/queries.hacks.js");

module.exports = {
  new(req, res, next) {
    res.render("hacks/new", {topicId: req.params.topicId});
  },

  create(req, res, next) {
    let newHack = {
      title: req.body.title,
      body: req.body.body,
      topicId: req.params.topicId
    };
    hackQueries.addHack(newHack, (err, hack) => {
      if(err) {
        res.redirect(500, "/hacks/new");
      } else {
        res.redirect(303, `/topics/${newHack.topicId}/hacks/${hack.id}`);
      }
    });
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
        res.render("hacks/edit", {hack});
      }
    })
  },

  update(req, res, next) {
    hackQueries.updateHack(req.params.id, req.body, (err, hack) => {
      if(err || hack == null) {
        res.redirect(404, `/topics/${req.params.topicId}/hacks/${req.params.id}/edit`);
      } else {
        res.redirect(`/topics/${req.params.topicId}/hacks/${req.params.id}`);
      }
    });
  },

  destroy(req, res, next) {
    hackQueries.deleteHack(req.params.id, (err, deletedRecordsCount) => {
      if(err) {
        res.redirect(500, `/topics/${req.params.topicId}/hacks/${req.params.id}`)
      } else {
        res.redirect(303, `/topics/${req.params.topicId}`)
      }
    });
  }
}
