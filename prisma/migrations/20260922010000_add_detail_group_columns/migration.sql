ALTER TABLE "stream" ADD COLUMN IF NOT EXISTS "gru_id" INTEGER;
ALTER TABLE "viagem" ADD COLUMN IF NOT EXISTS "gru_id" INTEGER;
ALTER TABLE "domestico" ADD COLUMN IF NOT EXISTS "gru_id" INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS "stream_gru_id_key" ON "stream"("gru_id");
CREATE UNIQUE INDEX IF NOT EXISTS "viagem_gru_id_key" ON "viagem"("gru_id");
CREATE UNIQUE INDEX IF NOT EXISTS "domestico_gru_id_key" ON "domestico"("gru_id");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'stream_gru_id_fkey') THEN
    ALTER TABLE "stream" ADD CONSTRAINT "stream_gru_id_fkey"
      FOREIGN KEY ("gru_id") REFERENCES "grupo"("gru_id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'viagem_gru_id_fkey') THEN
    ALTER TABLE "viagem" ADD CONSTRAINT "viagem_gru_id_fkey"
      FOREIGN KEY ("gru_id") REFERENCES "grupo"("gru_id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'domestico_gru_id_fkey') THEN
    ALTER TABLE "domestico" ADD CONSTRAINT "domestico_gru_id_fkey"
      FOREIGN KEY ("gru_id") REFERENCES "grupo"("gru_id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
