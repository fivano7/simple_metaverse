const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Land", () => {

    let landInstance
    let owner1, owner2
    let result

    const name = "CROtaverse"
    const symbol = "CRO"
    const cost = ethers.utils.parseEther("1");

    beforeEach(async () => {

        [owner1, owner2] = await ethers.getSigners()

        const Land = await ethers.getContractFactory("Land")
        landInstance = await Land.deploy(name, symbol, cost)
    })

    describe("It deployed", () => {
        it("Gets the contract name", async () => {
            result = await landInstance.name()
            expect(name).to.be.equal(result)
        })

        it("Gets the contract symbol", async () => {
            result = await landInstance.symbol()
            expect(symbol).to.be.equal(result)
        })

        it("Gets the contract cost to mint", async () => {
            result = await landInstance.cost()
            expect(cost).to.be.equal(result)
        })

        it("Gets the max supply", async () => {
            result = await landInstance.maxSupply()
            expect("5").to.be.equal(result)
        })

        it("Gets the number of buildings and lands available", async () => {
            result = await landInstance.getBuildings()
            expect(5).to.be.equal(result.length)
        })
    })

    describe("Minting", () => {
        describe("Successfully minted", async () => {
            beforeEach(async () => {
                result = await landInstance.connect(owner1).mint(1, { value: cost })
            })

            it("Updates the owner address", async () => {
                expect(await landInstance.ownerOf(1)).to.be.equal(owner1.address);
            })

            it("Updates building details", async () => {
                result = await landInstance.getBuilding(1)
                expect(await result.owner).to.be.equal(owner1.address);
            })
        })

        describe("Failure", () => {
            it("prevents mint with 0 value", async () => {
                await expect(landInstance.connect(owner1).mint(1, { value: 0 })).to.be.reverted
            })

            it("prevents mint with invalid ID", async () => {
                await expect(landInstance.connect(owner1).mint(100, { value: cost })).to.be.reverted
            })

            it("prevents minting if already owned", async () => {
                await landInstance.connect(owner1).mint(1, { value: cost })
                await expect(landInstance.connect(owner1).mint(1, { value: cost })).to.be.reverted
            })
        })
    })

    describe('Transfers', () => {
        describe('success', () => {
            beforeEach(async () => {
                await landInstance.connect(owner1).mint(1, { value: cost })
                await landInstance.connect(owner1).approve(owner2.address, 1)
                await landInstance.connect(owner2).transferFrom(owner1.address, owner2.address, 1)
            })

            it("Updates the owner address", async () => {
                expect(await landInstance.ownerOf(1)).to.be.equal(owner2.address);
            })

        })

        describe("Failure", () => {
            it("Prevents transfers without ownership", async () => {
                await expect(landInstance.connect(owner2).transferFrom(owner1.address, owner2.address, 1)).to.be.reverted
            })

            it("Prevents transfers without approval", async () => {
                await landInstance.connect(owner1).mint(1, { value: cost })
                await expect(landInstance.connect(owner2).transferFrom(owner1.address, owner2.address, 1)).to.be.reverted
            })
        })
    })

})
