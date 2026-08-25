-- AlterTable
ALTER TABLE "device_status" ADD COLUMN     "api_key" TEXT,
ADD COLUMN     "api_url" TEXT,
ADD COLUMN     "firmware" TEXT,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "lane" INTEGER DEFAULT 1,
ADD COLUMN     "manufacturer" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "port" INTEGER;
