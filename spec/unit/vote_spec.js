const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Hack = require("../../src/db/models").Hack;
const Comment = require("../../src/db/models").Comment;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;

describe("Vote", () => {
  beforeEach((done) => {
    this.user;
    this.topic;
    this.hack;
    this.vote;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "example@example.com",
        password: "123456"
      })
      .then((user) => {
        this.user = user;

        Topic.create({
          title: "Travel",
          hacks: [{
            title: "Save space while packing",
            body: "Roll your clothes, instead of folding it to save space!",
            userId: this.user.id
          }]
        }, {
          include: {
            model: Hack,
            as: "hacks"
          }
        })
        .then((topic) => {
          this.topic = topic;
          this.hack = this.topic.hacks[0];

          Comment.create({
            body: "This is great!",
            userId: this.user.id,
            hackId: this.hack.id
          })
          .then((comment) => {
            this.comment = comment;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("#create()", () => {
    it("should create an upvote on a hack", (done) => {
      Vote.create({
        value: 1,
        hackId: this.hack.id,
        userId: this.user.id
      })
      .then((vote) => {
        expect(vote.value).toBe(1);
        expect(vote.hackId).toBe(this.hack.id);
        expect(vote.userId).toBe(this.user.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should create a downvote on a hack", (done) => {
      Vote.create({
        value: -1,
        hackId: this.hack.id,
        userId: this.user.id
      })
      .then((vote) => {
        expect(vote.value).toBe(-1);
        expect(vote.hackId).toBe(this.hack.id);
        expect(vote.userId).toBe(this.user.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a vote without assigned hack or user", (done) => {
      Vote.create({
        value: 1
      })
      .then((vote) => {
        //expecting an error
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Vote.hackId cannot be null");
        expect(err.message).toContain("Vote.userId cannot be null");
      });
    });
  });
});
