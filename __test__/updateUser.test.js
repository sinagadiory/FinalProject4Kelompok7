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
const userToken1 = sign({ id: 2, email: user1.email });


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

describe('PUT /users/:id', () => {
  test('should return HTTP code 403 when put user forbiden', async () => {
    const { body } = await request(app)
      .put('/users/1')
      .set('Authorization', `Bearer ${userToken1}`)
      .send({ full_name: "Diory Pribadi Sinaga", username: "diorysinaga" })
      .expect(403);
    expect(body.message).toMatch(/Anda Tidak Diijinkan!!/i)
  });
  test('should return HTTP code 200 when put user success', async () => {
    const { body } = await request(app)
      .put('/users/2')
      .set('Authorization', `Bearer ${userToken1}`)
      .send({ full_name: "Diory Pribadi Sinaga", username: "diorysinaga" })
      .expect(200);
    expect(body[0]).toEqual({
      id: 2, full_name: "Diory Pribadi Sinaga", email: user1.email, username: "diorysinaga", profile_image_url: user1.profile_image_url, password: expect.any(String), age: user1.age, phone_number: Number(user1.phone_number), createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  });
  test('should return HTTP code 200 when put user success', async () => {
    const { body } = await request(app)
      .put('/users/2')
      .set('Authorization', `Bearer ${userToken1}`)
      .send({ profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658582356/0543479000-DV1696257780x390_rq1xub.jpg" })
      .expect(200);
    expect(body[0]).toEqual({
      id: 2, full_name: "Diory Pribadi Sinaga", email: user1.email, username: "diorysinaga", profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658582356/0543479000-DV1696257780x390_rq1xub.jpg", password: expect.any(String), age: user1.age, phone_number: Number(user1.phone_number), createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  });
  test('should return HTTP code 200 when put user success', async () => {
    const { body } = await request(app)
      .put('/users/2')
      .set('Authorization', `Bearer ${userToken1}`)
      .send({ phone_number: "083243545" })
      .expect(200);
    expect(body[0]).toEqual({
      id: 2, full_name: "Diory Pribadi Sinaga", email: user1.email, username: "diorysinaga", profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658582356/0543479000-DV1696257780x390_rq1xub.jpg", password: expect.any(String), age: user1.age, phone_number: Number("083243545"), createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  });
  test('should return HTTP code 200 when put user success', async () => {
    const { body } = await request(app)
      .put('/users/1')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ age: 22 })
      .expect(200);
    expect(body[0]).toEqual({
      id: 1, full_name: user.full_name, email: user.email, username: user.username, profile_image_url: user.profile_image_url, password: expect.any(String), age: 22, phone_number: Number(user.phone_number), createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  });
  test('should return HTTP code 200 when put user success', async () => {
    const { body } = await request(app)
      .put('/users/1')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ email: "budimanaja@gmail.com" })
      .expect(200);
    expect(body[0]).toEqual({
      id: 1, full_name: user.full_name, email: "budimanaja1@gmail.com", username: user.username, profile_image_url: user.profile_image_url, password: expect.any(String), age: 22, phone_number: Number(user.phone_number), createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  });
  test('should return HTTP status code 404 when user not found', async () => {
    const { body } = await request(app)
      .put('/users/100')
      .set('Authorization', `Bearer ${userToken1}`)
      .send({ full_name: "Diory Pribadi Sinaga", username: "diorysinaga" })
      .expect(404);
    expect(body.message).toMatch(/data not found/i);
  });
  test('should return HTTP status code 401 when no authorization', async () => {
    const { body } = await request(app)
      .put('/users/1')
      .send({ full_name: "Diory Pribadi Sinaga", username: "diorysinaga" })
      .expect(401);
    expect(body.message).toMatch(/Unauthorized/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .put('/users/1')
      .set('Authorization', 'Bearer ')
      .send({ full_name: "Diory Pribadi Sinaga", username: "diorysinaga" })
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .put('/users')
      .set('Authorization', 'Bearer wrong.token.input')
      .send({ full_name: "Diory Pribadi Sinaga", username: "diorysinaga" })
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
});
