/*
  Warnings:

  - You are about to alter the column `floorPrice` on the `Collection` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Collection" (
    "address" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Unknown collection',
    "owner" TEXT NOT NULL DEFAULT 'Unknown owner',
    "floorPrice" REAL NOT NULL DEFAULT 0,
    "profileImage" TEXT NOT NULL DEFAULT 'https://i.seadn.io/gcs/files/a719339f71b8248e3803192b6a30d2e0.png?auto=format&dpr=1&w=1000',
    "bgImage" TEXT NOT NULL DEFAULT 'https://i.ytimg.com/vi/Lav15rWDXUk/maxresdefault.jpg',
    "links" TEXT NOT NULL DEFAULT 'Aqui estaran los links a rrss'
);
INSERT INTO "new_Collection" ("address", "bgImage", "floorPrice", "links", "name", "owner", "profileImage") SELECT "address", "bgImage", "floorPrice", "links", "name", "owner", "profileImage" FROM "Collection";
DROP TABLE "Collection";
ALTER TABLE "new_Collection" RENAME TO "Collection";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
