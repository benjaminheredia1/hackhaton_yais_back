-- CreateTable
CREATE TABLE "Information" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PatientRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientName" TEXT NOT NULL,
    "bed" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "primaryDiagnosis" TEXT,
    "daysAdmitted" INTEGER,
    "triageSeverity" TEXT,
    "allergies" TEXT,
    "riskFallsBedsores" TEXT,
    "heartRate" TEXT,
    "bloodPressure" TEXT,
    "oxygenSaturation" TEXT,
    "temperature" TEXT,
    "respiratoryRate" TEXT,
    "consciousnessGlasgow" TEXT,
    "venousAccess" TEXT,
    "oxygenTherapy" TEXT,
    "fluidIntake" REAL,
    "fluidOutput" REAL,
    "shiftBalance" REAL,
    "nextMedication" TEXT,
    "pendingStudies" TEXT,
    "relevantUpdates" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
