import pkg from 'mongoose';
import slugify from "slugify";
const { Schema, model, models } = pkg;
const CategorySchema = new Schema(
     {
         name: {
             type: String,
             required: true,
             unique: true,
             trim: true
         },
         slug: {
             type: String,
             required: true,
             unique: true,
             lowercase: true,
         }
     }
);
    CategorySchema.pre('validate', function(next) {
        this.slug = slugify(this.name, { lower: true, remove: /[*+~.()'"!:@]/g });
    next();
});


const Category = model('Category', CategorySchema);
export default Category;