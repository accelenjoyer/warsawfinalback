import pkg from 'mongoose';
const { Schema, model, models } = pkg;
const AdminSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name : { type: String, required: true },
    },
    { timestamps: true }
);


const Admin = model('Admin', AdminSchema);
export default Admin;