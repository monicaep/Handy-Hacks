const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Hack = require("../../src/db/models").Hack;
const User = require("../../src/db/models").User;

describe("Topic", () => {
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
          title: "Home",
          hacks: [{
            title: "Covering scratches on furniture",
            body: "Rub a walnut over scratch marks on wooden furniture. The natural oils in the walnut help cover the scratches.",
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
    it("should create a topic object with a title", (done) => {
      Topic.create({
        title: "Beauty"
      })
      .then((topic) => {
        expect(topic.title).toBe("Beauty");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#getHacks()", () => {
    it("should return an array of hack objects associated with the topic", (done) => {
      this.topic.getHacks()
      .then((hacks) => {
        expect(hacks[0].title).toBe("Covering scratches on furniture");
        expect(hacks[0].body).toBe("Rub a walnut over scratch marks on wooden furniture. The natural oils in the walnut help cover the scratches.");
        done();
      });
    });
  });
});
