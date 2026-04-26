DO $$ BEGIN
  ALTER TYPE "ProductStatus" ADD VALUE IF NOT EXISTS 'INACTIVE';
EXCEPTION
  WHEN undefined_object THEN
    CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT', 'ARCHIVED');
END $$;

DO $$ BEGIN
  CREATE TYPE "CategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "StockStatus" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK', 'UPCOMING', 'PRE_ORDER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BranchAvailabilityStatus" AS ENUM ('AVAILABLE', 'OUT_OF_STOCK', 'READY_STOCK', 'PRE_ORDER', 'UPCOMING');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "categories"
  ADD COLUMN IF NOT EXISTS "image" TEXT,
  ADD COLUMN IF NOT EXISTS "level" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "status" "CategoryStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "seoTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;

ALTER TABLE "products"
  ADD COLUMN IF NOT EXISTS "sku" TEXT,
  ADD COLUMN IF NOT EXISTS "productBadge" TEXT,
  ADD COLUMN IF NOT EXISTS "fullDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "warranty" TEXT,
  ADD COLUMN IF NOT EXISTS "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "specialPrice" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "regularPrice" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "discountText" TEXT,
  ADD COLUMN IF NOT EXISTS "emiPrice" TEXT,
  ADD COLUMN IF NOT EXISTS "imageUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "stockStatus" "StockStatus" NOT NULL DEFAULT 'IN_STOCK',
  ADD COLUMN IF NOT EXISTS "totalQuantity" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "isCompareEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "isWishlistEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "seoTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "seoDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "brandId" TEXT;

UPDATE "products"
SET "sku" = COALESCE("sku", 'SKU-' || substr("id", 1, 8))
WHERE "sku" IS NULL;

ALTER TABLE "products"
  ALTER COLUMN "sku" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "products_sku_key" ON "products"("sku");

DO $$ BEGIN
  ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey"
    FOREIGN KEY ("brandId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "product_images" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "product_overviews" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "product_overviews_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "product_overviews" ADD CONSTRAINT "product_overviews_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "product_specifications" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "groupName" TEXT,
  "specKey" TEXT NOT NULL,
  "specValue" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "product_specifications_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "product_specifications" ADD CONSTRAINT "product_specifications_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "branches" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" "CategoryStatus" NOT NULL DEFAULT 'ACTIVE',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "branches_slug_key" ON "branches"("slug");

CREATE TABLE IF NOT EXISTS "product_branch_stocks" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "branchId" TEXT NOT NULL,
  "availabilityStatus" "BranchAvailabilityStatus" NOT NULL DEFAULT 'OUT_OF_STOCK',
  "quantity" INTEGER NOT NULL DEFAULT 0,
  "note" TEXT,
  CONSTRAINT "product_branch_stocks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "product_branch_stocks_productId_branchId_key"
  ON "product_branch_stocks"("productId", "branchId");

DO $$ BEGIN
  ALTER TABLE "product_branch_stocks" ADD CONSTRAINT "product_branch_stocks_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "product_branch_stocks" ADD CONSTRAINT "product_branch_stocks_branchId_fkey"
    FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "orders"
  ALTER COLUMN "userId" DROP NOT NULL;
