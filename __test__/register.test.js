const request = require('supertest');
const app = require('./../app');
const { sequelize } = require("../models/index");
const { queryInterface } = sequelize;
const { hash } = require("../helpers/hash");

const user = {
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

const userTest = {
  full_name: "Diory Pribadi Sinaga",
  email: "diory@gmail.com",
  username: "diory",
  password: "Diory123?",
  profile_image_url: "https://res.cloudinary.com/dt3pzvmfg/image/upload/v1658573452/x1bbffnq1cold8srit8p.jpg",
  age: 21,
  phone_number: "0812732322"
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
});

afterAll(async () => {
  sequelize.close();
});

describe('POST /users/register', () => {
  test('should return HTTP code 201 when sign up success', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: userTest.email, username: userTest.username, password: userTest.password, profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: userTest.phone_number })
      .expect(201);
    expect(body).toEqual({ id: 2, full_name: userTest.full_name, email: userTest.email, password: expect.any(String), username: userTest.username, profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: Number(userTest.phone_number) });
  });
  test('should return HTTP code 400 when sign up without full_name', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ email: userTest.email, password: userTest.password, profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Full name cannot be omitted']));
  });
  test('should return HTTP code 400 when sign up with empty string full_name', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: "", email: userTest.email, username: userTest.username, password: userTest.password, profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Full name cannot be an empty string']));
  });
  test('should return HTTP code 400 when sign up without username', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: userTest.email, password: userTest.password, profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Username cannot be omitted']));
  });
  test('should return HTTP code 400 when sign up with empty string username', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: userTest.email, username: "", password: userTest.password, profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Username cannot be an empty string']));
  });
  test('should return HTTP code 400 when sign up without email', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, password: userTest.password, profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Email cannot be omitted']));
  });
  test('should return HTTP code 400 when sign up with empty string email', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: "", password: userTest.password, profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Email cannot be an empty string']));
  });
  test('should return HTTP code 400 when sign up with wrong format email', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: "wrongformatemail", password: userTest.password, profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Email format wrong']));
  });
  test('should return HTTP code 400 when sign up with already existed email', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: user.email, username: userTest.username, password: userTest.password, profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(["email must be unique"]));
  });
  test('should return HTTP code 400 when sign up without password', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ username: userTest.username, email: userTest.email })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Password cannot be omitted']));
  });
  test('should return HTTP code 400 when sign up with empty string password', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({
        full_name: userTest.full_name, email: userTest.email, username: userTest.username, password: "", profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: userTest.phone_number
      })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Password cannot be an empty string']));
  });
  test('should return HTTP code 400 when sign up with wrong format password', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({
        full_name: userTest.full_name, email: userTest.email, username: userTest.username, password: "diory", profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: userTest.phone_number
      })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Password minimum delapan karakter, setidaknya satu huruf besar, satu huruf kecil, satu angka dan satu karakter khusus']));
  });
  test('should return HTTP code 400 when sign up without profile_image_url', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: userTest.email, username: userTest.username, password: userTest.password, age: userTest.age, phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Profile image url cannot be omitted']));
  });
  test('should return HTTP code 400 when sign up with empty string profile_image_url', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: userTest.email, username: userTest.username, password: userTest.password, profile_image_url: "", age: userTest.age, phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Profile image url cannot be an empty string']));
  });
  test('should return HTTP code 400 when sign up with wrong format profile_image_url', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: userTest.email, username: userTest.username, password: userTest.password, profile_image_url: "http://wrongformaturl", age: userTest.age, phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Profile image url format is wrong']));
  });
  test('should return HTTP code 400 when sign up without age', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: userTest.email, username: userTest.username, password: userTest.password, profile_image_url: userTest.profile_image_url, phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Age cannot be omitted']));
  });
  test('should return HTTP code 400 when sign up with empty string age', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: userTest.email, username: userTest.username, password: userTest.password, profile_image_url: userTest.profile_image_url, age: "", phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Age cannot be an empty string']));
  });
  test('should return HTTP code 400 when sign up with wrong format age', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: userTest.email, username: userTest.username, password: userTest.password, profile_image_url: userTest.profile_image_url, age: "salah", phone_number: userTest.phone_number })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Age format must be numeric']));
  });
  test('should return HTTP code 400 when sign up without phone_number', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: userTest.email, username: userTest.username, password: userTest.password, profile_image_url: userTest.profile_image_url, age: userTest.age })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Phone number cannot be omitted']));
  });
  test('should return HTTP code 400 when sign up with empty string phone_number', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: userTest.email, username: userTest.username, password: userTest.password, profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: "" })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Phone number cannot be an empty string']));
  });
  test('should return HTTP code 400 when sign up with wrong format phone_number', async () => {
    const { body } = await request(app)
      .post('/users/register')
      .send({ full_name: userTest.full_name, email: userTest.email, username: userTest.username, password: userTest.password, profile_image_url: userTest.profile_image_url, age: userTest.age, phone_number: "salah" })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['Phone number format must be numeric']));
  });
});
