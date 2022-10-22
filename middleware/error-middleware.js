function errorMiddleware(err, req, res, next) {
	let code;
	let message;

	if (err.name === "JsonWebTokenError") {
		code = 401;
		message = "Invalid token";
	} else if (err.name === "InvalidToken") {
		code = 401;
		message = "Invalid token";
	} else if (err.name === "Unauthorized" || err.name === 'NoAuthorization') {
		code = 401;
		message = "Unauthorized";
	} else if (err.name === "ErrNotFound") {
		code = 404;
		message = "Data not found";
	} else if (err.name === "SequelizeValidationError") {
		code = 400;
		message = err.errors.map((err) => {
			return err.message;
		});
	} else if (err.name === "SequelizeForeignKeyConstraintError") {
		code = 400;
		message = "User does not exists";
	} else if (err.name === "UserNotFound" || err.name === "WrongPassword") {
		code = 401;
		message = "Email or Password is wrong";
	} else if (err.name === "SequelizeUniqueConstraintError") {
		code = 400;
		message = err.errors.map((err) => {
			return err.message;
		});
	} else if (err.name === "not allowed") {
		code = 403
		message = "Anda Tidak Diijinkan!!"
	} else if (err.name === "PageNotFound") {
		code = 404;
		message = "Oops... nothing here";
	} else {
		code = 500;
		message = "Internal server error";
	}

	return res.status(code).json({ message });
}

module.exports = errorMiddleware;
