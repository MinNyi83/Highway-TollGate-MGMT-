-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OPERATOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'STOLEN');

-- CreateEnum
CREATE TYPE "VehicleClass" AS ENUM ('MOTORCYCLE', 'SEDAN', 'SUV', 'TRUCK', 'BUS');

-- CreateEnum
CREATE TYPE "RFIDTagStatus" AS ENUM ('ACTIVE', 'LOST', 'DAMAGED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "TollPlazaStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "TollEventStatus" AS ENUM ('ENTRY', 'EXIT', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEBIT', 'TOPUP', 'REFUND');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "ViolationType" AS ENUM ('NO_RFID', 'INSUFFICIENT_BALANCE', 'RFID_ANPR_MISMATCH', 'UNREGISTERED_VEHICLE');

-- CreateEnum
CREATE TYPE "ViolationStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'ESCALATED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('RFID_READER', 'ANPR_CAMERA', 'LIDAR', 'LANE_CONTROLLER');

-- CreateEnum
CREATE TYPE "DeviceStatusEnum" AS ENUM ('ONLINE', 'OFFLINE', 'ERROR', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT,
    "vehicle_class" "VehicleClass" NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'ACTIVE',
    "vehicle_photo" TEXT,
    "wheel_tax_card" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rfid_tags" (
    "id" TEXT NOT NULL,
    "tag_uid" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "status" "RFIDTagStatus" NOT NULL DEFAULT 'ACTIVE',
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rfid_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toll_plazas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location_lat" DECIMAL(10,7) NOT NULL,
    "location_lng" DECIMAL(10,7) NOT NULL,
    "lanes" INTEGER NOT NULL DEFAULT 4,
    "status" "TollPlazaStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "toll_plazas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toll_rates" (
    "id" TEXT NOT NULL,
    "plaza_id" TEXT NOT NULL,
    "vehicle_class" "VehicleClass" NOT NULL,
    "rate_amount" DECIMAL(10,2) NOT NULL,
    "effective_from" TIMESTAMP(3) NOT NULL,
    "effective_to" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "toll_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "toll_events" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "plaza_id" TEXT NOT NULL,
    "rfid_tag_id" TEXT,
    "anpr_plate" TEXT,
    "entry_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exit_time" TIMESTAMP(3),
    "status" "TollEventStatus" NOT NULL DEFAULT 'ENTRY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "toll_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "violations" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "violation_type" "ViolationType" NOT NULL,
    "status" "ViolationStatus" NOT NULL DEFAULT 'PENDING',
    "fine_amount" DECIMAL(10,2) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "violations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_status" (
    "id" TEXT NOT NULL,
    "plaza_id" TEXT NOT NULL,
    "device_type" "DeviceType" NOT NULL,
    "device_id" TEXT NOT NULL,
    "status" "DeviceStatusEnum" NOT NULL DEFAULT 'ONLINE',
    "last_heartbeat" TIMESTAMP(3),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT,
    "details" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plate_number_key" ON "vehicles"("plate_number");

-- CreateIndex
CREATE UNIQUE INDEX "rfid_tags_tag_uid_key" ON "rfid_tags"("tag_uid");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_event_id_key" ON "transactions"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "violations_event_id_key" ON "violations"("event_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfid_tags" ADD CONSTRAINT "rfid_tags_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rfid_tags" ADD CONSTRAINT "rfid_tags_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toll_rates" ADD CONSTRAINT "toll_rates_plaza_id_fkey" FOREIGN KEY ("plaza_id") REFERENCES "toll_plazas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toll_events" ADD CONSTRAINT "toll_events_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toll_events" ADD CONSTRAINT "toll_events_plaza_id_fkey" FOREIGN KEY ("plaza_id") REFERENCES "toll_plazas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "toll_events" ADD CONSTRAINT "toll_events_rfid_tag_id_fkey" FOREIGN KEY ("rfid_tag_id") REFERENCES "rfid_tags"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "toll_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "violations" ADD CONSTRAINT "violations_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "violations" ADD CONSTRAINT "violations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "toll_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_status" ADD CONSTRAINT "device_status_plaza_id_fkey" FOREIGN KEY ("plaza_id") REFERENCES "toll_plazas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
