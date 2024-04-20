// blockchainConfig.js
const { connect, keyStores, WalletConnection } = require('near-api-js');
const path = require('path');
require('dotenv').config();

// Example configuration for multiple stablecoins
const tokenContracts = {
  mainnet: {
    USDC: process.env.USDC_MAINNET_CONTRACT,
    USDT: process.env.USDT_MAINNET_CONTRACT,
    TUSD: process.env.TUSD_MAINNET_CONTRACT,
    PAX: process.env.PAX_MAINNET_CONTRACT,
    // PayPal USD representation might not be directly available as a token.
    // This would require integration with PayPal's API or a custom solution.
  },
  testnet: {
    USDC: process.env.USDC_TESTNET_CONTRACT,
    USDT: process.env.USDT_TESTNET_CONTRACT,
    TUSD: process.env.TUSD_TESTNET_CONTRACT,
    PAX: process.env.PAX_TESTNET_CONTRACT,
  }
};

module.exports = {
  tokenContracts,
};


const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development';

const networkConfig = {
  mainnet: {
    networkId: 'mainnet',
    nodeUrl: 'https://rpc.mainnet.near.org',
    walletUrl: 'https://wallet.near.org',
    helperUrl: 'https://helper.mainnet.near.org',
    contracts: tokenContracts.mainnet,
  },
  testnet: {
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    contracts: tokenContracts.testnet,
  }
};

const config = isDevelopment ? networkConfig.testnet : networkConfig.mainnet;

async function initializeConnection() {
  // Ensure you use a more secure keystore for production!
  const keyStore = new keyStores.UnencryptedFileSystemKeyStore(path.join(__dirname, './near-credentials'));
  const near = await connect({ deps: { keyStore }, ...config });

  const wallet = new WalletConnection(near);
  return { near, wallet, contracts: config.contracts };
}

module.exports = { initializeConnection, config };