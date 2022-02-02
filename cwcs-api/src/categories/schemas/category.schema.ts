import * as mongoose from 'mongoose'

export const CategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true , unique: true, min: 1, max: 20 }
})