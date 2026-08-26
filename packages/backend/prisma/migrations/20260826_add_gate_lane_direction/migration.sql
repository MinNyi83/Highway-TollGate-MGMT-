-- AlterTable: Add gate_code to toll_plazas
ALTER TABLE "toll_plazas" ADD COLUMN "gate_code" TEXT UNIQUE;

-- AlterTable: Add lane_number and direction to toll_events
ALTER TABLE "toll_events" ADD COLUMN "lane_number" TEXT,
ADD COLUMN "direction" TEXT NOT NULL DEFAULT 'DOWN';
