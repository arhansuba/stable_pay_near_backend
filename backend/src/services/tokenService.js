const { connect, Contract } = require('near-api-js');
const nearApi = require('near-api-js');
const config = require('../config/blockchainConfig');

class TokenService {
  constructor(account) {
    this.account = account;
  }

  async initContract(contractId) {
    return new Contract(this.account, contractId, {
      viewMethods: ['ft_balance_of'],
      changeMethods: ['ft_transfer'],
    });
  }

  async getBalance(contractId, accountId) {
    const contract = await this.initContract(contractId);
    return await contract.ft_balance_of({ account_id: accountId });
  }

  async transfer(contractId, receiverId, amount, memo = "Transfer via NEAR") {
    const contract = await this.initContract(contractId);
    return await contract.ft_transfer({
      receiver_id: receiverId,
      amount: amount.toString(),
      memo,
    });
  }
}

async function createTokenService(accountId) {
  const near = await connect({ ...config });
  const account = await near.account(accountId);
  return new TokenService(account);
}

module.exports = { createTokenService, TokenService };

// Function to send USDC tokens
exports.sendUSDC = async (senderAccountId, recipient, amount) => {
  const near = await connect({ ...config });
  const account = await near.account(senderAccountId);
  const usdcContract = new nearApi.Contract(account, config.usdcContractId, {
    viewMethods: ['balanceOf'],
    changeMethods: ['transfer'],
  });
  await usdcContract.transfer({
    receiver_id: recipient,
    amount: amount.toString(),
  });
};

