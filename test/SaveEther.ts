import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveERC20", function () {
    async function deploySaveERC20Fixture() {
      const [owner, account1, account2] = await ethers.getSigners();
  
      // Assuming `Coval` is a mock ERC20 token for testing
      const Cov = await ethers.getContractFactory("Coval");
      const cov = await Cov.deploy();
  
      const SaveERC20 = await ethers.getContractFactory("SaveERC20");
      const saveERC20 = await SaveERC20.deploy(cov.target);
  
      // Transfer some tokens to account1 for testing
      // await mockERC20.transfer(account1.address, ethers.parseEther("100"));
  
      return { saveERC20, owner, cov, account1, account2 };
    }
  
    describe("depositing into the contract", function () {
      it("should deposit tokens successfully", async function () {
        const { owner,saveERC20, cov, account1 } = await loadFixture(deploySaveERC20Fixture);
  
        const amountToDeposit = ethers.parseEther("1");

        await cov.connect(owner).approve(saveERC20.target, amountToDeposit);
        await cov.connect(owner).transfer(account1.address, amountToDeposit);
        
        await cov.connect(account1).approve(saveERC20.target, amountToDeposit);

        await saveERC20.connect(account1).deposit(amountToDeposit);

        const checkBalance = await saveERC20.checkUserBalance(account1.address);

        expect(checkBalance).to.equal(amountToDeposit);
      });
  
      it("should check user balance correctly", async function() {
        const { saveERC20, account1,owner,cov } = await loadFixture(deploySaveERC20Fixture);
  
          const  amountToDeposit = ethers.parseEther("1");

          const initialBalance = await saveERC20.checkUserBalance(account1.address);

          expect(initialBalance).to.equal(0);

          await cov.connect(owner).approve(saveERC20.target, amountToDeposit);

          await cov.connect(owner).transfer(account1.address, amountToDeposit);

          await cov.connect(account1).approve(saveERC20.target, amountToDeposit);

          await saveERC20.connect(account1).deposit(amountToDeposit);

          const finalBalance  = await saveERC20.checkUserBalance(account1.address);

          expect(finalBalance).to.equal(amountToDeposit);
      
      });

      it("should check user balance correctly", async function() {
        const { saveERC20, account1} = await loadFixture(deploySaveERC20Fixture);
  
        const balance = await saveERC20.checkUserBalance(account1.address);

        expect(balance).to.equal(0);
      
    });
     it("should withdraw the token from the account",async function() {
      const{saveERC20, cov, owner , account1 } = await loadFixture(deploySaveERC20Fixture);

      const amountToDeposit = ethers.parseEther("1");

      await cov.connect(owner).approve(saveERC20.target,amountToDeposit);

      await cov.connect(owner).transfer(account1.address,amountToDeposit);

      await cov.connect(account1).approve(saveERC20.target,amountToDeposit);

      await saveERC20.connect(account1).deposit(amountToDeposit);

      const userBalance = await saveERC20.checkUserBalance(account1.address);
      
      expect(userBalance).to.equal(amountToDeposit);

       await saveERC20.connect(account1).withdraw(1);

      const finalTokenBalance = await cov.balanceOf(account1.address);
    
      // Assuming the initial balance of account1 was 0 before the test, it should now be back to amountToDeposit after withdrawal.
      expect(finalTokenBalance).to.equal(1);  

     });

     it("should not withdraw zero coval token ", async function () {
      const{saveERC20, account1 } = await loadFixture(deploySaveERC20Fixture);

      const amountToDeposit = ethers.parseEther("0");

      await expect(  saveERC20.connect(account1).withdraw(amountToDeposit)).to.be.revertedWith("can't withdraw zero value");

     });

     it("should check if the amount to send is greater than user amount", async function(){
       const {saveERC20, account1 , owner, cov} = await loadFixture(deploySaveERC20Fixture);

       const amountToDeposit = ethers.parseEther("1");

       await cov.connect(owner).approve(saveERC20.target,amountToDeposit);

      await cov.connect(owner).transfer(account1.address,amountToDeposit);

      await cov.connect(account1).approve(saveERC20.target,amountToDeposit);

      await saveERC20.connect(account1).deposit(amountToDeposit);

      const userBalance = await saveERC20.checkUserBalance(account1.address);
      
      expect(userBalance).to.equal(amountToDeposit);

      await expect(saveERC20.connect(account1).withdraw(ethers.parseEther("2")))
      .to.be.revertedWith("insufficient funds");




       

     });

  });
});