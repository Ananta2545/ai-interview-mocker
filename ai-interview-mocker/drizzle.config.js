import { config } from "dotenv";
config({ path: ".env" });
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials:{
    url: process.env.DATABASE_URL ?? ""
  }
});