-- CreateTable
CREATE TABLE "usuarios" (
    "user_id" BIGSERIAL NOT NULL,
    "user_nome" VARCHAR(40) NOT NULL,
    "user_email" VARCHAR(40) NOT NULL,
    "user_senha" VARCHAR(255),
    "user_cpf" VARCHAR(14) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_user_email_key" ON "usuarios"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_user_cpf_key" ON "usuarios"("user_cpf");
