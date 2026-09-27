-- Up Migration
CREATE TABLE "notifications" (
    "notificationId" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "producerId" UUID NOT NULL REFERENCES producers("producerId") ON DELETE CASCADE,
    "event" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "content" VARCHAR NOT NULL,
    "link" VARCHAR,
    "read" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP
);

CREATE INDEX "idx_notifications_producer_id" ON notifications("producerId");

-- Down Migration
DROP TABLE notifications;
DROP INDEX "idx_notifications_producer_id";