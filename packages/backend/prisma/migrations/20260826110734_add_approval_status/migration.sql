-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "toll_events" ALTER COLUMN "direction" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "approval_status" "ApprovalStatus" NOT NULL DEFAULT 'APPROVED',
ADD COLUMN     "approved_at" TIMESTAMP(3),
ADD COLUMN     "approved_by" TEXT,
ADD COLUMN     "rejected_reason" TEXT;
