const router = require("express").Router();
const medsosController=require("../controllers/MedsosController")

router.get("/",medsosController.getMedsos );

router.post("/",medsosController.CreateMedsos);

router.put("/:id",medsosController.UpdateMedsos)

router.delete("/:id",medsosController.DeleteMedsos)

module.exports = router;
