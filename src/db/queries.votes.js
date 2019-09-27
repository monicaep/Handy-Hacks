const Hack = require("./models").Hack;
const User = require("./models").User;
const Vote = require("./models").Vote;

module.exports = {
  createVote(req, val, callback) {
    return Vote.findOne({
      where: {
        hackId: req.params.hackId,
        userId: req.user.id
      }
    })
    .then((vote) => { //update vote if user has already voted
      if (vote) {
        vote.value = val;
        vote.save()
        .then((vote) => {
          callback(null, vote);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        Vote.create({
          value: val,
          hackId: req.params.hackId,
          userId: req.user.id
        })
        .then((vote) => {
          callback(null, vote);
        })
        .catch((err) => {
          callback(err);
        })
      }
    });
  }
}
