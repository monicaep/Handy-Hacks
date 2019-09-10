const Hack = require("./models").Hack;
const Topic = require("./models").Topic;

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
    return Hack.findByPk(id)
    .then((hack) => {
      callback(null, hack);
    })
    .catch((err) => {
      callback(err);
    })
  },

  updateHack(id, updatedHack, callback) {
    return Hack.findByPk(id)
    .then((hack) => {
      if(!hack) {
        return callback("Hack not found");
      }
      hack.update(updatedHack, {
        fields: Object.keys(updatedHack)
      })
      .then(() => {
        callback(null, hack);
      })
      .catch((err) => {
        callback(err);
      });
    });
  },

  deleteHack(id, callback) {
    return Hack.destroy({
      where: {id}
    })
    .then((deletedRecordsCount) => {
      callback(null, deletedRecordsCount);
    })
    .catch((err) => {
      callback(err);
    })
  }
}
