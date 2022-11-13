# Simple_metaverse
Simple 3D metaverse with property ownerships represented with NFTs. Built using three.js, react, solidity, hardhat, and ethers.js. Deployed to both local hardhat network and Goerli test network

## How to use
- Connect to the dapp with metamask and use either Local Hardhat or Goerli test network
- Click on the (orange) property you want to buy and press "Buy property". Confirm transaction with metamask
- Once the transaction is completed the 3D building will appear on the property and you will be the owner of it.

## Technologies
- Three.js
- Javascript
- NodeJS
- Solidity version ^0.8.4
- Ethers.js
- Hardhat
- IPFS
- React
- Metamask
- OpenZeppelin
- Chai for testing

## Requirements for the first Setup
- NodeJS
- Hardhat
- Metamask

## Setting up
- Clone repository
- Install dependencies with "npm install"
- Run "npm run hardhatNode"
- Add Hardhat network to Metamask and account from the list of accounts you get from "npm run hardhatNode"
- Run "npm run deploy" in another cmd
- Run "npm run start"
- Connect to the website using metamask and start using dapp

## Running tests
- To run test in cmd run "npx run test"
