DO $$ BEGIN
  CREATE TYPE "BuilderType" AS ENUM ('PC', 'CC_CAMERA');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "pc_builder_components" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "builderType" "BuilderType" NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isRequired" BOOLEAN NOT NULL DEFAULT false,
  "allowMultiple" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "pc_builder_components_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "pc_builder_components_builderType_slug_key"
  ON "pc_builder_components"("builderType", "slug");

CREATE TABLE IF NOT EXISTS "product_component_map" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "builderType" "BuilderType" NOT NULL,
  "componentType" TEXT NOT NULL,
  CONSTRAINT "product_component_map_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "product_component_map_productId_builderType_componentType_key"
  ON "product_component_map"("productId", "builderType", "componentType");

DO $$ BEGIN
  ALTER TABLE "product_component_map" ADD CONSTRAINT "product_component_map_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "product_spec_meta" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  CONSTRAINT "product_spec_meta_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "product_spec_meta_productId_key_key"
  ON "product_spec_meta"("productId", "key");

DO $$ BEGIN
  ALTER TABLE "product_spec_meta" ADD CONSTRAINT "product_spec_meta_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "build_sessions" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalPower" INTEGER NOT NULL DEFAULT 0,
  "shareCode" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "build_sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "build_sessions_shareCode_key" ON "build_sessions"("shareCode");

DO $$ BEGIN
  ALTER TABLE "build_sessions" ADD CONSTRAINT "build_sessions_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "build_items" (
  "id" TEXT NOT NULL,
  "buildId" TEXT NOT NULL,
  "componentType" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  CONSTRAINT "build_items_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "build_items" ADD CONSTRAINT "build_items_buildId_fkey"
    FOREIGN KEY ("buildId") REFERENCES "build_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "build_items" ADD CONSTRAINT "build_items_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "cc_builder_sessions" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalPower" INTEGER NOT NULL DEFAULT 0,
  "shareCode" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "cc_builder_sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "cc_builder_sessions_shareCode_key" ON "cc_builder_sessions"("shareCode");

DO $$ BEGIN
  ALTER TABLE "cc_builder_sessions" ADD CONSTRAINT "cc_builder_sessions_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "cc_builder_items" (
  "id" TEXT NOT NULL,
  "buildId" TEXT NOT NULL,
  "componentType" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  CONSTRAINT "cc_builder_items_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "cc_builder_items" ADD CONSTRAINT "cc_builder_items_buildId_fkey"
    FOREIGN KEY ("buildId") REFERENCES "cc_builder_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "cc_builder_items" ADD CONSTRAINT "cc_builder_items_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
