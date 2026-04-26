import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";

// কাজ শুরু করার আগেই .env ফাইলটি ফোর্স করে লোড করে নিচ্ছি
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // এখন আর env() ফাংশনের দরকার নেই, সরাসরি process.env ব্যবহার করছি
    url: process.env.DATABASE_URL as string,
  },
});