import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect, assert} from "chai";
import { ethers } from "hardhat";

describe("SaveERC20", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySaveEther() {
    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2] = await ethers.getSigners();

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy(owner.address);
    const amountToDeposit = ethers.parseEther("5");

    return { saveERC20, owner, account1, account2, amountToDeposit };
  }

  it()
