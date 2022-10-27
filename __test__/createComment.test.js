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

const defaultPhoto1 = {
  poster_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
  title: "Photo diory 1",
  caption: "Foto diory 1",
  createdAt: new Date(),
  updatedAt: new Date(),
  UserId: 1
};

const defaultComment1 = {
  comment: "Comment Teza 1",
  UserId: 1,
  PhotoId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const CommentTest = {
  comment: "Comment Teza 2",
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
});

afterAll(async () => {
  sequelize.close();
});

describe('POST /comments', () => {
  test('should return HTTP code 201 when created comment success', async () => {
    const { body } = await request(app)
      .post('/comments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ comment: CommentTest.comment, PhotoId: CommentTest.PhotoId })
      .expect(201);
    expect(body).toEqual({
      id: 2,
      comment: CommentTest.comment,
      PhotoId: CommentTest.PhotoId,
      UserId: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
  });

  // error Comment
  test('should return HTTP code 400 when comment without comment', async () => {
    const { body } = await request(app)
      .post('/comments')
      .send({ PhotoId: CommentTest.PhotoId })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Comment cannot be omitted']));
  });
  test('should return HTTP code 400 when comment with empty string comment', async () => {
    const { body } = await request(app)
      .post('/comments')
      .send({ comment: "", PhotoId: CommentTest.PhotoId })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Comment cannot be an empty string']));
  });

  // Error PhotoId
  test('should return HTTP code 400 when comment without PhotoId', async () => {
    const { body } = await request(app)
      .post('/comments')
      .send({ comment: CommentTest.comment })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['PhotoId cannot be omitted']));
  });
  test('should return HTTP code 400 when comment with empty string PhotoId', async () => {
    const { body } = await request(app)
      .post('/comments')
      .send({ comment: CommentTest.comment, PhotoId: "" })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['PhotoId cannot be an empty string']));
  });

  // Error Authorization
  test('should return HTTP status code 401 when no authorization', async () => {
    const { body } = await request(app)
      .post('/comments')
      .send({ comment: CommentTest.comment, PhotoId: CommentTest.PhotoId })
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .post('/comments')
      .send({ comment: CommentTest.comment, PhotoId: CommentTest.PhotoId })
      .set('Authorization', 'Bearer ')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when wrong token provided', async () => {
    const { body } = await request(app)
      .post('/comments')
      .send({ comment: CommentTest.comment, PhotoId: CommentTest.PhotoId })
      .set('Authorization', 'Bearer wrongToken')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when user does not exist', async () => {
    const { body } = await request(app)
      .post('/comments')
      .send({ comment: CommentTest.comment, PhotoId: CommentTest.PhotoId })
      .set('Authorization', `Bearer ${userNotExistsToken}`)
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
});
