const request = require('supertest');
const app = require('./../app');
const { sequelize } = require('./../models/index');
const { queryInterface } = sequelize;
const { hash } = require('./../helpers/hash');
const { sign } = require('../helpers/jwt');

const user = {
  full_name: "Ahmad Murteza Akbari",
  email: "ahmad@gmail.com",
  username: "ahmad",
  password: "Ahmad123?",
  profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
  age: 21,
  phone_number: "0812732322",
  createdAt: new Date(),
  updatedAt: new Date()
};

const userToken = sign({ id: 1, email: user.email });
const userNotExistsToken = sign({ id: 99, email: 'notexists@mail.com' })

// const defaultSocialMedia1 = {
//   id: 1,
//   name: "instagram",
//   social_media_url: "https://www.instagram.com/teza/",
//   UserId: 1,
//   createdAt: new Date(),
//   updatedAt: new Date()
// };

const sosmedTest = {
  name:  "FACEBOOK",
  social_media_url: "https://www.FACEBOOK.com/teza/"
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
  hashedUser.password = hash(hashedUser.password);

  await queryInterface.bulkInsert('Users', [hashedUser]);
  // await queryInterface.bulkInsert('Medsos', [defaultSocialMedia1]);
});

afterAll(async () => {
  sequelize.close();
});

describe('Post /socialmedias', () => {

  test('should return HTTP code 201 when created socialmedias success', async () => {
    const { body } = await request(app)
      .post('/socialmedias')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: sosmedTest.name, social_media_url: sosmedTest.social_media_url })
      .expect(201);
    expect(body).toEqual({
        id: 1,
        name: sosmedTest.name,
        social_media_url: sosmedTest.social_media_url,
        UserId: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
    });
  });

  // error Comment
  test('should return HTTP code 400 when socialmedias without name', async () => {
    const { body } = await request(app)
      .post('/socialmedias')
      .send({ social_media_url: sosmedTest.social_media_url })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['name cannot be omitted']));
  });
  test('should return HTTP code 400 when socialmedias with empty string name', async () => {
    const { body } = await request(app)
      .post('/socialmedias')
      .send({ name: "", social_media_url: sosmedTest.social_media_url })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['name cannot be an empty string']));
  });
  test('should return HTTP code 400 when socialmedias without url', async () => {
    const { body } = await request(app)
      .post('/socialmedias')
      .send({ name: sosmedTest.name })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Social media url cannot be omitted']));
  });
  test('should return HTTP code 400 when socialmedias with empty string url', async () => {
    const { body } = await request(app)
      .post('/socialmedias')
      .send({ name: sosmedTest.name, social_media_url: "" })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Social media url cannot be an empty string']));
  });
  test('should return HTTP code 400 when socialmedias with wrong url format', async () => {
    const { body } = await request(app)
      .post('/socialmedias')
      .send({ name: sosmedTest.name, social_media_url: 1 })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Social media url format is wrong']));
  });

  test('should return HTTP status code 401 when no authorization', async () => {
    const { body } = await request(app)
      .post('/socialmedias')
      .send({ name: sosmedTest.name, social_media_url: sosmedTest.social_media_url })
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .post('/socialmedias')
      .send({ name: sosmedTest.name, social_media_url: sosmedTest.social_media_url })
      .set('Authorization', 'Bearer ')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .post('/socialmedias')
      .send({ name: sosmedTest.name, social_media_url: sosmedTest.social_media_url })
      .set('Authorization', 'Bearer wrong.token.input')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when user does not exist', async () => {
    const { body } = await request(app)
      .post('/socialmedias')
      .send({ name: sosmedTest.name, social_media_url: sosmedTest.social_media_url })
      .set('Authorization', `Bearer ${userNotExistsToken}`)
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
});