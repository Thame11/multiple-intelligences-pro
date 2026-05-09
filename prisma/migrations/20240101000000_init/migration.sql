-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nationalId" TEXT,
    "grade" TEXT,
    "school" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "answersJson" TEXT NOT NULL,
    "scoresJson" TEXT NOT NULL,
    "top3Json" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Student_name_idx" ON "Student"("name");

-- CreateIndex
CREATE INDEX "Student_nationalId_idx" ON "Student"("nationalId");

-- CreateIndex
CREATE INDEX "Result_createdAt_idx" ON "Result"("createdAt");

-- CreateIndex
CREATE INDEX "Result_studentId_idx" ON "Result"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
