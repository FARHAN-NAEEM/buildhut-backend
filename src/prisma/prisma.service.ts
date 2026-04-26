import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config(); // নিশ্চিত করবে যেন .env ফাইলটি ঠিকমতো লোড হয়

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Prisma 7 এর নতুন নিয়ম অনুযায়ী Adapter ব্যবহার করে কানেকশন তৈরি
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    
    super({ adapter });
  }

  async onModuleInit() {
    // NestJS চালু হওয়ার সময় ডাটাবেসের সাথে কানেক্ট করবে
    await this.$connect();
  }

  async onModuleDestroy() {
    // NestJS বন্ধ হওয়ার সময় ডাটাবেস কানেকশন ডিসকানেক্ট করবে
    await this.$disconnect();
  }
}