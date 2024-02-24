const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const natural = require('natural'); // For text analysis

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const dbUrl = process.env.mongoUrl;

mongoose.connect(
  // 'mongodb://localhost:27017/textAnalyzer'
  dbUrl,
{
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

  // You can perform more complex analysis here based on your requirements

  const analysisResult = {
    wordsCount: words.length,
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

