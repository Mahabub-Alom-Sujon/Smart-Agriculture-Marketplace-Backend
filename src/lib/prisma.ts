import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

// import { PrismaPg } from "@prisma/adapter-pg";
// import "dotenv/config";
// import { PrismaClient } from "../../generated/prisma/client";
// import { extendedPrisma } from './auditLog.extension'; // ইমপোর্ট সবার উপরে নিয়ে আসা হয়েছে
//
// const connectionString = `${process.env.DATABASE_URL}`;
// const adapter = new PrismaPg({ connectionString });
// const prisma = new PrismaClient({ adapter });
//
// // যদি আপনি অডিট লগ এক্সটেনশনসহ প্রিজমা ক্লায়েন্ট ব্যবহার করতে চান:
// export { extendedPrisma as prisma };
//
// // অথবা যদি সাধারণ প্রিজমা ক্লায়েন্ট এক্সপোর্ট করতে চান:
// // export { prisma };