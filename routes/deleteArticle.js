import express from 'express';
import Article from '../models/Article.js';

const router = express.Router();


router.delete('/adminmenu/:id', async (req, res) => {
    const articleId = req.params.id;
    try {
        const deletedArticle = await Article.findByIdAndDelete(articleId);

        if (!deletedArticle) {
            return res.status(404).json({ message: 'Статья не найдена' });
        }

        res.status(200).json({ message: 'Статья успешно удалена' });
    } catch (error) {
        console.error('Ошибка при удалении статьи:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default router;