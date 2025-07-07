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
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
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

        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
})();