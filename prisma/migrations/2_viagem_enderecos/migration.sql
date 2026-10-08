-- O frontend envia o place_name do Mapbox em via_partida/via_destino
-- (ex.: "Avenida Paulista, Bela Vista, Sao Paulo - SP, Brasil" = 55
-- caracteres). Com VARCHAR(50) o Postgres estourava 22001 e o grupo era
-- criado sem o registro de viagem. Ampliar e um widen, nao perde dados.

ALTER TABLE "viagem" ALTER COLUMN "via_partida" TYPE VARCHAR(255);
ALTER TABLE "viagem" ALTER COLUMN "via_destino" TYPE VARCHAR(255);