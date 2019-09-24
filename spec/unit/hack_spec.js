const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Hack = require("../../src/db/models").Hack;
const User = require("../../src/db/models").User;

describe("Hack", () => {
  beforeEach((done) => {
    this.topic;
    this.hack;
    this.user;
    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "exmaple@example.com",
        password: "123456"
      })
      .then((user) => {
        this.user = user;

        Topic.create({
          title: "Pets",
          hacks: [{
            title: "Cleaning up urine",
            body: "Use baking soda to clean up accidents on the carpet, couch or bed. Pour baking soda over the pee, let it soak for 20 minutes then vaccuum it up!",
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

  describe("#create()", () => {
    it("should create a hack object with a title, body, assigned topic and assigned user", (done) => {
      Hack.create({
        title: "Get rid of loose hair",
        body: "Use a dryer sheet to pick up loose hair. Works great for couches, or whatever else you want to get pet hair off of.",
        topicId: this.topic.id,
        userId: this.user.id
      })
      .then((hack) => {
        expect(hack.title).toBe("Get rid of loose hair");
        expect(hack.body).toBe("Use a dryer sheet to pick up loose hair. Works great for couches, or whatever else you want to get pet hair off of.");
        expect(hack.topicId).toBe(this.topic.id);
        expect(hack.userId).toBe(this.user.id);
        done();
      });
    });

    it("should not create a hack with missing title, body, assigned topic or assigned user", (done) => {
      Hack.create({
        title: "Failed hack"
      })
      .then((hack) => {
        //should not evaluate
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Hack.body cannot be null");
        expect(err.message).toContain("Hack.topicId cannot be null");
        done();
      });
    });
  });
});
