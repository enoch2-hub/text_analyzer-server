const express = require('express');
const router = express.Router();

const TextAnalysis = require('../models/TextAnalysis');

// Text analysis logic
router.post('/analyze', async (req, res) => {
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



module.exports = router;