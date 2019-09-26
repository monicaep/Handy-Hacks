const Hack = require("./models").Hack;
const Topic = require("./models").Topic;
const Comment = require("./models").Comment;
const User = require("./models").User;
const Authorizer = require("../policies/application");

module.exports = {
  addHack(newHack, callback) {
    return Hack.create(newHack)
    .then((hack) => {
      callback(null, hack);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getHack(id, callback) {
    return Hack.findByPk(id, {
      include: [
        {model: Comment, as: "comments", include: [
          {model: User}
        ]}
      ]
    })
    .then((hack) => {
      callback(null, hack);
    })
    .catch((err) => {
      callback(err);
    })
  },

  updateHack(req, updatedHack, callback) {
    return Hack.findByPk(req.params.id)
    .then((hack) => {
      if (!hack) {
        return callback("Hack not found");
      }
      const authorized = new Authorizer(req.user, hack).update();

      if (authorized) {
        hack.update(updatedHack, {
          fields: Object.keys(updatedHack)
        })
        .then(() => {
          callback(null, hack);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    });
  },

  deleteHack(req, callback) {
    return Hack.findByPk(req.params.id)
    .then((hack) => {
      const authorized = new Authorizer(req.user, hack).destroy();

      if (authorized) {
        hack.destroy()
        .then((res) => {
          callback(null, hack);
        })
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    });
  }

  /*deleteHack(id, callback) {
    return Hack.destroy({
      where: {id}
    })
    .then((deletedRecordsCount) => {
      callback(null, deletedRecordsCount);
    })
    .catch((err) => {
      callback(err);
    })
  }*/
}
