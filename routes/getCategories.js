import Category from "../models/Category.js";
import express from "express";
import mongoose from "mongoose";
import Article from "../models/Article.js";
const router = express.Router();
router.get('/getcategories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/categories/:slug', async (req, res) => {
    const { slug } = req.params;

    try {
        const cat = await Category.findOne({ slug })


        const articles = await Article.find({ categories: cat._id });
        const categories = await Category.find();


        res.json({
            cat,
            articles,
            categories
        });


    } catch (error) {

        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default router;