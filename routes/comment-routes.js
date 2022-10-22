// const PhotosController = require("../controllers/photos-controller");


const router = require("express").Router();
const CommentController=require("../controllers/CommentController")

router.get("/",CommentController.getComments);

router.post("/",CommentController.CreateComment);

router.put("/:id",CommentController.UpdateComment)

router.delete("/:id",CommentController.DeleteComment)

module.exports = router;
