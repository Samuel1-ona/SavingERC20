import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveERC20", function () {
  async function deploySaveERC20() {
    const [owner, account1, account2] = await ethers.getSigners();

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy(owner.address);
    const amountToDeposit = ethers.parseEther("100000");

    return { saveERC20, owner, account1, account2, amountToDeposit };
  }

  describe("Checking contract balance", function () {
    it("should withdraw tokens to the owner", async function () {
      const { saveERC20, owner, amountToDeposit } = await loadFixture(deploySaveERC20);

      it("should deposit tokens into the contract", async function () {
        const savingToken = "0x925c814D19000E9686eAd37B5dB3cf0815622C9E" 
        const amountToDeposit = ethers.parseEther("5");
        
        // Approve SaveERC20 contract to transfer tokens
        const Token = await ethers.getContractAt("IERC20", savingToken);
        await Token.approve(owner.address, amountToDeposit);
    
        // Deposit tokens into the contract
        await saveERC20.deposit(amountToDeposit);
    
        // Check if the user's savings have increased
        const userBalance = await saveERC20.checkUserBalance(owner.address);
        expect(userBalance).to.equal(amountToDeposit);
    
        // Check if the contract's balance matches the deposited amount
        const contractBalance = await saveERC20.checkContractBalance();
        expect(contractBalance).to.equal(amountToDeposit);
      });
    
    });
  });
});
