-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Collection" (
    "owner" TEXT,
    "address" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'No name',
    "profileImage" TEXT NOT NULL DEFAULT 'https://i.seadn.io/gcs/files/a719339f71b8248e3803192b6a30d2e0.png'
);
INSERT INTO "new_Collection" ("address", "owner", "profileImage") SELECT "address", "owner", "profileImage" FROM "Collection";
DROP TABLE "Collection";
ALTER TABLE "new_Collection" RENAME TO "Collection";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
