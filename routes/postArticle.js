import express from "express";
import Article from "../models/Article.js";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const router = express.Router();

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Только изображения разрешены!'), false);
        }
    }
});

// Получение всех статей
router.get('/adminmenu', async (req, res) => {
    try {
        const articles = await Article.find()
            .populate('categories').lean()

        res.status(200).json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при получении новостей' });
    }
});

// Создание новой статьи
router.post('/adminmenu', async (req, res) => {
    try {
        const { title, rawContent, author, categories, images } = req.body;

        if (!title || !rawContent || !categories || !images) {
            return res.status(400).json({ message: 'Заполните все обязательные поля' });
        }

        const newArticle = new Article({
            title,
            rawContent,
            author: author || 'Автор по умолчанию',
            categories,
            images,
        });

        await newArticle.save();

        res.status(201).json({
            message: 'Новость успешно создана',
            article: newArticle,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ошибка при создании новости',
            error: error.message,
        });
    }
});
router.put('/adminmenu/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, rawContent, author, categories, images } = req.body;

        // Проверяем, что обязательные поля заполнены
        if (!title || !rawContent || !categories || !images) {
            return res.status(400).json({ message: 'Заполните все обязательные поля' });
        }

        // Ищем статью по ID и обновляем её
        const updatedArticle = await Article.findByIdAndUpdate(
            id,
            {
                title,
                rawContent,
                author: author || 'Автор по умолчанию',
                categories,
                images,
                updatedAt: Date.now() // Добавляем дату обновления
            },
            { new: true } // Возвращаем обновлённый документ
        );

        if (!updatedArticle) {
            return res.status(404).json({ message: 'Статья не найдена' });
        }

        res.status(200).json({
            message: 'Статья успешно обновлена',
            article: updatedArticle,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ошибка при обновлении статьи',
            error: error.message,
        });
    }
});

// Получение одной статьи
router.get('/adminmenu/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('categories');

        if (!article) {
            return res.status(404).json({ message: 'Новость не найдена' });
        }

        res.status(200).json(article);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка при получении новости' });
    }
});

// Обновление статьи
router.put('/adminmenu/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, rawContent, author, categories } = req.body;
        const articleId = req.params.id;

        const updateData = {
            title,
            rawContent: JSON.parse(rawContent),
            author,
            categories: JSON.parse(categories)
        };

        // Обработка нового изображения
        if (req.file) {
            updateData.images = `/uploads/${req.file.filename}`;

            // Удаляем старое изображение
            const oldArticle = await Article.findById(articleId);
            if (oldArticle.images) {
                const oldImagePath = path.join('public', oldArticle.images);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const updatedArticle = await Article.findByIdAndUpdate(
            articleId,
            updateData,
            { new: true }
        ).populate('categories');

        res.status(200).json({
            message: 'Новость успешно обновлена',
            article: updatedArticle
        });
    } catch (error) {
        console.error(error);

        // Удаляем загруженное изображение в случае ошибки
        if (req.file) {
            fs.unlinkSync(path.join('public', req.file.path));
        }

        res.status(500).json({
            message: 'Ошибка при обновлении новости',
            error: error.message
        });
    }
});



export default router;