-- CreateTable
CREATE TABLE "accounts" (
    "account_id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "verification_token" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "account_id" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "verification_token_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts" ("account_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_id" TEXT NOT NULL PRIMARY KEY,
    "account_id" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "sessions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts" ("account_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "profile" (
    "profile_id" TEXT NOT NULL PRIMARY KEY,
    "account_id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "avatar" TEXT,
    CONSTRAINT "profile_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts" ("account_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profile_account_id_key" ON "profile"("account_id");
