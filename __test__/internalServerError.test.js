const fs = require("fs")
const request = require('supertest');
const app = require('./../app');
const { sequelize } = require('./../models/index');
const { queryInterface } = sequelize;
const { hash } = require('./../helpers/hash');

const user = {
  full_name: "diory",
  email: "diory@gmail.com",
  username: "diory",
  password: "budiman123?",
  profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
  age: 21,
  phone_number: "0812732322",
  createdAt: new Date(),
  updatedAt: new Date()
}

beforeAll(async () => {
  fs.unlinkSync(".env")
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  const hashedUser = { ...user };
  hashedUser.password = hash(hashedUser.password);
  await queryInterface.bulkInsert('Users', [hashedUser]);
});


describe('GET /users', function () {
  it('response internal server error', function () {
    return request(app)
      .post('/users/login')
      .expect(500)
      .then(response => {
        expect(response.body.message).toMatch(/internal server error/i);
      })
  });
});

afterAll(async () => {
  sequelize.close();
  fs.writeFileSync(".env", "JWT_SECRET=f80sdufuf434lnnk")
});

