const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  ingredients: { type: [String], required: true },
  steps: { type: [String], required: true },
  cookingTime: { type: Number },
  servings: { type: Number },
  cuisineType: { type: String },
  difficulty: { type: String },
  image: String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
