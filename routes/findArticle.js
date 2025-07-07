import Article from "../models/Article.js";
import express from 'express';
import mongoose from "mongoose";
const router = express.Router();
router.get('/news/search', async (req, res) => {
    const searchQuery = req.query.query;

    try {
        const regex = new RegExp(searchQuery, 'i');
        const articles = await Article.find({
            $or: [
                { title: { $regex: regex } },

            ]
        })
            .limit(6)
            .populate('categories');

        res.status(200).json(articles);
    } catch (error) {
        console.error('Ошибка при поиске статей:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});
router.get('/news/:id', async (req, res) => {
    const articleId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        return res.status(400).json({ message: 'Неверный ID статьи' });
    }

    try {
        const article = await Article.findById(articleId).populate('categories');

        if (!article) {
            return res.status(404).json({ message: 'Статья не найдена' });
        }

        res.status(200).json(article);
    } catch (error) {
        console.error('Ошибка при получении статьи:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default router;