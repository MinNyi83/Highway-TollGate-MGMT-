-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_event_id_fkey";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "payment_method" TEXT,
ALTER COLUMN "event_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "toll_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
