import express from 'express';
import Article from '../models/Article.js';
import Category from "../models/Category.js";

const router = express.Router();


router.get('/articles/category/:categoryName', async (req, res) => {
    try {
        const categoryName = req.params.categoryName;


        const category = await Category.findOne({ name: categoryName });
        if (!category) {
            return res.status(404).json({ message: 'Категория не найдена' });
        }


        const articles = await Article.find({ categories: category._id }).populate('categories');

        if (!articles || articles.length === 0) {
            return res.status(404).json({ message: 'Статьи не найдены для данной категории' });
        }

        res.status(200).json(articles);
    } catch (error) {
        console.error('Ошибка при фильтрации статей по категории:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default router;