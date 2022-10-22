const UsersController = require("./../controllers/UserController");
const router = require("express").Router();
const authentication=require("../middleware/authentication-middleware")

router.post("/login", UsersController.signIn);
router.post("/register", UsersController.signUp);
router.get('/all',authentication,UsersController.FindAll)

router.put("/:id",authentication,UsersController.UpdateUser)
router.delete("/:id",authentication,UsersController.DeleteUser)

module.exports = router;