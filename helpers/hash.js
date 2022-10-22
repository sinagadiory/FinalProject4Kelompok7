const bcrypt = require("bcryptjs");

const hash = (input) => {
	return bcrypt.hashSync(input, 10);
};

const compare = (input, hashed) => {
	return bcrypt.compareSync(input, hashed);
};

module.exports = {
	hash,
	compare,
};
