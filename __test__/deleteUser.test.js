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

describe('DELETE /users/:id', () => {
  test('should return HTTP code 403 when delete user forbiden', async () => {
    const { body } = await request(app)
      .delete('/users/1')
      .set('Authorization', `Bearer ${userToken1}`)
      .expect(403);
    expect(body.message).toMatch(/Anda Tidak Diijinkan!!/i)
  });
  test('should return HTTP code 200 when delete user success', async () => {
    const { body } = await request(app)
      .delete('/users/1')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(body.message).toMatch(/Your account has been successfully deleted/i)
  });
  test('should return HTTP status code 404 when user not found', async () => {
    const { body } = await request(app)
      .delete('/users/100')
      .set('Authorization', `Bearer ${userToken1}`)
      .expect(404);
    expect(body.message).toMatch(/data not found/i);
  });
  test('should return HTTP status code 401 when no authorization', async () => {
    const { body } = await request(app)
      .delete('/users/1')
      .expect(401);
    expect(body.message).toMatch(/Unauthorized/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .delete('/users')
      .set('Authorization', 'Bearer ')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .delete('/users')
      .set('Authorization', 'Bearer wrong.token.input')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 404 when PageNotFound', async () => {
    const { body } = await request(app)
      .delete('/userssa')
      .set('Authorization', `Bearer ${userToken1}`)
      .expect(404);
    expect(body.message).toMatch(/Oops... nothing here/i);
  });
});
