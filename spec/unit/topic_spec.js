const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Hack = require("../../src/db/models").Hack;

describe("Topic", () => {
  beforeEach((done) => {
    this.topic;
    this.hack;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Home"
      })
      .then((topic) => {
        this.topic = topic;

        Hack.create({
          title: "Covering scratches on furniture",
          body: "Rub a walnut over scratch marks on wooden furniture. The natural oils in the walnut help cover the scratches.",
          topicId: this.topic.id
        })
        .then((hack) => {
          this.hack = hack;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
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
