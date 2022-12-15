const request = require('supertest');
const app = require('./../app');
const { sequelize } = require('./../models/index');
const { queryInterface } = sequelize;
const { hash } = require('./../helpers/hash');
const { sign } = require('../helpers/jwt');


const user = {
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
const user1 = {
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
const userToken = sign({ id: 1, email: user.email });
const userToken1 = sign({ id: 2, email: user1.email });
const userNotExistsToken = sign({ id: 99, email: 'notexists@mail.com' });

const defaultSocialMedia1 = {
  id: 1,
  name: "instagram",
  social_media_url: "https://www.instagram.com/diorypribadi_sinaga/",
  UserId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};
const defaultSocialMedia2 = {
  id: 2,
  name: "facebook",
  social_media_url: "https://www.facebook.com/diory.sinaga",
  UserId: 2,
  createdAt: new Date(),
  updatedAt: new Date()
};


beforeAll(async () => {
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  await queryInterface.bulkDelete('Medsos', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  const hashedUser = { ...user };
  const hashedUser1 = { ...user1 }
  hashedUser.password = hash(hashedUser.password);
  hashedUser1.password = hash(hashedUser1.password);
  await queryInterface.bulkInsert('Users', [hashedUser, hashedUser1]);
  await queryInterface.bulkInsert('Medsos', [defaultSocialMedia1, defaultSocialMedia2]);
});

afterAll(async () => {
  sequelize.close();
});


describe('PUT /socialmedias/:id', () => {
  test('should return HTTP code 403 when put social media forbiden', async () => {
    const { body } = await request(app)
      .put('/socialmedias/1')
      .send({
        name: "twitter",
        social_media_url: "https://twitter.com/sinaga_diory",
      })
      .set('Authorization', `Bearer ${userToken1}`)
      .expect(403);
    expect(body.message).toMatch(/Anda Tidak Diijinkan!!/i)
  });
  test('should return HTTP status code 200', async () => {
    const { body } = await request(app)
      .put('/socialmedias/1')
      .send({
        name: "twitter",
        social_media_url: "https://twitter.com/sinaga_diory",
      })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(body).toEqual({
      social_media: [{
        id: 1,
        name: "twitter",
        social_media_url: "https://twitter.com/sinaga_diory",
        UserId: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }]
    })
  });
  test('should return HTTP status code 404 when social media not found', async () => {
    const { body } = await request(app)
      .put('/socialmedias/100')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: "twitter",
        social_media_url: "https://twitter.com/sinaga_diory",
      })
      .expect(404);
    expect(body.message).toMatch(/data not found/i);
  });
  test('should return HTTP status code 401 when no authorization', async () => {
    const { body } = await request(app)
      .put('/socialmedias/1')
      .send({
        name: "twitter",
        social_media_url: "https://twitter.com/sinaga_diory",
      })
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .put('/socialmedias/1')
      .set('Authorization', 'Bearer ')
      .send({
        name: "twitter",
        social_media_url: "https://twitter.com/sinaga_diory",
      })
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .put('/socialmedias/1')
      .send({
        name: "twitter",
        social_media_url: "https://twitter.com/sinaga_diory",
      })
      .set('Authorization', 'Bearer wrong.token.input')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when user does not exist', async () => {
    const { body } = await request(app)
      .put('/socialmedias/1')
      .send({
        name: "twitter",
        social_media_url: "https://twitter.com/sinaga_diory",
      })
      .set('Authorization', `Bearer ${userNotExistsToken}`)
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
});