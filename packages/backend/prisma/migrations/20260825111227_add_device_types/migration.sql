-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DeviceType" ADD VALUE 'BARRIER_GATE';
ALTER TYPE "DeviceType" ADD VALUE 'TICKET_DISPENSER';
ALTER TYPE "DeviceType" ADD VALUE 'LED_SIGN';
ALTER TYPE "DeviceType" ADD VALUE 'INTERCOM';
ALTER TYPE "DeviceType" ADD VALUE 'IP_CAMERA';
