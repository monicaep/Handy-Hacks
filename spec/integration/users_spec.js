const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {
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

  describe("GET /users/sign_up", () => {
    it("should render a view with a sign up form", (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });
  });

  describe("POST /users", () => {
    it("should create a new user with valid email and password", (done) => {
      const options = {
        url: base,
        form: {
          email: "example@example.com",
          password: "123456"
        }
      }
      request.post(options, (err, res, body) => {
        User.findOne({where: {email: "example@example.com"}})
        .then((user) => {
          expect(user).not.toBeNull();
          expect(user.email).toBe("example@example.com");
          expect(user.id).toBe(1);
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

    it("should not create a new user with invalid email or password", (done) => {
      const optionsTwo = {
        url: base,
        form: {
          email: "not an email",
          password: "12345"
        }
      }
      request.post(optionsTwo, (err, res, body) => {
        User.findOne({where: {email: "not an email"}})
        .then((user) => {
          expect(user).toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("GET /users/sign_in", () => {
    it("should render a view with a sign in form", (done) => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign in");
        done();
      });
    });
  });
});