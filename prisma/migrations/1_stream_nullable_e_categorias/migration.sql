-- O app não preenche str_plano/str_telas (envia null quando não há plano
-- selecionado) e nunca envia str_dtvencimento. Com as três colunas NOT NULL,
-- toda criação de streaming estourava erro de validação do Prisma.

ALTER TABLE "stream" ALTER COLUMN "str_plano" DROP NOT NULL;
ALTER TABLE "stream" ALTER COLUMN "str_telas" DROP NOT NULL;
ALTER TABLE "stream" ALTER COLUMN "str_dtvencimento" DROP NOT NULL;

-- A 0_init cria a tabela "categoria" mas nunca a popula.
INSERT INTO "categoria" ("cat_id", "cat_nome") VALUES
  (1, 'Streaming'),
  (2, 'Despesas Domésticas'),
  (3, 'Viagens')
ON CONFLICT ("cat_id") DO NOTHING;

-- Se as linhas foram apagadas com DELETE (e não TRUNCATE), a sequência ficou
-- à frente e o próximo grupo receberia um cat_id inexistente.
SELECT setval(
  pg_get_serial_sequence('categoria', 'cat_id'),
  GREATEST((SELECT COALESCE(MAX("cat_id"), 1) FROM "categoria"), 1)
);