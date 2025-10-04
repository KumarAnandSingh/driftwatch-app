/*
  Warnings:

  - The `status` column on the `Run` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "authPassword" TEXT,
ADD COLUMN     "authUsername" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "maxDepth" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "maxPages" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "requiresAuth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scanAccessibility" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "scanAiCritique" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "scanPerformance" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "scanSeo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "scanVisualRegression" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "scheduleEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scheduleFrequency" TEXT,
ADD COLUMN     "scheduleTime" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Run" ADD COLUMN     "a11yResults" JSONB,
ADD COLUMN     "aiCritiqueResults" JSONB,
ADD COLUMN     "crawlResult" JSONB,
ADD COLUMN     "currentPhase" TEXT,
ADD COLUMN     "issuesCritical" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "issuesPassed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "issuesWarning" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pagesScanned" INTEGER,
ADD COLUMN     "perfResults" JSONB,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "score" INTEGER,
ADD COLUMN     "screenshotResults" JSONB,
ADD COLUMN     "seoResults" JSONB,
ADD COLUMN     "visualDiffResults" JSONB,
DROP COLUMN "status",
ADD COLUMN     "status" "RunStatus" NOT NULL DEFAULT 'QUEUED';
