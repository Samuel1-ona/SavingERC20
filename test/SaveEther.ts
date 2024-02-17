import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveERC20", function () {
    async function deploySaveERC20Fixture() {
      const [owner, account1, account2] = await ethers.getSigners();
  
      // Assuming `Coval` is a mock ERC20 token for testing
      const MockERC20 = await ethers.getContractFactory("Coval");
      const mockERC20 = await MockERC20.deploy();
  
      const SaveERC20 = await ethers.getContractFactory("SaveERC20");
      const saveERC20 = await SaveERC20.deploy(mockERC20.target);
  
      // Transfer some tokens to account1 for testing
      await mockERC20.transfer(account1.address, ethers.parseEther("100"));
  
      return { saveERC20, owner, mockERC20, account1, account2 };
    }
  
    describe("depositing into the contract", function () {
      it("should deposit tokens successfully", async function () {
        const { saveERC20, mockERC20, account1 } = await loadFixture(deploySaveERC20Fixture);
  
        const amountToDeposit = ethers.parseEther("1");
  
        // Account1 approves SaveERC20 contract to transfer their tokens
        await mockERC20.connect(account1).approve(saveERC20.target, amountToDeposit);
  
        // Account1 deposits tokens into the SaveERC20 contract
        await saveERC20.connect(account1).deposit(amountToDeposit);
  
        // Check if the user's savings have increased
        const userBalance = await saveERC20.checkUserBalance(account1.address);
        expect(userBalance).to.equal(amountToDeposit);
  
        // Check if the contract's balance matches the deposited amount
        const contractBalance = await mockERC20.balanceOf(saveERC20.target);
        expect(contractBalance).to.equal(amountToDeposit);
      });
  
      it("should check user balance correctly", async function() {
        const { saveERC20, account1,owner,mockERC20 } = await loadFixture(deploySaveERC20Fixture);
  
        // Initially, the balance should be 0
        const initialBalance = await saveERC20.checkUserBalance(account1.address);
        expect(initialBalance).to.equal(0);
  
        // After depositing 1 token
        const amountToDeposit = ethers.parseEther("1");
        await mockERC20.connect(owner).approve(account1.address, amountToDeposit);
        await saveERC20.connect(account1).deposit(amountToDeposit);
  
        // The balance should now be 1
        const balanceAfterDeposit = await saveERC20.checkUserBalance(account1.address);
        expect(balanceAfterDeposit).to.equal(amountToDeposit);
      });

      it("should check user balance correctly", async function() {
        const { saveERC20, account1} = await loadFixture(deploySaveERC20Fixture);
  
        const balance = await saveERC20.checkUserBalance(account1.address);

        expect(balance).to.equal(0);
      
    });
  });
});