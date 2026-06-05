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
  "id_culture" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_property" UUID NOT NULL,
  "name" varchar NOT NULL,
  "allocated_area" integer DEFAULT 0,
  "created_at" timestamp DEFAULT NOW(),
  "updated_at" timestamp,

  CONSTRAINT fk_cultures_producers
    FOREIGN KEY ("id_property")
    REFERENCES "properties" ("propertyId")
    ON DELETE CASCADE
);


CREATE TABLE "crops" (
  "id_crop" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_culture" UUID NOT NULL,
  "name" varchar NOT NULL,
  "status" varchar NOT NULL,
  "allocated_area" integer NOT NULL,
  "harvest_date_expected" varchar NOT NULL,
  "harvest_date_actual" varchar,
  "pest_status" varchar NOT NULL,
  "created_at" timestamp DEFAULT NOW(),
  "updated_at" timestamp,

  CONSTRAINT fk_crops_cultures
    FOREIGN KEY ("id_culture")
    REFERENCES "cultures" ("id_culture")
    ON DELETE CASCADE
);
-- Down Migration

DROP TABLE IF EXISTS "crops";
DROP TABLE IF EXISTS "cultures";
DROP TABLE IF EXISTS "properties";
DROP TABLE IF EXISTS "producers";