// scripts/setupAccounts.js
const { generateAndSaveKeyPair } = require('../utils/keyStoreUtils');

class AccountSetupScript {
  constructor(accountIds, network) {
    this.accountIds = accountIds;
    this.network = network;
  }

  async execute() {
    console.log(`Starting account setup for network: ${this.network}`);
    for (const accountId of this.accountIds) {
      try {
        await generateAndSaveKeyPair(accountId, this.network);
        console.log(`Setup complete for ${accountId}`);
      } catch (error) {
        console.error(`Error setting up account ${accountId}:`, error);
      }
    }
    console.log('Account setup completed successfully.');
  }
}

// Configuration
const accountIds = ['account1.testnet', 'account2.testnet']; // Example account IDs
const network = 'testnet';

// Execute setup script
const accountSetupScript = new AccountSetupScript(accountIds, network);
accountSetupScript.execute().catch(console.error);
