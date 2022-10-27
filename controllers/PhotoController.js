const { User, Photo, Comment } = require("./../models/index");

class PhotoController {
    static async getPhotos(req, res, next) {
        try {
            const { err = null } = req.body
            if (err === "Internal Server Error") throw { message: "Internal Server Error" }
            const result = await Photo.findAll({
                include: [
                    { model: User, attributes: ['id', 'username', 'profile_image_url'] },
                    {
                        model: Comment,
                        as: 'Comment',
                        attributes: ['comment'],
                        include: [{ model: User, attributes: ['id', 'username'] }]
                    }
                ],
                order: [['id', 'ASC']]
            });
            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }

    static async CreatePhoto(req, res, next) {
        try {
            const { poster_image_url, title, caption } = req.body
            const UserId = req.user.id
            const result = await Photo.create({ poster_image_url, title, caption, UserId }, { returning: true })
            res.status(201).json(result)
        } catch (err) {
            next(err)
        }
    }

    static async UpdatePhoto(req, res, next) {
        try {
            let { poster_image_url, title, caption } = req.body
            const { id } = req.params
            const UserId = req.user.id
            const photo = await Photo.findOne({ where: { id } })
            if (!photo) {
                throw { name: 'ErrNotFound' }
            }
            if (photo.UserId !== UserId) {
                throw { name: "not allowed" }
            }
            if (!poster_image_url) {
                poster_image_url = photo.poster_image_url;
            }
            if (!title) {
                title = photo.title
            }
            if (!caption) {
                caption = photo.caption
            }
            const result = await Photo.update({
                poster_image_url, title, caption
            }, { where: { id }, returning: true })
            res.status(200).json(result[1])
        } catch (err) {
            next(err)
        }
    }
    static async DeletePhoto(req, res, next) {
        try {
            const { id } = req.params
            const UserId = req.user.id
            const photo = await Photo.findOne({ where: { id } })
            if (!photo) {
                throw { name: 'ErrNotFound' }
            }
            if (photo.UserId !== UserId) {
                throw { name: "not allowed" }
            }
            await Photo.destroy(
                { where: { id } }
            )
            res.status(200).json({ message: "Your photo has been successfully deleted" })
        } catch (err) {
            next(err)
        }
    }

}

module.exports = PhotoController;
