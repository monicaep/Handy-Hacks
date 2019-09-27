const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Hack = require("../../src/db/models").Hack;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;

describe("routes : votes", () => {
  beforeEach((done) => {
    this.user;
    this.topic;
    this.hack;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "example@example.com",
        password: "123456"
      })
      .then((user) => {
        this.user = user;

        Topic.create({
          title: "Pets",
          hacks: [{
            title: "Easy DIY hidden litter box",
            body: "Make a hole in a crate for an easy hidden litter box.",
            userId: this.user.id
          }]
        }, {
          inculde: {
            model: Hack,
            as: "hacks"
          }
        })
        .then((topic) => {
          this.topic = topic;
          this.hack = this.topic.hacks[0];
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("signed in user voting on a hack", () => {
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "member",
          userId: this.user.id
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("GET /topics/:topicId/hacks/:hackId/votes/upvote", () => {
      it("should create an upvote", (done) => {
        const options = {
          url: `${base}${this.topic.id}/hacks/${this.hack.id}/vote/upvote`
        };
        request.get(options, (err, res, body) => {
          Vote.findOne({
            where: {
              userId: this.user.id,
              hackId: this.hack.id
            }
          })
          .then((vote) => {
            expect(vote).not.toBeNull();
            expect(vote.value).toBe(1);
            expect(vote.userId).toBe(this.user.id);
            expect(vote.hackId).toBe(this.hack.id);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("GET /topics/:topicId/hacks/:hackId/votes/downvote", () => {
      it("should create a downvote", (done) => {
        const options = {
          url: `${base}${this.topic.id}/hacks/${this.hack.id}/vote/downvote`
        };
        request.get(options, (err, res, body) => {
          Vote.findOne({
            where: {
              userId: this.user.id,
              hackId: this.hack.id
            }
          })
          .then((vote) => {
            expect(vote).not.toBeNull();
            expect(vote.value).toBe(-1);
            expect(vote.userId).toBe(this.user.id);
            expect(vote.hackId).toBe(this.hack.id);
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });
  });

  describe("guest attempting to vote on a hack", () => {
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          userId: 0
        }
      },
        (err, res, body) => {
          done();
        }
      );
    });

    describe("GET /topics/:topicId/hacks/:hackId/votes/upvote", () => {
      it("should not create an upvote", (done) => {
        const options = {
          url: `${base}${this.topic.id}/hacks/${this.hack.id}/votes/upvote`
        };
        request.get(options, (err, res, body) => {
          Vote.findOne({
            where: {
              userId: this.user.id,
              hackId: this.hack.id
            }
          })
          .then((vote) => {
            expect(vote).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });
  });
});
