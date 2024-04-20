const { connect, WalletConnection, Contract, utils } = require('near-api-js');
const { config } = require('../config/blockchainConfig');
const { generateAndSaveKeyPair, loadKeyPair } = require('../utils/keyStoreUtils');

class BlockchainService {
  async createNewAccount(accountId) {
    // Generate and save a key pair for the new account
    const keyPair = await generateAndSaveKeyPair(accountId, 'testnet');
    // Additional logic to create the account on the blockchain
  }

  async sendTokens(fromAccountId, toAccountId, amount) {
    // Load the sender's key pair
    const keyPair = await loadKeyPair(fromAccountId, 'testnet');
    // Logic to sign and send a transaction
  }
}
// Function to initialize a NEAR connection and wallet
async function initNear() {
  const near = await connect({
    ...config,
    deps: { keyStore: new utils.keyStores.InMemoryKeyStore() },
  });

  const walletConnection = new WalletConnection(near);
  return { near, walletConnection };
}

// Function to interact with a generic NEP-141 token contract
exports.callTokenContractMethod = async (contractId, methodName, args, attachedDeposit = "0") => {
  const { walletConnection } = await initNear();
  const account = walletConnection.account();

  const contract = new Contract(account, contractId, {
    viewMethods: ['ft_balance_of'],
    changeMethods: ['ft_transfer', 'ft_transfer_call'], // Common NEP-141 methods
  });

  try {
    const gas = "100000000000000"; // Adjust based on method requirements
    const result = await contract[methodName]({ ...args }, gas, attachedDeposit);
    return result;
  } catch (error) {
    console.error(`Error calling token contract method ${methodName}:`, error);
    throw error;
  }
};

// Function to transfer NEP-141 tokens like USDC
exports.transferToken = async (contractId, receiverId, amount) => {
  return this.callTokenContractMethod(contractId, 'ft_transfer', {
    receiver_id: receiverId,
    amount: amount,
    memo: 'Optional transfer memo',
  });
};

// Function to send NEAR tokens
exports.sendNearTokens = async (receiverId, amountInNear) => {
  const { walletConnection } = await initNear();
  const account = walletConnection.account();

  try {
    const amountInYoctoNear = utils.format.parseNearAmount(amountInNear.toString());
    const result = await account.sendMoney(receiverId, amountInYoctoNear);
    return result;
  } catch (error) {
    console.error('Error sending NEAR tokens:', error);
    throw error;
  }
};
