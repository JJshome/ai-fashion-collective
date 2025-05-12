// Server configuration

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/ai-fashion-collective',
  jwtSecret: process.env.JWT_SECRET || 'ai-fashion-secret-key',
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL || 'http://localhost:5000/api',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  blockchainConfig: {
    network: process.env.BLOCKCHAIN_NETWORK || 'rinkeby',
    apiKey: process.env.BLOCKCHAIN_API_KEY || 'your-blockchain-api-key'
  }
};
