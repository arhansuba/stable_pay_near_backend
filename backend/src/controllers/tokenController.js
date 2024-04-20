const TokenService = require('../services/tokenService');

const tokenService = new TokenService();

// Define a list of supported stablecoins
const supportedStablecoins = ['USDC', 'PAX', 'TUSD', 'USDT','PAYUSD'];

// Validate incoming transfer requests.
function isValidTransferRequest(req) {
  const { tokenType, recipient, amount } = req.body;
  return (
    supportedStablecoins.includes(tokenType) && // Check if the token type is supported
    recipient && 
    amount && 
    !isNaN(amount)
  );
}

// API endpoint for initiating a token transfer
exports.transferToken = async (req, res) => {
  try {
    // Validate request parameters
    if (!isValidTransferRequest(req)) {
      return res.status(400).json({ error: 'Invalid request parameters.' });
    }

    const { tokenType, recipient, amount } = req.body;

    // Initiate token transfer based on token type
    const transferResult = await tokenService.transfer(tokenType, recipient, amount);

    // Respond with success message and transfer details
    res.json({
      message: 'Transfer initiated successfully',
      details: transferResult,
    });
  } catch (error) {
    // Handle transfer errors
    console.error('Transfer Error:', error);
    if (error.response && error.response.status) {
      return res.status(error.response.status).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to initiate transfer.' });
  }
};
