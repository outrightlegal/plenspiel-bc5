import connectDB from "../../db";
import jwt from "jsonwebtoken";

import Book from "../../models/Book";

import authMiddleware from "@/middleware/authMiddleware";

connectDB();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Check if the user is authenticated
      await authMiddleware(req, res);

      const books = await Book.find({ user: req.user._id });

      if (!books) {
        return res.status(404).json({ message: "No books found" });
      }

      res.status(200).json({ books });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error });
    }
  } else {
    // Return an error response for unsupported HTTP methods
    res.status(405).json({ message: "Method not allowed" });
  }
}
