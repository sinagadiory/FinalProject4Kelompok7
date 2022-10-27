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
const userNotExistsToken = sign({ id: 99, email: 'notexists@mail.com' });

const defaultPhoto1 = {
  poster_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
  title: "Photo sinaga 4",
  caption: "Foto sinaga 4",
  createdAt: new Date(),
  updatedAt: new Date(),
  UserId: 1
};
const defaultPhoto2 = {
  poster_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
  title: "Photo sinaga 4",
  caption: "Foto sinaga 4",
  createdAt: new Date(),
  updatedAt: new Date(),
  UserId: 2
};

const comment = {
  UserId: 2,
  PhotoId: 1,
  comment: "Photonya keren dari budiman",
  updatedAt: "2022-10-22T05:06:23.292Z",
  createdAt: "2022-10-22T05:06:23.292Z"
}

beforeAll(async () => {
  await queryInterface.bulkDelete('Photos', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  await queryInterface.bulkDelete('Comments', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  const hashedUser = { ...user };
  const hashedUser1 = { ...user1 }
  hashedUser.password = hash(hashedUser.password);
  hashedUser1.password = hash(hashedUser1.password);
  await queryInterface.bulkInsert('Users', [hashedUser, hashedUser1]);
  await queryInterface.bulkInsert('Photos', [defaultPhoto1, defaultPhoto2]);
  await queryInterface.bulkInsert('Comments', [comment]);
});

afterAll(async () => {
  sequelize.close();
});

describe('GET /photos', () => {
  test('should return HTTP status code 200', async () => {
    const { body } = await request(app)
      .get('/photos')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(body.length).toBe(2);
    expect(body).toEqual([{
      id: 1,
      title: defaultPhoto1.title,
      caption: defaultPhoto1.caption,
      poster_image_url: defaultPhoto1.poster_image_url,
      UserId: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      User: {
        id: 1,
        username: user.username,
        profile_image_url: user.profile_image_url
      },
      Comment: [{
        comment: "Photonya keren dari budiman",
        User: {
          id: 2,
          username: "budiman"
        }
      },]
    }, {
      id: 2,
      title: defaultPhoto1.title,
      caption: defaultPhoto1.caption,
      poster_image_url: defaultPhoto1.poster_image_url,
      UserId: 2,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      User: {
        id: 2,
        username: user1.username,
        profile_image_url: user1.profile_image_url
      },
      Comment: []
    }]);
  });
  test('should return HTTP status code 401 when no authorization', async () => {
    const { body } = await request(app)
      .get('/photos')
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .get('/photos')
      .set('Authorization', 'Bearer ')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .get('/photos')
      .set('Authorization', 'Bearer wrong.token.input')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when user does not exist', async () => {
    const { body } = await request(app)
      .get('/photos')
      .set('Authorization', `Bearer ${userNotExistsToken}`)
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
  test('should return HTTP status code 500', async () => {
    const { body } = await request(app)
      .get('/photos')
      .send({ err: "Internal Server Error" })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(500);
    expect(body.message).toMatch(/Internal Server Error/i)
  })
});

