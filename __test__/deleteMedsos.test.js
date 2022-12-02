const request = require('supertest');
const app = require('./../app');
const { sequelize } = require('./../models/index');
const { queryInterface } = sequelize;
const { hash } = require('./../helpers/hash');
const { sign } = require('../helpers/jwt');

const user1 = {
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

const user2 = {
    full_name: "hamidah",
    email: "hamida@gmail.com",
    username: "mida",
    password: "mida123?",
    profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
    age: 21,
    phone_number: "083847297176",
    createdAt: new Date(),
    updatedAt: new Date()
}

const userToken1 = sign({ id: 1, email: user1.email });
const userToken2 = sign({ id: 2, email: user2.email });
const userNotExistsToken = sign({ id: 99, email: 'notexists@mail.com' });

const defaultPhoto1 = {
    poster_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
    title: "Photo teza 4",
    caption: "Foto teza 4",
    createdAt: new Date(),
    updatedAt: new Date(),
    UserId: 1
  };

const defaultPhoto2 = {
    poster_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
    title: "Photo teza 4",
    caption: "Foto teza 4",
    createdAt: new Date(),
    updatedAt: new Date(),
    UserId: 2
};

const MedsosTest1 = {
    Medsos: "Instagram",
    Name: "Medsos 2",
    UserId: 2,
    PhotoId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
};

const MedsosTest2 = {
    Medsos: "Instagram",
    Name: "Medsos 2",
    UserId: 2,
    PhotoId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
};

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
    await queryInterface.bulkInsert('Photos', [defaultPhoto1, defaultPhoto2]);
    await queryInterface.bulkInsert('Comments', [CommentTest1, CommentTest2]);
    await queryInterface.bulkInsert('Medsos', [MedsosTest1, MedsosTest2]);
});
  
afterAll(async () => {
    sequelize.close();
});

describe('DELETE /medsos/:id', () => {
    // error
    test('should return HTTP code 403 when delete medsos forbiden', async () => {
        const { body } = await request(app)
          .delete('/medsos/1')
          .set('Authorization', `Bearer ${userToken2}`)
          .expect(403);
        expect(body.message).toMatch(/Anda Tidak Diijinkan!!/i)
    });
    test('should return HTTP status code 404 when medsos not found', async () => {
        const { body } = await request(app)
          .delete('/medsos/100')
          .set('Authorization', `Bearer ${userToken1}`)
          .expect(404);
        expect(body.message).toMatch(/data not found/i);
    });
    test('should return HTTP status code 401 when no authorization', async () => {
        const { body } = await request(app)
          .delete('/medsos/1')
          .expect(401);
        expect(body.message).toMatch(/unauthorized/i);
    });
    test('should return HTTP status code 401 when no token provided', async () => {
        const { body } = await request(app)
          .delete('/medsos/1')
          .set('Authorization', 'Bearer ')
          .expect(401);
        expect(body.message).toMatch(/invalid token/i);
    });
    test('should return HTTP status code 401 when no token provided', async () => {
        const { body } = await request(app)
          .delete('/medsos/1')
          .set('Authorization', 'Bearer wrong.token.input')
          .expect(401);
        expect(body.message).toMatch(/invalid token/i);
    });
    test('should return HTTP status code 401 when user does not exist', async () => {
        const { body } = await request(app)
          .delete('/medsos/1')
          .set('Authorization', `Bearer ${userNotExistsToken}`)
          .expect(401);
        expect(body.message).toMatch(/unauthorized/i);
    });

    // success
    test('should return HTTP status code 200', async () => {
        const { body } = await request(app)
          .delete('/medsos/2')
          .set('Authorization', `Bearer ${userToken2}`)
          .expect(200);
        expect(body.message).toMatch(/Your Medsos has been successfully deleted/i)
    });

    test('should return HTTP status code 200 And medsos has deleted', async () => {
        const { body } = await request(app)
            .delete('/medsos/1')
            .set('Authorization', `Bearer ${userToken1}`)
            .expect(200);
    expect(body).toEqual(
        {
        message: expect.any(String),
        data: {
            id: 1,
            Name: MedsosTest1.Name,
            UserId: MedsosTest1.UserId,
            PhotoId: MedsosTest1.PhotoId,
            medsos: MedsosTest1.MedsosTest1,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        }
        });
    });
});