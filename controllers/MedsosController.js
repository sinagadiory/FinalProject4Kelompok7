const {User,Photo,Medsos}= require("./../models/index");

class MedsosController {
	static async getMedsos(req, res) {
        try{
            const result=await Medsos.findAll({include:[
                {model: User,attributes:['id','username','profile_image_url']}
            ], 
            order:[['id','ASC']]});
            res.status(200).json(result)
        }catch (error){
            next(error);
        }
    }

    static async CreateMedsos(req,res,next){
        try{
            const {name, social_media_url}=req.body
            const UserId=req.user.id
            const result=await Medsos.create({name, social_media_url, UserId},{returning:true})
            res.status(201).json(result)
        }catch (err) {
            next(err)
        }
    }

	static async UpdateMedsos(req, res, next) {
		try {
			const {name, social_media_url}=req.body
			const id=req.params.id
			const UserId=req.user.id
			const medsos = await Medsos.findOne(
				{where: {id}}
			)
			if(!medsos){
				throw {name:"ErrNotFound"}
			}
			if (medsos.UserId !== UserId) {
				throw {name: "not allowed"}
			}
			
			const result = await Medsos.update({
				name, social_media_url
			}, {where: {id},returning:true})
			res.json(result[1])
		} catch (err) {
			console.log(err)
			next(err)
		}
	}

	static async DeleteMedsos(req,res,next){
		try{
			const id=req.params.id
			const UserId=req.user.id
			const medsos = await Medsos.findOne(
				{where: {id}}
			)
			if(!medsos){
				throw {name:"ErrNotFound"}
			}
			if (medsos.UserId !== UserId) {
				throw {name: "not allowed"}
			}
			await Medsos.destroy({where:{id}})
			res.json({message:"successfully deleted"})
		}catch (err) {
			next(err)
		}
	}
}
module.exports = MedsosController;