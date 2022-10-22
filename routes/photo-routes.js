// const PhotosController = require("../controllers/photos-controller");


const router = require("express").Router();
const photoController=require("../controllers/PhotoController")

router.get("/",photoController.getPhotos );

router.post("/",photoController.CreatePhoto);

router.put("/:id",photoController.UpdatePhoto)

router.delete("/:id",photoController.DeletePhoto)

module.exports = router;
