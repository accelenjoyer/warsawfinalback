import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import articleRoutes from "./routes/postArticle.js"
import articlesFilterRoutes from "./routes/articlesFilter.js";
import deleteArticleRoutes from "./routes/deleteArticle.js";
import loginRoutes from "./routes/login.js"
import categoryRoutes from "./routes/addCategory.js"
import getCategoriesRoutes from "./routes/getCategories.js";
import findArticleRoutes from "./routes/findArticle.js"
import increasingViewsRoutes from "./routes/increasingViews.js";
import Article from './models/Article.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: true // Разрешить все домены
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/auth', authRoutes);
app.use("/api", articleRoutes)
app.use("/api", articlesFilterRoutes);
app.use("/api",deleteArticleRoutes);
app.use("/auth",loginRoutes);
app.use("/api",categoryRoutes);
app.use("/api",getCategoriesRoutes);
app.use("/api",findArticleRoutes);
app.use("/api",increasingViewsRoutes);
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected');
        setInterval(removeDuplicates, 5 * 60 * 1000);
        
        // Первый запуск через 10 секунд после старта
        setTimeout(removeDuplicates, 10000);
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
})();
async function removeDuplicates() {
    try {
        const duplicates = await Article.aggregate([
            {
                $group: {
                    _id: "$title",
                    count: { $sum: 1 },
                    ids: { $push: "$_id" }
                }
            },
            {
                $match: {
                    count: { $gt: 1 }
                }
            }
        ]);

        let deletedCount = 0;
        
        for (const group of duplicates) {
            const idsToDelete = group.ids.slice(1);
            const result = await Article.deleteMany({ _id: { $in: idsToDelete } });
            deletedCount += result.deletedCount;
        }

        if (deletedCount > 0) {
            console.log(`[${new Date().toLocaleTimeString()}] Удалено ${deletedCount} дубликатов статей`);
        }
        
    } catch (error) {
        console.error('Ошибка при удалении дубликатов:', error);
    }
}