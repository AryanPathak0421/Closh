import "dotenv/config";
import mongoose from "mongoose";
import { Product } from "./src/models/Product.model.js";

const runPrint = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const prod = await Product.findById("6a0abdec1e712ad944deee86").lean();
    if (!prod) {
      console.log("Product not found");
      process.exit(0);
    }

    console.log("Product Name:", prod.name);
    console.log("Variants field structure:");
    console.log(JSON.stringify(prod.variants, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Print script failed:", error);
    process.exit(1);
  }
};

runPrint();
