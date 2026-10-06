-- CreateEnum
CREATE TYPE "tipo_divisao" AS ENUM ('Igualitária', 'Personalizada');

-- CreateTable
CREATE TABLE "usuario" (
    "usu_id" BIGSERIAL NOT NULL,
    "usu_nome" VARCHAR(50) NOT NULL,
    "usu_email" VARCHAR(255) NOT NULL,
    "usu_senha" VARCHAR(255) NOT NULL,
    "usu_cpf" VARCHAR(14) NOT NULL,
    "usu_telefone" VARCHAR(15),
    "usu_data_nasc" DATE NOT NULL,
    "usu_descricao" VARCHAR(120),
    "usu_foto" TEXT,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("usu_id")
);

-- CreateTable
CREATE TABLE "mensalidade" (
    "men_id" SERIAL NOT NULL,
    "men_status_pag" VARCHAR(20) NOT NULL,
    "men_data_lan" DATE NOT NULL,
    "men_valor_pago" DECIMAL(10,2) NOT NULL,
    "men_data_ven" DATE NOT NULL,
    "men_valor" DECIMAL(10,2) NOT NULL,
    "men_data_pag" DATE NOT NULL,
    "usu_id" BIGINT NOT NULL,
    "men_divisao" "tipo_divisao" NOT NULL DEFAULT 'Igualitária',

    CONSTRAINT "mensalidade_pkey" PRIMARY KEY ("men_id")
);

-- CreateTable
CREATE TABLE "grupo" (
    "gru_id" SERIAL NOT NULL,
    "gru_num_part" INTEGER NOT NULL,
    "cat_id" INTEGER NOT NULL,
    "gru_nome" VARCHAR(20) NOT NULL,
    "gru_descricao" VARCHAR(150),
    "gru_visibilidade" BOOLEAN NOT NULL DEFAULT false,
    "gru_cor" VARCHAR(7),
    "gru_icone" VARCHAR(50),
    "men_id" INTEGER,
    "gru_num_vagas" INTEGER,
    "gru_criador_id" BIGINT,
    "gru_criador_nome" VARCHAR(50),

    CONSTRAINT "grupo_pkey" PRIMARY KEY ("gru_id")
);

