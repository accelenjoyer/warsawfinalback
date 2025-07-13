import pkg from 'mongoose';
const { Schema, model, models } = pkg;

const ArticleSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Заголовок обязателен'],
            maxlength: [120, 'Заголовок не должен превышать 120 символов']
        },
        content: {
            type: String,
            required: [true, 'Содержание обязательно']
        },
        rawContent: {  // Добавляем поле для хранения оригинального JSON от Editor.js
            type: Schema.Types.Mixed,
            required: true
        },
        images: {
            type: String,
            validate: {
                validator: function(v) {
                    return v === null || v.startsWith('http') || v.startsWith('data:image');
                },
                message: props => `${props.value} не является валидным URL изображения`
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
ArticleSchema.pre('save', function(next) {
    if (this.isModified('rawContent')) {
        // Преобразуем rawContent в HTML для основного content
        this.content = this.editorJsToHtml(this.rawContent);
    }
    next();
});

// Метод для преобразования Editor.js JSON в HTML
ArticleSchema.methods.editorJsToHtml = function(editorJsData) {
    if (!editorJsData) return '';

    try {
        const data = typeof editorJsData === 'string'
            ? JSON.parse(editorJsData)
            : editorJsData;

        if (!data.blocks) return '';

        return data.blocks.map(block => {
            switch (block.type) {
                case 'paragraph': return `<p>${block.data.text}</p>`;
                case 'header': return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                case 'image': return `<img src="${block.data.file.url}" class="editorjs-image" alt="${block.data.caption || ''}">`;
                case 'list':
                    const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
                    return `<${tag}>${block.data.items.map(item => `<li>${item}</li>`).join('')}</${tag}>`;
                case 'quote': return `<blockquote>${block.data.text}</blockquote>`;
                case 'code': return `<pre><code>${block.data.code}</code></pre>`;
                default: return '';
            }
        }).join('');
    } catch (error) {
        console.error('Ошибка преобразования Editor.js:', error);
        return '';
    }
};

// Статический метод для поиска по категории
ArticleSchema.statics.findByCategory = function(categoryId) {
    return this.find({ categories: categoryId }).populate('categories');
};

const Article = models.Article || model('Article', ArticleSchema);
export default Article;