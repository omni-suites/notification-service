#!/bin/sh
set -e
# No migrations folder — push schema on boot for PoC
npx prisma db push --skip-generate
exec npm run start:prod
