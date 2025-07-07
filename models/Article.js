import pkg from 'mongoose';
const { Schema, model, models } = pkg;
const ArticleSchema = new Schema(
    {
        title : String,
        content : String,
        images : String,
        author : String,
            date: {
                    type: Date,
                    default: Date.now,
            },
        categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
        views : { type: Number, default: 0 },

    },
    { timestamps: true }
);


const Article = model('Article', ArticleSchema);
export default Article;