const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Hack = require("../../src/db/models").Hack;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("Comment", () => {
  beforeEach((done) => {
    this.user;
    this.topic;
    this.hack;
    this.comment;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "example@example.com",
        password: "123456"
      })
      .then((user) => {
        this.user = user;

        Topic.create({
          title: "Cooking",
          hacks: [{
            title: "Removing Stems from Strawberries",
            body: "Use a straw to easily remove stems from strawberries.",
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
            body: "Amazing!",
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
        });
      });
    });
  });

  describe("#create()", () => {
    it("should creat a comment with a body, assigned post and user", (done) => {
      Comment.create({
        body: "This is so handy!",
        hackId: this.hack.id,
        userId: this.user.id
      })
      .then((comment) => {
        expect(comment.body).toBe("This is so handy!");
        expect(comment.hackId).toBe(this.hack.id);
        expect(comment.userId).toBe(this.user.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a comment with missing body, assigned post or user", (done) => {
      Comment.create({
        body: "invalid98 comment"
      })
      .then((comment) => {
        //should not be evaluated, expecting an error
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Comment.hackId cannot be null");
        expect(err.message).toContain("Comment.userId cannot be null");
        done();
      });
    });
  });
});
