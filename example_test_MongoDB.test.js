const mongoose = require("mongoose");
const bbdd = "mongodb://localhost:27017/test_darwinex";
process.env.DB_URL = bbdd;
const app = require("../server/server");
const { Users } = require("../server/repository/models");
const request = require("supertest");
const should = require("should");

let token = null;

before(function (done) {
  mongoose.connect(`${bbdd}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  const user1 = new Users({
    _id: "6181608b936f234576a24d4d",
    role: "FREEUSER_ROLE",
    status: true,
    active: false,
    lang: "ESP",
    username: "BaldanHero",
    email: "baldanhero@gmail.com",
    password: "$2b$10$uRcaXQzhtSjzIkVRPcVxNeTlj6Hr2J24NyrrQ65d/cYgwm1DaRf/i",
  });

  user1.save().then(() => {
    done();
  });
});

before(function (done) {
  request(app)
    .post("/users/login")
    .send({ email: "baldanhero@gmail.com", password: "admin" })
    .end(function (err, res) {
      token = res.body.token;
      done();
    });
});

it("Let´s create a collection", function (done) {
  request(app)
    .post("/users/collections") //Hay que cambiar esto
    .send({ darwin: ["JSX", "CSS", "GNU"], date: 111111 })
    .set("Accept", "application/json")
    .set("token", token)
    .expect("Content-Type", /json/)
    .expect(200)
    .end(function (err, res) {
      res.status.should.equal(200);
      //res.body.data.collections.length.should.greaterThan(0);
      //res.body.collections.length.should.greaterthan(0);
      done();
    });
});

after(async () => {
  try {
    await mongoose.connection.dropDatabase();
  } catch (error) {
    console.log(error);
  }
  mongoose.connection.close();
});
