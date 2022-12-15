const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models/index');
const { queryInterface } = sequelize;
const { hash } = require('../helpers/hash');
const { sign } = require('../helpers/jwt');

const user1 = {
    full_name: "Ahmad Murteza Akbari",
    email: "murteza@gmail.com",
    username: "murteza",
    password: "murteza123?",
    profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
    age: 21,
    phone_number: "0812732322",
    createdAt: new Date(),
    updatedAt: new Date()
};

const user2 = {
    full_name: "dhani",
    email: "dhani@gmail.com",
    username: "dhani",
    password: "dhani123?",
    profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
    age: 21,
    phone_number: "0812732322",
    createdAt: new Date(),
    updatedAt: new Date()
}

const userToken1 = sign({ id: 1, email: user1.email });
const userToken2 = sign({ id: 2, email: user2.email });
const userNotExistsToken = sign({ id: 99, email: 'notexists@mail.com' });

const defaultSocialMedia1 = {
  id: 1,
  name: "instagram",
  social_media_url: "https://www.instagram.com/teza/",
  UserId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

const defaultSocialMedia2 = {
    id: 2,
    name: "facebook",
    social_media_url: "https://www.facebook.com/teza/",
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
    const hashedUser1 = { ...user1 };
    const hashedUser2 = { ...user2 }
    hashedUser1.password = hash(hashedUser1.password);
    hashedUser2.password = hash(hashedUser2.password);
    await queryInterface.bulkInsert('Users', [hashedUser1, hashedUser2]);
    await queryInterface.bulkInsert('Medsos', [defaultSocialMedia1, defaultSocialMedia2]);
});
  
afterAll(async () => {
    sequelize.close();
});

describe('DELETE /socialmedias/:id', () => {
    // error
    test('should return HTTP code 403 when delete socialmedias forbiden', async () => {
        const { body } = await request(app)
          .delete('/socialmedias/1')
          .set('Authorization', `Bearer ${userToken2}`)
          .expect(403);
        expect(body.message).toMatch(/Anda Tidak Diijinkan!!/i)
    });
    test('should return HTTP status code 404 when comment not found', async () => {
        const { body } = await request(app)
          .delete('/socialmedias/100')
          .set('Authorization', `Bearer ${userToken1}`)
          .expect(404);
        expect(body.message).toMatch(/data not found/i);
    });
    test('should return HTTP status code 401 when no authorization', async () => {
        const { body } = await request(app)
          .delete('/socialmedias/1')
          .expect(401);
        expect(body.message).toMatch(/unauthorized/i);
    });
    test('should return HTTP status code 401 when no token provided', async () => {
        const { body } = await request(app)
          .delete('/socialmedias/1')
          .set('Authorization', 'Bearer ')
          .expect(401);
        expect(body.message).toMatch(/invalid token/i);
    });
    test('should return HTTP status code 401 when no token provided', async () => {
        const { body } = await request(app)
          .delete('/socialmedias/1')
          .set('Authorization', 'Bearer wrong.token.input')
          .expect(401);
        expect(body.message).toMatch(/invalid token/i);
    });
    test('should return HTTP status code 401 when user does not exist', async () => {
        const { body } = await request(app)
          .delete('/socialmedias/1')
          .set('Authorization', `Bearer ${userNotExistsToken}`)
          .expect(401);
        expect(body.message).toMatch(/unauthorized/i);
    });

    // success
    test('should return HTTP status code 200', async () => {
        const { body } = await request(app)
          .delete('/socialmedias/2')
          .set('Authorization', `Bearer ${userToken2}`)
          .expect(200);
        expect(body.message).toMatch(/successfully deleted/i)
    });
});