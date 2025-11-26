-- Up Migration
CREATE TABLE "producers" (
  "id_producer" UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" varchar NOT NULL,
  "cpf_or_cnpj" varchar UNIQUE NOT NULL,
  "hashed_password" varchar NOT NULL,
  "role" varchar NOT NULL DEFAULT 'USER',
  "created_at" timestamp DEFAULT NOW(),
  "updated_at" timestamp
);

CREATE TABLE "properties" (
  "id_property" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_producer" UUID NOT NULL,
  "city" varchar NOT NULL,
  "state" varchar NOT NULL,
  "total_area" float NOT NULL,
  "arable_area" float NOT NULL,
  "vegetation_area" float NOT NULL,
  "created_at" timestamp DEFAULT NOW(),
  "updated_at" timestamp,

  CONSTRAINT fk_properties_producers
    FOREIGN KEY ("id_producer")
    REFERENCES "producers" ("id_producer")
    ON DELETE CASCADE
);

CREATE TABLE "crops" (
  "id_crop" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_property" UUID NOT NULL,
  "name" varchar NOT NULL,
  "created_at" timestamp DEFAULT NOW(),
  "updated_at" timestamp,

  CONSTRAINT fk_crops_properties
    FOREIGN KEY ("id_property")
    REFERENCES "properties" ("id_property")
    ON DELETE CASCADE
);

CREATE TABLE "cultures" (
  "id_culture" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "id_crop" UUID NOT NULL,
  "name" varchar NOT NULL,
  "created_at" timestamp DEFAULT NOW(),
  "updated_at" timestamp,

  CONSTRAINT fk_cultures_crops
    FOREIGN KEY ("id_crop")
    REFERENCES "crops" ("id_crop")
    ON DELETE CASCADE
);

ALTER TABLE "properties" ADD FOREIGN KEY ("id_producer") REFERENCES "producers" ("id_producer");

ALTER TABLE "crops" ADD FOREIGN KEY ("id_property") REFERENCES "properties" ("id_property");

ALTER TABLE "cultures" ADD FOREIGN KEY ("id_crop") REFERENCES "crops" ("id_crop");

-- Down Migration

DROP TABLE IF EXISTS "cultures";
DROP TABLE IF EXISTS "crops";
DROP TABLE IF EXISTS "properties";
DROP TABLE IF EXISTS "producers";