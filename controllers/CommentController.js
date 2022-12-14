
const { User,Photo,Comment } = require("./../models/index");

class CommentController {
    static async getComments(req, res, next) {
        try {
            const result = await Comment.findAll({
                    include:[
                        {model: User, attributes:['id','username','profile_image_url', 'phone_number']},
                        {model: Photo, attributes:['id','title','caption','poster_image_url']}
                    ]
                });
            if (result.length === 0) throw { name: 'ErrNotFound' };
            res.status(200).json({comments: result});
        } catch (err) {
            next(err);
        }
    }

    static async CreateComment(req,res,next){
        try{
            const { comment, PhotoId } = req.body;
            const UserId = req.user.id;
            const result = await Comment.create({ UserId, PhotoId, comment }, {returning:true});
            res.status(201).json(result);
        }catch (err) {
            next(err);
        }
    } 

    static async UpdateComment(req,res,next){
        try {
            const { id } = req.params;
            const { comment }= req.body;
            const userId = req.user.id;

            const commentById = await Comment.findOne({ where: { id } });

            if (!commentById) throw { name: 'ErrNotFound' };
            if (commentById.UserId !== userId) throw { name: 'not allowed' };
            
            const result = await Comment.update(
                { comment },
                { where: {id}, returning:true, plain:true }
            );

            res.status(201).json(result[1]);
        }catch (err){
            next(err)
        }
    }
    
    static async DeleteComment(req,res,next){
        try{
            const { id } = req.params;
            const userId = req.user.id;

            const commentById = await Comment.findOne({ where: { id } });

            if (!commentById) throw { name: 'ErrNotFound' };
            if (commentById.UserId !== userId) throw { name: 'not allowed' };

            const result = await Comment.destroy(
                { where: {id}, returning: true, plain: true }
            );

            res.status(200).json({ message:"Your Comment has been successfully deleted", data: commentById});
        }catch (err){
            next(err)
        }
    }

}

module.exports = CommentController;
