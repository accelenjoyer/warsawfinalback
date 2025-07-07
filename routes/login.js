import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: "Неверный email или пароль" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Неверный email или пароль" });
        }


        res.status(200).json({ message: 'Успешный вход', email,password,name:admin.name });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при входе' });
    }
});

export default router;