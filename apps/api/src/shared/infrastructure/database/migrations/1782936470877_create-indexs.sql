-- Up Migration

CREATE INDEX IF NOT EXISTS "idx_properties_producerId" ON "properties" ("producerId");
CREATE INDEX IF NOT EXISTS "idx_cultures_propertyId" ON "cultures" ("propertyId");
CREATE INDEX IF NOT EXISTS "idx_crops_cultureId" ON "crops" ("cultureId");

-- Down Migration

DROP INDEX IF EXISTS "idx_crops_cultureId";
DROP INDEX IF EXISTS "idx_cultures_propertyId";
DROP INDEX IF EXISTS "idx_properties_producerId";