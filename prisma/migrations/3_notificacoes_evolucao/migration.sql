-- Evolui a tabela `notificacao` (criada em 0_init, mas sem uso em código)
-- para suportar destaques em negrito, ícone/cor por tipo, e referência à divisão relacionada.
-- Nenhuma tabela existente é removida ou renomeada.
-- Esta migration é idempotente: pode ser reaplicada sem erro.

-- AlterTable: adiciona apenas colunas novas (ADD COLUMN IF NOT EXISTS evita conflito em reexecução)
ALTER TABLE "notificacao"
  ADD COLUMN IF NOT EXISTS "not_notificacao_destaques" JSONB,
  ADD COLUMN IF NOT EXISTS "not_notificacao_icone"      VARCHAR(50),
  ADD COLUMN IF NOT EXISTS "not_notificacao_cor"        VARCHAR(20),
  ADD COLUMN IF NOT EXISTS "not_gru_id"                 INTEGER;

-- AddForeignKey: criada apenas se ainda não existir (segurança para reexecução)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_notificacao_grupo'
      AND conrelid = 'notificacao'::regclass
  ) THEN
    ALTER TABLE "notificacao"
      ADD CONSTRAINT "fk_notificacao_grupo"
      FOREIGN KEY ("not_gru_id")
      REFERENCES "grupo"("gru_id")
      ON DELETE SET NULL
      ON UPDATE NO ACTION;
  END IF;
END $$;

-- CreateIndex: listagem por usuário, mais recentes primeiro; e filtro rápido de não-lidas
CREATE INDEX IF NOT EXISTS "notificacao_user_id_data_idx"
  ON "notificacao" ("not_user_id", "not_notificacao_data" DESC);

CREATE INDEX IF NOT EXISTS "notificacao_user_id_lida_idx"
  ON "notificacao" ("not_user_id", "not_notificacao_lida");