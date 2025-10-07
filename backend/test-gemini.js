const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
  console.log('Testing Gemini API connectivity...');
  console.log('API Key:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 20)}...` : 'NOT FOUND');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Let's try different model names
    console.log('Trying gemini-pro...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    console.log('✅ Gemini client initialized');
    
    const prompt = 'Hello, please respond with "Gemini is working correctly!" to test the connection.';
    console.log('Sending test prompt...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini response:', text);
    
  } catch (error) {
    console.error('❌ Gemini test failed:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
    }
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

testGemini();