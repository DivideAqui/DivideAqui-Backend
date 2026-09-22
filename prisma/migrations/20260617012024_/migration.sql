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


CREATE TABLE IF NOT EXISTS "stream" (
  "cat_id" INTEGER,
  "gru_id" INTEGER NOT NULL UNIQUE,
  "str_valor" DECIMAL(10, 2) NOT NULL,
  CONSTRAINT "stream_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "categoria"("cat_id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "stream_gru_id_fkey" FOREIGN KEY ("gru_id") REFERENCES "grupo"("gru_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "viagem" (
  "cat_id" INTEGER,
  "gru_id" INTEGER NOT NULL UNIQUE,
  "via_partida" VARCHAR(50) NOT NULL,
  "via_destino" VARCHAR(50) NOT NULL,
  "via_data_inicio" DATE NOT NULL,
  "via_data_fim" DATE NOT NULL,
  CONSTRAINT "viagem_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "categoria"("cat_id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "viagem_gru_id_fkey" FOREIGN KEY ("gru_id") REFERENCES "grupo"("gru_id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "domestico" (
  "cat_id" INTEGER,
  "gru_id" INTEGER NOT NULL UNIQUE,
  "dom_aluguel" DECIMAL(10, 2) NOT NULL,
  "dom_luz" DECIMAL(10, 2) NOT NULL,
  "dom_agua" DECIMAL(10, 2) NOT NULL,
  "dom_internet" DECIMAL(10, 2) NOT NULL,
  "dom_endereco" VARCHAR(150),
  CONSTRAINT "domestico_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "categoria"("cat_id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "domestico_gru_id_fkey" FOREIGN KEY ("gru_id") REFERENCES "grupo"("gru_id") ON DELETE CASCADE ON UPDATE CASCADE
);
