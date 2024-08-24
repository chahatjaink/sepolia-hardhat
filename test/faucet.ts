import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Faucet', function () {
  // Fixture to deploy contract and setup variables
  async function deployContractAndSetVariables() {
    // Deploy the Faucet contract
    const FaucetFactory = await ethers.getContractFactory('Faucet');
    const faucet = await FaucetFactory.deploy({ value: ethers.parseEther('1') }); // Deploy with initial funding
    await faucet.waitForDeployment();

    // Get the first signer
    const [owner, otherAccount] = await ethers.getSigners();

    console.log('Owner address:', owner.address);
    return { faucet, owner, otherAccount };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    // Verify the owner is correctly set
    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should not allow withdraw above the limit', async function () {
    const { faucet } = await loadFixture(deployContractAndSetVariables);

    // Attempt to withdraw more than the limit
    await expect(
      faucet.withdraw(ethers.parseEther('1'))
    ).to.be.revertedWith('Faucet: Withdraw amount exceeds the limit');
  });

  it('should allow owner to withdraw all funds', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    // Owner withdraws all funds
    await faucet.withdrawAll();
    const contractBalance = await ethers.provider.getBalance(faucet.target);

    // Verify the contract balance is zero
    expect(contractBalance).to.equal(0);
  });

  it('should not allow non-owner to withdraw all funds', async function () {
    const { faucet, otherAccount } = await loadFixture(deployContractAndSetVariables);

    // Attempt to call withdrawAll() from a non-owner account
    await expect(
      faucet.connect(otherAccount).withdrawAll()
    ).to.be.revertedWith('Faucet: Caller is not the owner');
  });
});
