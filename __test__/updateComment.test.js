const request = require('supertest');
const app = require('./../app');
const { sequelize } = require('./../models/index');
const { queryInterface } = sequelize;
const { hash } = require('./../helpers/hash');
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

const CommentTest1 = {
    comment: "Comment Teza 1",
    UserId: 1,
    PhotoId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
};

const CommentTest2 = {
    comment: "Comment Teza 2",
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
    await queryInterface.bulkDelete('Comments', null, {
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
});
  
afterAll(async () => {
    sequelize.close();
});

describe('PUT /comments/:id', () => {
    // error
    test('should return HTTP code 403 when put comment forbiden', async () => {
        const { body } = await request(app)
          .put('/comments/2')
          .send({
            "title": "Foto Sinaga 1"
          })
          .set('Authorization', `Bearer ${userToken1}`)
          .expect(403);
        expect(body.message).toMatch(/Anda Tidak Diijinkan!!/i)
    });
});