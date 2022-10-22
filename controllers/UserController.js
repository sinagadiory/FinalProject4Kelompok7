const { User, Photo } = require("./../models/index");
const { compare } = require("./../helpers/hash");
const { sign } = require("./../helpers/jwt");

class UsersController {
	static async signIn(req, res, next) {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ where: { email } });

			if (!user) {
				throw { name: "UserNotFound" };
			} else if (!compare(password, user.password)) {
				throw { name: "WrongPassword" };
			}

			const token = sign({ id: user.id, email: user.email });
			res.status(200).json({ token });
		} catch (error) {
			next(error);
		}
	}

	static async FindAll(req, res) {
		const result = await User.findAll({
			order: [
				['id', 'ASC']]
		});
		res.json(result)
	}

	static async signUp(req, res, next) {
		const { full_name, email, username, password, profile_image_url, age, phone_number } = req.body;
		try {
			const user = await User.create({
				full_name, email, username, password, profile_image_url, age, phone_number
			}, { returning: true });
			res.status(201).json({
				id: user.id,
				full_name: user.full_name,
				email: user.email,
				username: user.username,
				password: user.password,
				profile_image_url: user.profile_image_url,
				age: user.age,
				phone_number: user.phone_number
			});
		} catch (error) {
			next(error)
		}
	}

	static async UpdateUser(req, res, next) {
		try {
			let { full_name, email, username, profile_image_url, age, phone_number } = req.body;
			const id = req.params.id
			const UserId = req.user.id
			const user = await User.findOne(
				{ where: { id } }
			)
			if (!user) {
				throw { name: "ErrNotFound" }
			}
			if (user.id !== UserId) {
				throw { name: "not allowed" }
			}
			if (!username) {
				username = user.username
			}
			if (!profile_image_url) {
				profile_image_url = user.profile_image_url;
			}
			if (!full_name) {
				full_name = user.full_name
			}
			if (!email) {
				email = user.email
			}
			if (!age) {
				age = user.age
			}
			if (!phone_number) {
				phone_number = user.phone_number
			}
			const result = await User.update({
				full_name, email, username, age, phone_number, profile_image_url
			}, { where: { id }, returning: true })
			// console.log(result[0]);
			// res.json(result[1])
			res.json(result[1])
		} catch (err) {
			next(err)
		}
	}

	static async DeleteUser(req, res, next) {
		try {
			const id = req.params.id
			const UserId = req.user.id
			const user = await User.findOne(
				{ where: { id } }
			)
			if (!user) {
				throw { name: "ErrNotFound" }
			}
			if (UserId !== user.id) {
				throw { name: "not allowed" }
			}
			await User.destroy({ where: { id } })
			res.json({ message: "Your account has been successfully deleted" })
		} catch (err) {
			next(err)
		}
	}
}
module.exports = UsersController;
