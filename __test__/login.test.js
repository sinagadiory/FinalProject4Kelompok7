
const request = require('supertest');
const app = require('./../app');
const { sequelize } = require("../models/index");
const { queryInterface } = sequelize;
const { hash } = require("../helpers/hash");
const { verify } = require('../helpers/jwt');

const user = {
  full_name: "diory",
  email: "diory@gmail.com",
  username: "diory",
  password: "budiman123?",
  profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
  age: 21,
  phone_number: "0812732322",
  createdAt: new Date(),
  updatedAt: new Date()
}

beforeAll(async () => {
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  const hashedUser = { ...user };
  hashedUser.password = hash(hashedUser.password);
  await queryInterface.bulkInsert('Users', [hashedUser]);
});

afterAll(async () => {
  sequelize.close();
});

describe('POST /users/login', () => {
  test('should return HTTP code 200 and JWT when sign in success', async () => {
    const { body } = await request(app)
      .post('/users/login')
      .send({ email: user.email, password: user.password })
      .expect(200);
    expect(body).toEqual({ token: expect.any(String) });
    const claim = verify(body.token);
    expect(claim).toEqual({ id: 1, email: user.email, iat: expect.any(Number) });
  });
  // test('should return HTTP code 401 when sign in without email', async () => {
  //   const { body } = await request(app)
  //     .post('/users/login')
  //     .send({ password: user.password })
  //     .expect(401);
  //   expect(body.message).toMatch(/wrong email\/password/i);
  // });
  test('should return HTTP code 401 when sign in with empty string email', async () => {
    const { body } = await request(app)
      .post('/users/login')
      .send({ email: '', password: user.password })
      .expect(401);
    expect(body.message).toMatch(/Email or Password is wrong/i);
  });
  test('should return HTTP code 401 when sign in with wrong email', async () => {
    const { body } = await request(app)
      .post('/users/login')
      .send({ email: 'wrong@mail.com', password: user.password })
      .expect(401);
    expect(body.message).toMatch(/Email or Password is wrong/i);
  });
  // test('should return HTTP code 401 when sign in without password', async () => {
  //   const { body } = await request(app)
  //     .post('/users/login')
  //     .send({ email: user.email })
  //     .expect(401);
  //   expect(body.message).toMatch(/Email or Password is wrong/i);
  // });
  test('should return HTTP code 401 when sign in with empty string password', async () => {
    const { body } = await request(app)
      .post('/users/login')
      .send({ email: user.email, password: '' })
      .expect(401);
    expect(body.message).toMatch(/Email or Password is wrong/i);
  });
  test('should return HTTP code 401 when sign in with wrong password', async () => {
    const { body } = await request(app)
      .post('/users/login')
      .send({ email: user.email, password: 'wrongpassword' })
      .expect(401);
    expect(body.message).toMatch(/Email or Password is wrong/i);
  });
});
