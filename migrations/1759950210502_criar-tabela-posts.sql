-- Up Migration
CREATE TABLE "producers" (
  "producerId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "hashedPassword" varchar NOT NULL,
  "role" varchar NOT NULL DEFAULT 'USER',
  "createdAt" timestamp DEFAULT NOW(),
  "updatedAt" timestamp
);

CREATE TABLE "properties" (
  "propertyId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "producerId" UUID NOT NULL,
  "name" varchar NOT NULL,
  "slug" varchar UNIQUE NOT NULL,
  "city" varchar NOT NULL,
  "state" varchar NOT NULL,
  "totalArea" NUMERIC(10,2) NOT NULL, 
  "arableArea" NUMERIC(10,2) NOT NULL,
  "vegetationArea" NUMERIC(10,2) NOT NULL,
  "createdAt" timestamp DEFAULT NOW(),
  "updatedAt" timestamp,

  CONSTRAINT fk_properties_producers
    FOREIGN KEY ("producerId")
    REFERENCES "producers" ("producerId")
    ON DELETE CASCADE
);

CREATE TABLE "cultures" (
  "cultureId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "propertyId" UUID NOT NULL,
  "name" varchar NOT NULL,
  "allocatedArea" integer DEFAULT 0,
  "createdAt" timestamp DEFAULT NOW(),
  "updatedAt" timestamp,

  CONSTRAINT fk_cultures_producers
    FOREIGN KEY ("propertyId")
    REFERENCES "properties" ("propertyId")
    ON DELETE CASCADE
);


CREATE TABLE "crops" (
  "cropId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "cultureId" UUID NOT NULL,
  "name" varchar NOT NULL,
  "status" varchar NOT NULL,
  "allocatedArea" integer NOT NULL,
  "plantingDate" date NOT NULL,
  "harvestDateExpected" date NOT NULL,
  "harvestDateActual" date,
  "pestsStatus" varchar NOT NULL,
  "createdAt" timestamp DEFAULT NOW(),
  "updatedAt" timestamp,

  CONSTRAINT fk_crops_cultures
    FOREIGN KEY ("cultureId")
    REFERENCES "cultures" ("cultureId")
    ON DELETE CASCADE
);
-- Down Migration

DROP TABLE IF EXISTS "crops";
DROP TABLE IF EXISTS "cultures";
DROP TABLE IF EXISTS "properties";
DROP TABLE IF EXISTS "producers";