// src/controllers/AccountController.js
const BlockchainService = require('../services/blockchainService');

class AccountController {
  constructor(blockchainService) {
    this.blockchainService = blockchainService;
  }

  async createAccount(req, res) {
    try {
      const { accountId } = req.body;
      await this.blockchainService.createNewAccount(accountId);
      res.json({ message: 'Account created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create account' });
    }
  }
}

// Dependency injection for better testability and flexibility
const accountController = new AccountController(new BlockchainService());

module.exports = accountController;
