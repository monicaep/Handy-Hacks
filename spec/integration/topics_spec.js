const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const User = require("../../src/db/models").User;

function createUser(role, done) { //helper function for mock user authorization
  this.user;

  User.create({
    email:`${role}@example.com`,
    password: "123456",
    role: role
  })
  .then((user) => {
    request.get({
      url: "http://localhost:3000/auth/fake",
      form: {
        userId: user.id,
        email: user.email,
        role: user.role
      }
    },
      (err, res, body) => {
        done();
      }
    );
  })
  .then((user) => {
    this.user = user;
    done();
  })
}

describe("routes : topics", () => {

  beforeEach((done) => {
    this.topic;
    sequelize.sync({force: true}).then((res) => { //clear database
      Topic.create({
        title: "Pets"
      })
      .then((topic) => {
        this.topic = topic;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("admin user performing CRUD actions for topic", () => {
    beforeEach((done) => {
      createUser("admin", done);
    });

    describe("GET /topics", () => {
      it("should return all topics", (done) => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Topics");
          expect(body).toContain("Pets");
          done();
        });
      });
    });

    describe("GET /topics/new", () => {
      it("should render a new topic form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Topic");
          done();
        });
      });
    });

    describe("POST /topics/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Money"
        }
      };

      it("should create a new topic", (done) => {
        request.post(options, (err, res, body) => {
          Topic.findOne({where: {title: "Money"}})
          .then((topic) => {
            expect(topic.title).toBe("Money");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      it("should not create a topic that fails validations", (done) => {
        const options = {
          url: `${base}create`,
          form: {
            title: "a"
          }
        };
        request.post(options, (err, res, body) => {
          Topic.findOne({where: {title: "a"}})
          .then((topic) => {
            expect(topic).toBeNull();
            done();
          });
        });
      });
    });

    describe("GET /topics/:id", () => {
      it("should render a view with the selected topic", (done) => {
        request.get(`${base}${this.topic.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Pets");
          done();
        });
      });
    });

    describe("POST /topics/:id/destroy", () => {
      it("should delete the topic with the associated ID", (done) => {
        Topic.findAll()
        .then((topics) => {
          const topicCountBeforeDelete = topics.length;
          expect(topicCountBeforeDelete).toBe(1);

          request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
            Topic.findAll()
            .then((topics) => {
              expect(err).toBeNull();
              expect(topics.length).toBe(topicCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });

    describe("GET /topics/:id/edit", () => {
      it("should render a view with an edit topic form", (done) => {
        request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Topic");
          expect(body).toContain("Pets");
          done();
        });
      });
    });

    describe("POST /topics/:id/update", () => {
      it("should update the topic with the given values", (done) => {
        const options = {
          url: `${base}${this.topic.id}/update`,
          form: {
            title: "Furry Creatures"
          }
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();

          Topic.findOne({
            where: {id: this.topic.id}
          })
          .then((topic) => {
            expect(topic.title).toBe("Furry Creatures");
            done();
          });
        });
      });
    });

    describe("POST /topics/:id/update", () => {
      it("should update the topic with the given values", (done) => {
        request.post({
          url: `${base}${this.topic.id}/update`,
          form: {
            title: "Furry Creatures"
          }
        },
        (err, res, body) => {
          expect(err).toBeNull();

          Topic.findOne({
            where: {id: this.topic.id}
          })
          .then((topic) => {
            expect(topic.title).toBe("Furry Creatures");
            done();
          });
        });
      });
    });
  });// end of admin CRUD

  describe("member user performing CRUD actions for topic", () => {
    beforeEach((done) => {
      createUser("member", done);
    });

    describe("GET /topics", () => {
      it("should return all topics", (done) => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Topics");
          expect(body).toContain("Pets");
          done();
        });
      });
    });

    describe("GET /topics/new", () => {
      it("should redirect to view all topics", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Topics");
          done();
        });
      });
    });

    describe("POST /topics/create", () => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Money"
        }
      };

      it("should not create a new topic", (done) => {
        request.post(options, (err, res, body) => {
          Topic.findOne({where: {title: "Money"}})
          .then((topic) => {
            expect(topic).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });

    describe("GET /topics/:id", () => {
      it("should render a view with the selected topic", (done) => {
        request.get(`${base}${this.topic.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Pets");
          done();
        });
      });
    });

    describe("POST /topics/:id/destroy", () => {
      it("should not delete the topic with the associated ID", (done) => {
        Topic.findAll()
        .then((topics) => {
          const topicCountBeforeDelete = topics.length;
          expect(topicCountBeforeDelete).toBe(1);

          request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
            Topic.findAll()
            .then((topics) => {
              expect(topics.length).toBe(topicCountBeforeDelete);
              done();
            });
          });
        });
      });
    });

    describe("GET /topics/:id/edit", () => {
      it("should not render a view with an edit topic form", (done) => {
        request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).not.toContain("Edit Topic");
          expect(body).toContain("Pets");
          done();
        });
      });
    });

    describe("POST /topics/:id/update", () => {
      it("should not update the topic with the given values", (done) => {
        const options ={
          url: `${base}${this.topic.id}/update`,
          form: {
            title: "Furry Creatures"
          }
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();

          Topic.findOne({
            where: {id: this.topic.id}
          })
          .then((topic) => {
            expect(topic.title).toBe("Pets");
            done();
          });
        });
      });
    });
  }); // end of member CRUD
});
