const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  console.log('Listing available Gemini models...');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // List available models
    const models = await genAI.listModels();
    console.log('Available models:');
    
    for await (const model of models) {
      console.log(`- ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Description: ${model.description}`);
      console.log(`  Supported Generation Methods: ${model.supportedGenerationMethods?.join(', ') || 'Unknown'}`);
      console.log('---');
    }
    
  } catch (error) {
    console.error('❌ Failed to list models:', error.message);
  }
}

listModels();