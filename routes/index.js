const router = require("express").Router();

const usersRouter = require("./users-router");
const photosRouter = require("./photo-routes");

const medsosRouter = require("./medsos-router");
const commentRouter = require("./comment-routes");

const errorMiddleware = require("./../middleware/error-middleware");
const authenticationMiddleware = require("./../middleware/authentication-middleware");

router.use("/users",usersRouter);

router.use(authenticationMiddleware);
router.use("/photos", photosRouter);
router.use("/medsos", medsosRouter);
router.use("/comments", commentRouter);

router.use((req, res, next) => {
	next({ name: "PageNotFound" });
});

router.use(errorMiddleware);

module.exports = router;
