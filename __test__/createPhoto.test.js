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
const userToken = sign({ id: 1, email: user.email });
const userNotExistsToken = sign({ id: 99, email: 'notexists@mail.com' })

const defaultPhoto1 = {
  poster_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
  title: "Photo diory 1",
  caption: "Foto diory 1",
  createdAt: new Date(),
  updatedAt: new Date(),
  UserId: 1
};

const PhotoTest = {
  poster_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
  title: "Photo diory 2",
  caption: "Foto diory 2"
};
beforeAll(async () => {
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  const hashedUser = { ...user };
  hashedUser.password = hash(hashedUser.password);
  await queryInterface.bulkInsert('Users', [hashedUser]);
  await queryInterface.bulkInsert('Photos', [defaultPhoto1]);
});

afterAll(async () => {
  sequelize.close();
});

describe('POST /photos', () => {
  test('should return HTTP code 201 when created photo success', async () => {
    const { body } = await request(app)
      .post('/photos')
      .send({ poster_image_url: PhotoTest.poster_image_url, title: PhotoTest.title, caption: PhotoTest.caption })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201);
    expect(body).toEqual({
      id: 2,
      poster_image_url: PhotoTest.poster_image_url,
      caption: PhotoTest.caption,
      title: PhotoTest.title,
      UserId: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
  });
  test('should return HTTP code 400 when post without title', async () => {
    const { body } = await request(app)
      .post('/photos')
      .send({ poster_image_url: PhotoTest.poster_image_url, caption: PhotoTest.caption })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Title cannot be omitted']))
  });
  test('should return HTTP code 400 when post with empty string title', async () => {
    const { body } = await request(app)
      .post('/photos')
      .send({ poster_image_url: PhotoTest.poster_image_url, title: "", caption: PhotoTest.caption })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Title cannot be an empty string']))
  });
  test('should return HTTP code 400 when post without image URL', async () => {
    const { body } = await request(app)
      .post('/photos')
      .send({ title: PhotoTest.title, caption: PhotoTest.caption })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Poster image url cannot be omitted']))
  });
  test('should return HTTP code 400 when post with empty image URL', async () => {
    const { body } = await request(app)
      .post('/photos')
      .send({ poster_image_url: "", title: PhotoTest.title, caption: PhotoTest.caption })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Poster image url cannot be an empty string']))
  });
  test('should return HTTP code 400 when post with wrong  image URL format', async () => {
    const { body } = await request(app)
      .post('/photos')
      .send({ poster_image_url: "wrongformaturl", title: PhotoTest.title, caption: PhotoTest.caption })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(["Poster image url format is wrong"]))
  });
  test('should return HTTP status code 401 when no authorization', async () => {
    const { body } = await request(app)
      .post('/photos')
      .send({ poster_image_url: PhotoTest.poster_image_url, title: PhotoTest.title, caption: PhotoTest.caption })
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .post('/photos')
      .send({ poster_image_url: PhotoTest.poster_image_url, title: PhotoTest.title, caption: PhotoTest.caption })
      .set('Authorization', 'Bearer ')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .post('/photos')
      .send({ poster_image_url: PhotoTest.poster_image_url, title: PhotoTest.title, caption: PhotoTest.caption })
      .set('Authorization', 'Bearer wrong.token.input')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when user does not exist', async () => {
    const { body } = await request(app)
      .post('/photos')
      .send({ poster_image_url: PhotoTest.poster_image_url, title: PhotoTest.title, caption: PhotoTest.caption })
      .set('Authorization', `Bearer ${userNotExistsToken}`)
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
});
