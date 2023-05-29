-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Collection" (
    "owner" TEXT,
    "address" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'No name',
    "description" TEXT NOT NULL DEFAULT 'No description',
    "profileImage" TEXT NOT NULL DEFAULT 'https://i.seadn.io/gcs/files/a719339f71b8248e3803192b6a30d2e0.png',
    "bgImage" TEXT NOT NULL DEFAULT 'https://i.ytimg.com/vi/Lav15rWDXUk/maxresdefault.jpg'
);
INSERT INTO "new_Collection" ("address", "description", "name", "owner", "profileImage") SELECT "address", "description", "name", "owner", "profileImage" FROM "Collection";
DROP TABLE "Collection";
ALTER TABLE "new_Collection" RENAME TO "Collection";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
