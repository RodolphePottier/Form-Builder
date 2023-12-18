#!/bin/bash
set -e

host="$1"
shift
cmd="$@"

until PGPASSWORD="123" psql -h "$host" -U "postgres" -c '\q'; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "PostgreSQL is up - executing command"
npx mikro-orm migration:create
npx mikro-orm migration:up
exec $cmd
