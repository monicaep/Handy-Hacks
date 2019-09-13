const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });

  describe("#create()", () => {
    it("should create a user object with valid email and password", (done) => {
      User.create({
        email: "example@example.com",
        password:"123456"
      })
      .then((user) => {
        expect(user.email).toBe("example@example.com");
        expect(user.id).toBe(1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a user object with invalid email or password", (done) => {
      User.create({
        email: "not an email!",
        password: "123456"
      })
      .then((user) => {
        //expect error
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Validation error");
        done();
      });
    });

    it("should not create a user with an email that is already in use", (done) => {
      User.create({
        email: "example@example.com",
        password: "123456"
      })
      .then((user) => {

        User.create({
          email: "example@example.com",
          password: "123456"
        })
        .then((user) => {
          //expect error
          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Validation error");
          done();
        });
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
});
