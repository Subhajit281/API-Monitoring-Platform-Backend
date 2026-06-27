-- AlterTable
ALTER TABLE "Monitor" ADD COLUMN     "lastEditedAt" TIMESTAMP(3),
ALTER COLUMN "method" SET DEFAULT 'GET';

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Visit_projectId_createdAt_idx" ON "Visit"("projectId", "createdAt");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