-- CreateTable
CREATE TABLE "participar" (
    "par_id" SERIAL NOT NULL,
    "usu_id" BIGINT NOT NULL,
    "gru_id" INTEGER NOT NULL,

    CONSTRAINT "participar_pkey" PRIMARY KEY ("par_id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "cat_id" SERIAL NOT NULL,
    "cat_nome" VARCHAR(50) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("cat_id")
);

-- CreateTable
CREATE TABLE "stream" (
    "cat_id" INTEGER,
    "gru_id" INTEGER NOT NULL,
    "str_valor" DECIMAL(10,2) NOT NULL,
    "str_plano" VARCHAR(100) NOT NULL,
    "str_telas" INTEGER NOT NULL,
    "str_dtvencimento" DATE NOT NULL
);

-- CreateTable
CREATE TABLE "viagem" (
    "cat_id" INTEGER NOT NULL,
    "via_partida" VARCHAR(50) NOT NULL,
    "via_destino" VARCHAR(50) NOT NULL,
    "via_data_inicio" DATE NOT NULL,
    "via_data_fim" DATE NOT NULL,
    "gru_id" INTEGER NOT NULL,

    CONSTRAINT "viagem_pkey" PRIMARY KEY ("gru_id")
);

-- CreateTable
CREATE TABLE "domestico" (
    "cat_id" INTEGER NOT NULL,
    "dom_endereco" VARCHAR(150),
    "gru_id" INTEGER NOT NULL,

    CONSTRAINT "domestico_pkey" PRIMARY KEY ("gru_id")
);

-- CreateTable
CREATE TABLE "avaliacao" (
    "ava_id" SERIAL NOT NULL,
    "ava_nota" INTEGER NOT NULL,
    "ava_descricao" VARCHAR(200),
    "ava_avaliado" BIGINT NOT NULL,
    "ava_avaliador" BIGINT NOT NULL,
    "gru_id" INTEGER,
    "gru_nome" VARCHAR(20),

    CONSTRAINT "avaliacao_pkey" PRIMARY KEY ("ava_id")
);

-- CreateTable
CREATE TABLE "item" (
    "ite_id" SERIAL NOT NULL,
    "ite_nome" VARCHAR(100) NOT NULL,
    "ite_valor" DECIMAL(10,2) NOT NULL,
    "ite_nota_fiscal" TEXT,
    "ite_recorrente" BOOLEAN DEFAULT false,
    "gru_id" INTEGER NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("ite_id")
);

-- CreateTable
CREATE TABLE "item_usuario" (
    "ite_id" INTEGER NOT NULL,
    "usu_id" BIGINT NOT NULL,

    CONSTRAINT "item_usuario_pkey" PRIMARY KEY ("ite_id","usu_id")
);

-- CreateTable
CREATE TABLE "notificacao" (
    "not_notificacao_id" SERIAL NOT NULL,
    "not_user_id" BIGINT NOT NULL,
    "not_notificacao_tipo" VARCHAR(50) NOT NULL,
    "not_notificacao_titulo" VARCHAR(255) NOT NULL,
    "not_notificacao_mensagem" TEXT NOT NULL,
    "not_notificacao_lida" BOOLEAN NOT NULL DEFAULT false,
    "not_notificacao_data" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usu_id" BIGINT,

    CONSTRAINT "notificacao_pkey" PRIMARY KEY ("not_notificacao_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_usu_email_key" ON "usuario"("usu_email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_usu_cpf_key" ON "usuario"("usu_cpf");

-- CreateIndex
CREATE UNIQUE INDEX "stream_gru_id_key" ON "stream"("gru_id");

-- AddForeignKey
ALTER TABLE "mensalidade" ADD CONSTRAINT "mensalidade_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "usuario"("usu_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "fk_grupo_criador" FOREIGN KEY ("gru_criador_id") REFERENCES "usuario"("usu_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "fk_grupo_mensalidade" FOREIGN KEY ("men_id") REFERENCES "mensalidade"("men_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "categoria"("cat_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participar" ADD CONSTRAINT "participar_gru_id_fkey" FOREIGN KEY ("gru_id") REFERENCES "grupo"("gru_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participar" ADD CONSTRAINT "participar_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "usuario"("usu_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "categoria"("cat_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_gru_id_fkey" FOREIGN KEY ("gru_id") REFERENCES "grupo"("gru_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "categoria"("cat_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "viagem" ADD CONSTRAINT "viagem_gru_id_fkey" FOREIGN KEY ("gru_id") REFERENCES "grupo"("gru_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domestico" ADD CONSTRAINT "domestico_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "categoria"("cat_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "domestico" ADD CONSTRAINT "domestico_gru_id_fkey" FOREIGN KEY ("gru_id") REFERENCES "grupo"("gru_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "fk_avaliacao_avaliado" FOREIGN KEY ("ava_avaliado") REFERENCES "usuario"("usu_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "fk_avaliacao_avaliador" FOREIGN KEY ("ava_avaliador") REFERENCES "usuario"("usu_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "avaliacao" ADD CONSTRAINT "fk_avaliacao_grupo" FOREIGN KEY ("gru_id") REFERENCES "grupo"("gru_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_gru_id_fkey" FOREIGN KEY ("gru_id") REFERENCES "grupo"("gru_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "item_usuario" ADD CONSTRAINT "item_usuario_ite_id_fkey" FOREIGN KEY ("ite_id") REFERENCES "item"("ite_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "item_usuario" ADD CONSTRAINT "item_usuario_usu_id_fkey" FOREIGN KEY ("usu_id") REFERENCES "usuario"("usu_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "fk_notificacao_usuario" FOREIGN KEY ("not_user_id") REFERENCES "usuario"("usu_id") ON DELETE CASCADE ON UPDATE NO ACTION;

