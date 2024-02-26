if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const natural = require('natural');
const syllable = require('syllables');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Public')));


const dbUrl = process.env.mongoUrl;

mongoose.connect(
  // 'mongodb://localhost:27017/textAnalyzer'
  dbUrl)
.then(() => {
  console.log('MongoDB connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
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
  // const syllables = words.reduce((acc, word) => acc + natural.syllables(word), 0);
  const syllables = words.reduce((acc, word) => acc + syllable(word), 0);

  const analysisResult = {
    charactersWithSpaces: text.length,
    charactersWithoutSpaces: text.replace(/\s/g, '').length,
    wordsCount: words.length,
    sentencesCount: sentences.length,
    syllablesCount: syllables,
  };

  // Save analysis result to MongoDB
  const textAnalysis = new TextAnalysis({
    text,
    analysisResult,
  });

  await textAnalysis.save();

  res.json({ analysisResult });
});


app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'Public', 'index.html'))
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
