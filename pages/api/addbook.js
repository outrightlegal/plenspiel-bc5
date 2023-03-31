import connectDB from "../../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import CryptoJS from "crypto-js";
import Web3 from "web3";
const Tx = require("ethereumjs-tx").Transaction;

import Book from "../../models/Book";

import authMiddleware from "@/middleware/authMiddleware";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
    ],
    name: "addHash",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "hash",
        type: "string",
      },
    ],
    name: "hashExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Check if the user is authenticated
      await authMiddleware(req, res);

      // Get the book details from the request body
      const {
        bookTitle,
        bookEdition,
        authorName,
        dob,
        isbn,
        country,
        yop,
        publisher,
        website,
      } = req.body;

      // Create a hash of the book data
      const hash = CryptoJS.SHA256(JSON.stringify(req.body)).toString();

      // Connect to the blockchain
      const web3 = new Web3(process.env.BLOCKCHAIN_URL);

      // Set the account information
      let privateKey;
      if (process.env.PRIVATE_KEY.startsWith("0x")) {
        privateKey = Buffer.from(process.env.PRIVATE_KEY.substring(2), "hex");
      } else {
        privateKey = Buffer.from(process.env.PRIVATE_KEY, "hex");
      }
      const account = process.env.ACCOUNT;

      const contractAddress = process.env.CONTRACT_ADDRESS;
      const contract = new web3.eth.Contract(ABI, contractAddress);

      // Check if the book hash already exists on the blockchain
      const exists = await contract.methods.hashExists(hash).call();

      if (exists) {
        return res
          .status(400)
          .json({ message: "Book already exists with this information" });
      }

      // Adjust the gas price to a desired amount (in Gwei)
      const desiredGasPriceInGwei = 50;

      // Create the transaction object
      const functionAbi = contract.methods.addHash(hash).encodeABI();
      const txCount = await web3.eth.getTransactionCount(account);
      const txObject = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(1000000),
        gasPrice: desiredGasPriceInGwei,
        to: contractAddress,
        data: functionAbi,
      };

      // Get the current gas price from the Ethereum network
      const gasPrice = await web3.eth.getGasPrice();

      // Convert the gas price to Gwei
      const gasPriceInGwei = web3.utils.fromWei(gasPrice, "gwei");
      const gasPriceHex = "0x" + Number(gasPrice).toString(16);

      if (Number(gasPriceInGwei) < desiredGasPriceInGwei) {
        // If the current gas price is lower than the desired gas price, use the desired gas price
        txObject.gasPrice = web3.utils.toHex(
          web3.utils.toWei(desiredGasPriceInGwei.toString(), "gwei")
        );
      } else {
        // Otherwise, use the current gas price
        txObject.gasPrice = gasPriceHex;
      }

      // Sign the transaction
      const tx = new Tx(txObject, { chain: "goerli" });
      tx.sign(privateKey);

      const successfulTransaction = async (
        bookTitle,
        bookEdition,
        authorName,
        dob,
        isbn,
        country,
        yop,
        publisher,
        website,
        user,
        res,
        receipt
      ) => {
        // Create a new book object
        const book = new Book({
          bookTitle,
          bookEdition,
          authorName,
          dob,
          isbn,
          country,
          yop,
          publisher,
          website,
          hash: hash,
          user: user, // Set the user ID to the logged in user
          txReceipt: receipt, // Add the transaction receipt to the book object
        });

        // Save the book to the database
        await book.save();

        return res.status(201).json({
          message: "Book registered successfully on the blockchain",
          txReceipt: receipt,
        });
      };

      // Send the transaction
      const serializedTx = tx.serialize();
      const rawTx = "0x" + serializedTx.toString("hex");
      await web3.eth
        .sendSignedTransaction(rawTx)
        .on("receipt", (receipt) =>
          successfulTransaction(
            bookTitle,
            bookEdition,
            authorName,
            dob,
            isbn,
            country,
            yop,
            publisher,
            website,
            req.user._id,
            res,
            receipt
          )
        )
        .on("error", console.error);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error });
    }
  } else {
    // Return an error response for unsupported HTTP methods
    res.status(405).json({ message: "Method not allowed" });
  }
}
