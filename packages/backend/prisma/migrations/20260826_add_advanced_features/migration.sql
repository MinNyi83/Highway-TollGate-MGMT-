-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER', 'CUSTOMER', 'ENTERPRISE_ADMIN', 'ENTERPRISE_USER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'VIEWER';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ViolationStatus_new" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'ESCALATED', 'DISMISSED', 'RESOLVED');
ALTER TABLE "violations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "violations" ALTER COLUMN "status" TYPE "ViolationStatus_new" USING ("status"::text::"ViolationStatus_new");
ALTER TYPE "ViolationStatus" RENAME TO "ViolationStatus_old";
ALTER TYPE "ViolationStatus_new" RENAME TO "ViolationStatus";
DROP TYPE "ViolationStatus_old";
ALTER TABLE "violations" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable: Add new columns to users
ALTER TABLE "users" ADD COLUMN "two_factor_secret" TEXT,
ADD COLUMN "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "two_factor_backup_codes" TEXT,
ADD COLUMN "custom_permissions" TEXT,
ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en';

-- AlterTable: Add account_number to accounts
ALTER TABLE "accounts" ADD COLUMN "account_number" TEXT UNIQUE;

-- AlterTable: Add amount to toll_events
ALTER TABLE "toll_events" ADD COLUMN "amount" DECIMAL(10,2);

-- AlterTable: Add description to transactions
ALTER TABLE "transactions" ADD COLUMN "description" TEXT;

-- AlterTable: Add title and read_at to notifications
ALTER TABLE "notifications" ADD COLUMN "title" TEXT,
ADD COLUMN "read_at" TIMESTAMP(3);

-- CreateTable: promo_codes
CREATE TABLE "promo_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "max_uses" INTEGER NOT NULL,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_to" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "promo_codes_code_key" ON "promo_codes"("code");

-- CreateTable: loyalty_points
CREATE TABLE "loyalty_points" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "earned" INTEGER NOT NULL DEFAULT 0,
    "redeemed" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "loyalty_points_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "loyalty_points" ADD CONSTRAINT "loyalty_points_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable: webhooks
CREATE TABLE "webhooks" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "events" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "retry_count" INTEGER NOT NULL DEFAULT 3,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable: vehicle_photos
CREATE TABLE "vehicle_photos" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "photo_type" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vehicle_photos_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "vehicle_photos" ADD CONSTRAINT "vehicle_photos_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "toll_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable: tenants
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "settings" JSONB,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "tenants_domain_key" ON "tenants"("domain");
