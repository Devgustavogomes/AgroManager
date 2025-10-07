CREATE TABLE "producer" (
  "id" UUID PRIMARY KEY,
  "username" varchar NOT NULL,
  "CPForCNPJ" varchar UNIQUE NOT NULL,
  "hashedPassword" varchar NOT NULL,
  "role" varchar NOT NULL,
  "created_at" timestamp DEFAULT NOW(),
);

CREATE TABLE "properties" (
  "id" UUID PRIMARY KEY,
  "producer_id" UUID NOT NULL,
  "city" varchar NOT NULL,
  "state" varchar NOT NULL,
  "total_area" float NOT NULL,
  "arable_area" float NOT NULL,
  "vegetation_area" float NOT NULL,
  "created_at" timestamp DEFAULT NOW(),
);

CREATE TABLE "crops" (
  "id" UUID PRIMARY KEY,
  "properties_id" UUID NOT NULL,
  "name" varchar NOT NULL,
  "created_at" timestamp DEFAULT NOW()
);

CREATE TABLE "cultures" (
  "id" UUID PRIMARY KEY,
  "crops_id" UUID NOT NULL,
  "name" varchar NOT NULL,
  "created_at" timestamp DEFAULT NOW()
);

ALTER TABLE "properties" ADD FOREIGN KEY ("producer_id") REFERENCES "producer" ("id");

ALTER TABLE "crops" ADD FOREIGN KEY ("properties_id") REFERENCES "properties" ("id");

ALTER TABLE "cultures" ADD FOREIGN KEY ("crops_id") REFERENCES "crops" ("id");
