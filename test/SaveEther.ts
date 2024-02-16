import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveERC20", function () {
  async function deploySaveERC20() {
    const [owner, account1, account2] = await ethers.getSigners();

    const Cov = await ethers.getContractFactory("Coval");
    const cov = await Cov.deploy();

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy(cov.getAddress());
   



    return { saveERC20, owner, cov };
  }

  describe("depositing into the contract", function () {
    it("should deposit tokens to the owner", async function () {
      const { saveERC20, owner, cov } = await loadFixture(
        deploySaveERC20
      );

      const savingToken = saveERC20
        const amountToDeposit = ethers.parseEther("1");

        // Approve SaveERC20 contract to transfer tokens
        const Token = await ethers.getContractAt("IERC20", savingToken);
        await cov.connect(owner).approve(saveERC20.getAddress(), amountToDeposit);

        // Deposit tokens into the contract
       await saveERC20.connect(owner).deposit(amountToDeposit);


        expect(await saveERC20.connect(owner).deposit(amountToDeposit)).to.revertedWith("cannot save zero value");

        // Check if the user's savings have increased
        const userBalance = await saveERC20.checkUserBalance(saveERC20.getAddress());
        expect(userBalance).to.equal(amountToDeposit);

        // // Check if the contract's balance matches the deposited amount
        const contractBalance = await saveERC20.checkContractBalance();
        expect(contractBalance).to.equal(userBalance);

    
     
    });

    it("should check user balance", async function(){
        const { saveERC20, owner, cov } = await loadFixture(
            deploySaveERC20
          );
        const balance = await saveERC20.checkUserBalance(owner);

        expect(balance).to.equal(0);
      });
    
  });
});
