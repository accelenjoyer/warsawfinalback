import express from "express";
import Category from "../models/Category.js";
const router = express.Router();
router.post('/addcategory', async (req, res) => {
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
        }



        const existingCat = await Category.findOne({ name });
        if (existingCat) {
            return res.status(409).json({ message: "Категория уже существует" });
        }


        const newCat = new Category({ name });
        await newCat.save();

        res.status(201).json({ message: 'Категория зарегистрирована' });
    } catch (error) {
        console.error(error);

    }
});
export default router;