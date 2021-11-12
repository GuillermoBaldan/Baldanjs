const mongoose = require('mongoose');
const bbdd = 'mongodb://localhost:27017/test_darwinex';
process.env.DB_URL = bbdd;
const app = require('../server/server');
const { Users } = require('../server/repository/models');
const request = require('supertest');
const should = require('should');
const chai = require('chai');
const expect = chai.expect;
let token = null;
let itemId;

before(function(done) {
  mongoose.connect(`${bbdd}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
  const user1 = new Users({
    _id: '6181608b936f234576a24d4d',
    role: 'FREEUSER_ROLE',
    status: true,
    active: false,
    lang: 'ESP',
    username: 'BaldanHero',
    email: 'baldanhero@gmail.com',
    password: '$2b$10$uRcaXQzhtSjzIkVRPcVxNeTlj6Hr2J24NyrrQ65d/cYgwm1DaRf/i'
  });

  user1.save().then(() => {
    done();
  });
});

before(function(done) {
  request(app)
    .post('/users/login')
    .send({ email: 'baldanhero@gmail.com', password: 'admin' })
    .end(function(err, res) {
      token = res.body.token;
      done();
    });
});

it('Let´s create a collection', function(done) {
  request(app)
    .post('/users/collections') //Hay que cambiar esto
    .send({ darwin: ['JSX', 'CSS', 'GNU'], date: 111111 })
    .set('Accept', 'application/json')
    .set('token', token)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      res.body.data.collections.length.should.equal(1);
      res.body.data.collections[0].darwin.length.should.equal(3);
      expect(res.body.data.collections[0].darwin).deep.to.equal([
        'JSX',
        'CSS',
        'GNU'
      ]);
      done();
    });
});

it('Let´s add a second collection', function(done) {
  request(app)
    .post('/users/collections') //Hay que cambiar esto
    .send({ darwin: ['GBL', 'MEP', 'MBL'], date: 222222 })
    .set('Accept', 'application/json')
    .set('token', token)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      itemId = res.body.data.collections[1]._id;
      res.status.should.equal(200);
      res.body.data.collections.length.should.equal(2);
      expect(res.body.data.collections[1].darwin).deep.to.equal([
        'GBL',
        'MEP',
        'MBL'
      ]);
      res = undefined;
      done();
    });
});

it('Let´s check the value of res.body.data', function(done) {
  request(app)
    .get('/users/cars') //Hay que cambiar esto
    .set('token', token)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      res.status.should.equal(404);
      console.log(res.body.data);

      done();
    });
});

it('Let´s show the collections', function(done) {
  request(app)
    .get('/users/collections') //Hay que cambiar esto
    //.set('Accept', 'application/json')
    .set('token', token)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      console.log(res.body.data);
      expect(res.body.data.collections[0].darwin).deep.to.equal([
        'JSX',
        'CSS',
        'GNU'
      ]);
      expect(res.body.data.collections[1].darwin).deep.to.equal([
        'GBL',
        'MEP',
        'MBL'
      ]);
      done();
    });
});

it('Let´s edit the second collection', function(done) {
  request(app)
    .put(`/users/collections/${itemId}`)
    //.set('Accept', 'application/json')
    .send({ darwin: ['GGG', 'BBB', 'LLL'], date: 33333 })
    .set('Accept', 'application/json')
    .set('token', token)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      expect(res.body.collections[1].darwin).deep.to.equal([
        'GGG',
        'BBB',
        'LLL'
      ]);
      done();
    });
});

it('Let´s delete the second collection', function(done) {
  request(app)
    .delete(`/users/collections/${itemId}`)
    //.set('Accept', 'application/json')
    .set('Accept', 'application/json')
    .set('token', token)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      console.log(res.body);
      expect(res.body.deletedCount.should.equal(1));
      done();
    });
});

it('Let´s check that there is only one collection', function(done) {
  request(app)
    .get(`/users/collections`)
    //.set('Accept', 'application/json')
    .set('Accept', 'application/json')
    .set('token', token)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      res.status.should.equal(200);
      console.log(res.body.data.collections);
      expect(res.body.data.collections.length.should.equal(1));
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
