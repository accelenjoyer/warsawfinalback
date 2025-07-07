import mongoose from 'mongoose';
export const connectMongoDB = async () => {
    try {
        const mongoURL = process.env.MONGO_URL;
        if (!mongoURL) {
            throw new Error('MONGO_URL environment variable is not defined.');
        }
        console.log(process.env.MONGO_URL);
        await mongoose.connect(mongoURL);
        console.log("успех");
    }
    catch (error) {
        console.log("ошибка БД", error);
    }
};
