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
    phone_number: "812732322",
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
    phone_number: "812732322",
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
    

    // success
    test('should return HTTP status code 200', async () => {
        const { body } = await request(app)
          .get('/comments')
          .set('Authorization', `Bearer ${userToken1}`)
          .expect(200);
        // expect(body.length).toBe(2);
        expect(body).toEqual(
        { comments: [
            {
                id: 1,
                UserId: CommentTest1.UserId,
                PhotoId: CommentTest1.PhotoId,
                comment: CommentTest1.comment,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                User: {
                    id: 1,
                    username: user1.username,
                    profile_image_url: user1.profile_image_url,
                    phone_number: parseInt(user1.phone_number)
                },
                Photo: {
                    id: 1,
                    title: defaultPhoto1.title,
                    caption: defaultPhoto1.caption,
                    poster_image_url: defaultPhoto1.poster_image_url
                },
            },
            {
                id: 2,
                UserId: CommentTest2.UserId,
                PhotoId: CommentTest2.PhotoId,
                comment: CommentTest2.comment,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                User: {
                    id: 2,
                    username: user2.username,
                    profile_image_url: user2.profile_image_url,
                    phone_number: parseInt(user2.phone_number)
                },
                Photo: {
                    id: 2,
                    title: defaultPhoto2.title,
                    caption: defaultPhoto2.caption,
                    poster_image_url: defaultPhoto2.poster_image_url
                },
            }
        ]}
            
        );
    });

    // error
    test('should return HTTP status code 401 when no authorization', async () => {
        const { body } = await request(app)
          .get('/comments')
          .expect(401);
        expect(body.message).toMatch(/unauthorized/i);
    });
    test('should return HTTP status code 401 when no token provided', async () => {
        const { body } = await request(app)
          .get('/comments')
          .set('Authorization', 'Bearer ')
          .expect(401);
        expect(body.message).toMatch(/invalid token/i);
    });
    test('should return HTTP status code 401 when no token provided', async () => {
        const { body } = await request(app)
        .get('/comments')
        .set('Authorization', 'Bearer wrong.token.input')
        .expect(401);
        expect(body.message).toMatch(/invalid token/i);
    });
    test('should return HTTP status code 401 when user does not exist', async () => {
        const { body } = await request(app)
        .get('/comments')
        .set('Authorization', `Bearer ${userNotExistsToken}`)
        .expect(401);
        expect(body.message).toMatch(/unauthorized/i);
    });
    test('should return HTTP status code 404 when data does not exist', async () => {
        await queryInterface.bulkDelete('Comments', null, {
            truncate: true,
            restartIdentity: true,
            cascade: true
        });
        const { body } = await request(app)
        .get('/comments')
        .set('Authorization', `Bearer ${userToken1}`)
        .expect(404);
        expect(body.message).toMatch(/Data not found/i);
    });
});