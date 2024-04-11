'use client'
import React, { useState } from 'react';
import axios from 'axios';

const TranslationComponent = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [formality, setFormality] = useState('more');
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    try {
      const response = await axios.post('/api/translate', {
        text,
        language,
        formality
      });
      console.log(response.data)
      setTranslatedText(response.data);
      setError('');
    } catch (error) {
      console.error('Error translating:', error);
      setError('Error translating text. Please try again.');
    }
  };

  return (
    <div className='center'>
      <div>
        <label htmlFor="text">Enter text to translate:</label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="language">Select language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="de">German</option>
          <option value="en-GB">English</option>
          <option value="fr">French</option>
          {/* Add more languages here */}
        </select>
      </div>
      <div>
        <label htmlFor="formality">Select formality:</label>
        <select
          id="formality"
          value={formality}
          onChange={(e) => setFormality(e.target.value)}
        >
          <option value="more">More formal</option>
          <option value="less">Less formal</option>
        </select>
      </div>
      <button onClick={handleTranslate}>Translate</button>
      {error && <p>{error}</p>}
      {translatedText && <p>Translated text: {translatedText}</p>}
    </div>
  );
};

export default TranslationComponent;
