const request = require('supertest');
const app = require('./../app');
const { sequelize } = require('./../models/index');
const { queryInterface } = sequelize;
const { hash } = require('./../helpers/hash');
const { sign } = require('../helpers/jwt');

const user = {
  full_name: "budiman",
  email: "budiman@gmail.com",
  username: "budiman",
  password: "budiman123?",
  profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
  age: 21,
  phone_number: "0812732322",
  createdAt: new Date(),
  updatedAt: new Date()
}

const user1 = {
  full_name: "Diory Pribadi Sinaga",
  email: "diory@gmail.com",
  username: "diory",
  password: "Diory123?",
  profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
  age: 21,
  phone_number: "0812732322",
  createdAt: new Date(),
  updatedAt: new Date()
};

const userToken = sign({ id: 1, email: user.email });


beforeAll(async () => {
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  const hashedUser = { ...user }
  const hashedUser1 = { ...user1 }
  hashedUser.password = hash(hashedUser.password);
  hashedUser1.password = hash(hashedUser1.password);
  await queryInterface.bulkInsert('Users', [hashedUser, hashedUser1]);
});

afterAll(async () => {
  sequelize.close();
});

describe('GET users', () => {
  test('should return HTTP code 200 when GET users success', async () => {
    const { body } = await request(app)
      .get('/users/all')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(body).toEqual([
      {
        id: 1, full_name: user.full_name, email: user.email, username: user.username, profile_image_url: user.profile_image_url, password: expect.any(String), age: user.age, phone_number: Number(user.phone_number), createdAt: expect.any(String),
        updatedAt: expect.any(String)
      },
      {
        id: 2, full_name: user1.full_name, email: user1.email, username: user1.username, profile_image_url: user1.profile_image_url, password: expect.any(String), age: user1.age, phone_number: Number(user1.phone_number), createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }
    ])
  });
  test('should return HTTP status code 401 when no authorization', async () => {
    const { body } = await request(app)
      .get('/users/all')
      .expect(401);
    expect(body.message).toMatch(/Unauthorized/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .get('/users/all')
      .set('Authorization', 'Bearer ')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .get('/users/all')
      .set('Authorization', 'Bearer wrong.token.input')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
});
