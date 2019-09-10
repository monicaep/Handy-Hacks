const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Hack = require("../../src/db/models").Hack;

describe("Hack", () => {
  beforeEach((done) => {
    this.topic;
    this.hack;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Pets"
      })
      .then((topic) => {
        this.topic = topic;

        Post.create({
          title: "Cleaning up urine",
          body: "Use baking soda to clean up accidents on the carpet, couch or bed. Pour baking soda over the pee, let it soak for 20 minutes then vaccuum it up!",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
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
    it("should create a hack object with a title, body and assigned topic", (done) => {
      Hack.create({
        title: "Get rid of loose hair",
        body: "Use a dryer sheet to pick up loose hair. Works great for couches, or whatever else you want to get pet hair off of.",
        topicId: this.topic.id
      })
      .then((hack) => {
        expect(hack.title).toBe("Get rid of loose hair");
        expect(hack.body).toBe("Use a dryer sheet to pick up loose hair. Works great for couches, or whatever else you want to get pet hair off of.");
        done();
      });
    });

    it("should not create a hack with missing title, body or assigned topic", (done) => {
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
