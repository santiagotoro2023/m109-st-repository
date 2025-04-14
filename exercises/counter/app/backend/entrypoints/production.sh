#!/bin/sh
set -e

umask 0002

echo "WAITING FOR DATABASE DB_HOST = $DB_HOST"
./entrypoints/wait-for.sh $DB_HOST:5432

npx sequelize-cli db:create || true
npx sequelize-cli db:migrate --migrations-path src/migrations || true
npx sequelize-cli db:seed:all --seeders-path src/seeders || true

exec "$@"
