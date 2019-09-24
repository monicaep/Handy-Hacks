const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Hack = require("../../src/db/models").Hack;
const User = require("../../src/db/models").User;

describe("routes : hacks", () => {
  beforeEach((done) => {
    this.topic;
    this.hack;
    this.user;
    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "example@example.com",
        password: "123456"
      })
      .then((user) => {
        this.user = user;

        Topic.create({
          title: "Life",
          hacks: [{
            title: "Makeshift lint roller",
            body: "Use packing tape to create a make shift lint roller. Roll the tape around the roll, with the sticky side facing out. Roll away lint!",
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
          this.hack = topic.hacks[0];
          done();
        });
      });
    });
  });

  describe("GET /topics/:topicId/hacks/new", () => {
    it("should render a new hack form", (done) => {
      request.get(`${base}/${this.topic.id}/hacks/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Hack");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/hacks/create", () => {
    it("should create a new hack", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/hacks/create`,
        form: {
          title: "Example hack",
          body: "something cool"
        }
      };
      request.post(options, (err, res, body) => {
        Hack.findOne({where: {title: "Example hack"}})
        .then((hack) => {
          expect(hack).not.toBeNull();
          expect(hack.title).toBe("Example hack");
          expect(hack.body).toBe("something cool");
          expect(hack.topicId).not.toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

    it("should not create a new hack that fails validations", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/hacks/create`,
        form: {
          title: "a",
          body: "b"
        }
      };
      request.post(options, (err, res, body) => {
        Hack.findOne({where: {title: "a"}})
        .then((hack) => {
          expect(hack).toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("GET /topics/:topicId/hacks/:id", () => {
    it("should render a view with the selected hack", (done) => {
      request.get(`${base}/${this.topic.id}/hacks/${this.hack.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Makeshift lint roller");
        done();
      });
    });
  });

  describe("GET /topics/:topicId/hacks/:id/edit", () => {
    it("should render a view with an edit hack form", (done) => {
      request.get(`${base}/${this.topic.id}/hacks/${this.hack.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Hack");
        expect(body).toContain("Makeshift lint roller");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/hacks/:id/update", () => {
    it("should update the hack with the given values", (done) => {
      const options = {
        url: `${base}/${this.topic.id}/hacks/${this.hack.id}/update`,
        form: {
          title: "Lint rolling without a lint roller"
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        Hack.findOne({
          where: {id: this.hack.id}
        })
        .then((hack) => {
          expect(hack.title).toBe("Lint rolling without a lint roller");
          done();
        });
      });
    });
  });

  describe("POST /topics/:topicId/hacks/:id/destroy", () => {
    it("should delete the hack with the associated id", (done) => {
      expect(this.hack.id).toBe(1);
      request.post(`${base}/${this.topic.id}/hacks/${this.hack.id}/destroy`, (err, res, body) => {
        Hack.findByPk(1)
        .then((hack) => {
          expect(err).toBeNull();
          expect(hack).toBeNull();
          done();
        });
      });
    });
  });
});
