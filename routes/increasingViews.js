import Article from "../models/Article.js";
import express from 'express';

const router = express.Router();


router.post('/news/:id', async (req, res) => {
    try {
        const articleId = req.params.id;

        const updatedArticle = await Article.findByIdAndUpdate(
            articleId,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!updatedArticle) {
            return res.status(404).json({ message: "Статья не найдена" });
        }

        return res.json(updatedArticle);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
});

export default router;