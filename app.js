const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const natural = require('natural');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/textAnalyzer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const TextAnalysis = require('./models/TextAnalysis');

// Text analysis logic
app.post('/analyze', async (req, res) => {
  const { text } = req.body;

  // Simple example using natural library
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text);
  const sentences = text.split(/[.!?]+/).filter(Boolean);

  // Count syllables using natural library
  const syllables = words.reduce((acc, word) => acc + natural.syllables(word), 0);

  const analysisResult = {
    charactersWithSpaces: text.length,
    charactersWithoutSpaces: text.replace(/\s/g, '').length,
    wordsCount: words.length,
    sentencesCount: sentences.length,
    syllablesCount: syllables,
    // Add other analysis results as needed
  };

  // Save analysis result to MongoDB
  const textAnalysis = new TextAnalysis({
    text,
    analysisResult,
  });

  await textAnalysis.save();

  res.json({ analysisResult });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
