ALTER TABLE "grupo"
ADD COLUMN IF NOT EXISTS "gru_criador_id" INTEGER,
ADD COLUMN IF NOT EXISTS "gru_criador_nome" VARCHAR(50);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_grupo_criador'
  ) THEN
    ALTER TABLE "grupo"
    ADD CONSTRAINT "fk_grupo_criador"
    FOREIGN KEY ("gru_criador_id") REFERENCES "usuario"("usu_id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TABLE "stream"
ADD COLUMN IF NOT EXISTS "str_plano" VARCHAR(100),
ADD COLUMN IF NOT EXISTS "str_telas" INTEGER;
