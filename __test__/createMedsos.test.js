const request = require('supertest');
const app = require('./../app');
const { sequelize } = require('./../models/index');
const { queryInterface } = sequelize;
const { hash } = require('./../helpers/hash');
const { sign } = require('../helpers/jwt');

const user = {
  full_name: "Siti Sofiani",
  email: "sity.sofiani@gmail.com",
  username: "sofi",
  password: "Sofi1804!",
  profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
  age: 21,
  phone_number: "081578516877",
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

const defaultComment1 = {
  Medsos: "Instagram 1",
  Name: "Medsos 1",
  UserId: 1,
  PhotoId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const CommentTest = {
  Medsos: "Instagram 2",
  PhotoId: 1
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
  await queryInterface.bulkInsert('Comments', [defaultComment1]);
  await queryInterface.bulkInsert('Medsos', [defaultMedsos]);
});

afterAll(async () => {
  sequelize.close();
});

describe('POST /medsos', () => {
  test('should return HTTP code 201 when created comment success', async () => {
    const { body } = await request(app)
      .post('/comments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ medsoos: MedsosTest.medsos, PhotoId: CommentTest.PhotoId })
      .expect(201);
    expect(body).toEqual({
      id: 2,
      Medsos: MedsosTest.medsos,
      name: NameTest.name,
      PhotoId: CommentTest.PhotoId,
      UserId: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
  });

  // error
  test('should return HTTP code 400 when medsos without medsos', async () => {
    const { body } = await request(app)
      .post('/medsos')
      .send({ PhotoId: MedsosTest.PhotoId })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Medsos cannot be omitted']));
  });
  test('should return HTTP code 400 when medsos with empty string medsos', async () => {
    const { body } = await request(app)
      .post('/medsos')
      .send({ medsos: "", PhotoId: MedsosTest.PhotoId })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Medsos cannot be an empty string']));
  });

  // Error PhotoId
  test('should return HTTP code 400 when medsos without PhotoId', async () => {
    const { body } = await request(app)
      .post('/medsos ')
      .send({ medsos : MedsosTest.medsos })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['PhotoId cannot be omitted']));
  });
  test('should return HTTP code 400 when medsos  with empty string PhotoId', async () => {
    const { body } = await request(app)
      .post('/medsos ')
      .send({ medsos : MedsosTest.medsos , PhotoId: "" })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['PhotoId cannot be an empty string']));
  });
  test('should return HTTP code 400 when medsos with empty string PhotoId', async () => {
    const { body } = await request(app)
      .post('/medsos')
      .send({ medsos: MedsosTest.medsos, PhotoId: 100 })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toMatch(/Data does not exists/i);
  });
  test('should return HTTP status code 401 when no authorization', async () => {
    const { body } = await request(app)
      .post('/medsos')
      .send({ medsos: MedsosTest.medsos, PhotoId: MedsosTest.PhotoId })
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .post('/medsos')
      .send({ medsos: MedsosTest.medsos, PhotoId: MedsosTest.PhotoId })
      .set('Authorization', 'Bearer ')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when wrong token provided', async () => {
    const { body } = await request(app)
      .post('/medsos')
      .send({ medsos: MedsosTest.medsos, PhotoId: MedsosTest.PhotoId })
      .set('Authorization', 'Bearer wrongToken')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when user does not exist', async () => {
    const { body } = await request(app)
      .post('/medsos')
      .send({ medsos: MedsosTest.medsos, PhotoId: MedsosTest.PhotoId })
      .set('Authorization', `Bearer ${userNotExistsToken}`)
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
});