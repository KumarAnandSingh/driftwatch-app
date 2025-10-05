-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingSkippedAt" TIMESTAMP(3),
ADD COLUMN     "onboardingStep" INTEGER,
ADD COLUMN     "role" TEXT;
