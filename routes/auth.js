import express from 'express';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.js'; // Правильный путь к модели

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password,name} = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "Пожалуйста, заполните все поля" });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: "Неверный формат email" });
        }


        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: "Пользователь с таким email уже существует" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ email, password: hashedPassword,name });
        await newAdmin.save();

        res.status(201).json({ message: 'Администратор зарегистрирован' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при регистрации администратора' });
    }
});

export default router;