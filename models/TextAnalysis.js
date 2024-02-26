const mongoose = require('mongoose');

const textAnalysisSchema = new mongoose.Schema({
  text: String,
  // Add other fields for analysis results as needed
});

const TextAnalysis = mongoose.model('TextAnalysis', textAnalysisSchema);

module.exports = TextAnalysis;




