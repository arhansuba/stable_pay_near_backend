const { keyStores, KeyPair } = require('near-api-js');
const fs = require('fs');
const path = require('path');

const KEYS_DIR = path.resolve(process.env.KEYS_DIR || './near-credentials');

/**
 * Initialize a key store.
 * Note: For simplicity, this example uses UnencryptedFileSystemKeyStore. Use a more secure key store for production.
 */
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(KEYS_DIR);

/**
 * Load a key pair for a given account ID and network ID.
 */
async function loadKeyPair(accountId, networkId = 'default') {
  try {
    return await keyStore.getKey(networkId, accountId);
  } catch (error) {
    console.error('Failed to load key pair:', error);
    throw error;
  }
}

/**
 * Save a key pair for a given account ID and network ID.
 * @param {String} accountId - The NEAR account ID.
 * @param {String} networkId - The network ID (e.g., 'testnet', 'mainnet').
 * @param {KeyPair} keyPair - The key pair to save.
 */
async function saveKeyPair(accountId, networkId, keyPair) {
  try {
    await keyStore.setKey(networkId, accountId, keyPair);
    console.log(`Key pair saved for account ${accountId} on ${networkId}.`);
  } catch (error) {
    console.error('Failed to save key pair:', error);
    throw error;
  }
}

/**
 * Generate a new key pair and save it.
 * Useful for creating new accounts or changing keys.
 */
async function generateAndSaveKeyPair(accountId, networkId = 'default') {
  const newKeyPair = KeyPair.fromRandom('ed25519');
  await saveKeyPair(accountId, networkId, newKeyPair);
  return newKeyPair;
}

module.exports = {
  keyStore,
  loadKeyPair,
  saveKeyPair,
  generateAndSaveKeyPair,
};