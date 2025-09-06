import pkg from 'mongoose';
const { Schema, model, models } = pkg;

const ArticleSchema = new Schema(
    {
        date: {
            type: Date,
            default: Date.now
        },
        title: {
            type: String,
            required: [true, 'Заголовок обязателен'],

        },
        content: {
            type: String,
            required : true

        },
        rawContent: {  // Добавляем поле для хранения оригинального JSON от Editor.js
            type: Schema.Types.Mixed,
            required: false
        },
        images: {
            type: String,
            default: '',
            validate: {
                validator: function(v) {
                    return v === null || v === '' || v.startsWith('http') || v.startsWith('data:image') || v.startsWith('/uploads/');
                },
                message: "Проблема с image"
            }
        },
        author: {
            type: String,
            required: true,
            default: 'Автор по умолчанию'
        },
        categories: [{
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Хотя бы одна категория должна быть указана']
        }],
        views: {
            type: Number,
            default: 0,
            min: 0
        },
        isPublished: {  // Добавляем флаг публикации
            type: Boolean,
            default: false
        },
        seoDescription: String  // Для SEO-оптимизации
    },

    {
        timestamps: true,
        toJSON: { virtuals: true },  // Для виртуальных полей
        toObject: { virtuals: true }
    }
);

// Виртуальное поле для форматированной даты
ArticleSchema.virtual('formattedDate').get(function() {
    return this.date.toLocaleDateString('ru-RU');
});

// Middleware для обработки контента перед сохранением


// Метод для преобразования Editor.js JSON в HTML

// Статический метод для поиска по категории
ArticleSchema.statics.findByCategory = function(categoryId) {
    return this.find({ categories: categoryId }).populate('categories');
};

const Article = models.Article || model('Article', ArticleSchema);
export default Article;