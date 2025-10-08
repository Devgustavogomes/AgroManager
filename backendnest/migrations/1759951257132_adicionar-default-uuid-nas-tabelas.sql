-- Up Migration

ALTER TABLE "producers" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "properties" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "crops" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "cultures" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Down Migration
ALTER TABLE "producers" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "properties" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "crops" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "cultures" ALTER COLUMN "id" DROP DEFAULT;