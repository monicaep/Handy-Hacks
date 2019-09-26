const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Hack = require("../../src/db/models").Hack;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("routes : comments", () => {
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
          title: "Pets",
          hacks: [{
            title: "Protecting furniture from cats",
            body: "Cover furnitute with foil. Kitties won't like the way it feels and will stop using it as a scratching post",
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
            body: "This saved my couch!",
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

  describe("signed in user performng CRUD actions for Comment", () => {
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

    describe("POST /topics/:topicId/hacks/:hackId/comments/create", () => {
      it("should create a new comment", (done) => {
        const options = {
          url: `${base}${this.topic.id}/hacks/${this.hack.id}/comments/create`,
          form: {
            body: "Amazing!"
          }
        };
        request.post(options, (err, res, body) => {
          Comment.findOne({where: {body: "Amazing!"}})
          .then((comment) => {
            expect(comment).not.toBeNull();
            expect(comment.body).toBe("Amazing!");
            expect(comment.id).not.toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("POST /topics/:topicId/hacks/:hackId/comments/:id/destroy", () => {
      it("should delete the comment with the associated ID", (done) => {
        Comment.findAll()
        .then((comments) => {
          const commentCountBeforeDelete = comments.length;

          expect(commentCountBeforeDelete).toBe(1);

          request.post(`${base}${this.topic.id}/hacks/${this.hack.id}/comments/${this.comment.id}/destroy`,
          (err, res, body) => {
            Comment.findAll()
            .then((comments) => {
              expect(err).toBeNull();
              expect(comments.length).toBe(commentCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });
  });

  describe("guest attempting to perform CRUD actions", () => {
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

    describe("POST /topics/:topicId/hacks/:hackId/comments/create", () => {
      it("should not create a new comment", (done) => {
        const options = {
          url: `${base}${this.topic.id}/hacks/${this.hack.id}/comments/create`,
          form: {
            body: "Super!"
          }
        };
        request.post(options, (err, res, body) => {
          Comment.findOne({where: {body: "Super!"}})
          .then((comment) => {
            expect(comment).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("POST /topics/:topicId/hacks/:hackId/comments/:id/destroy", () => {
      it("should not delete the comment with the associated ID", (done) => {
        Comments.findAll()
        .then((comments) => {
          const commentCountBeforeDelete = comments.length;

          expect(commentCountBeforeDelete).toBe(1);

          request.post(`${base}${this.topic.id}/hacks/${this.hack.id}/comments/${this.comment.id}/destroy`,
          (err, res, body) => {
            Comment.findAll()
            .then((comments) => {
              expect(err).toBeNull();
              expect(comments.length).toBe(commentCountBeforeDelete);
              done();
            });
          });
        });
      });
    });
  });
});
