-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('INDIVIDUAL', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "credit_limit" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "customer_type" "CustomerType" NOT NULL DEFAULT 'INDIVIDUAL',
ADD COLUMN     "payment_terms" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "company_address" TEXT,
ADD COLUMN     "company_name" TEXT,
ADD COLUMN     "company_reg_no" TEXT,
ADD COLUMN     "customer_type" "CustomerType" NOT NULL DEFAULT 'INDIVIDUAL',
ADD COLUMN     "driving_license" TEXT,
ADD COLUMN     "fleet_manager_name" TEXT,
ADD COLUMN     "nrc_number" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "sms_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sms_provider" TEXT;

-- CreateTable
CREATE TABLE "sms_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "external_id" TEXT,
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sms_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sms_logs" ADD CONSTRAINT "sms_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
