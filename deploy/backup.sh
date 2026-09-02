#!/usr/bin/env bash
# Nightly backup of the DuckDB file and uploads. Add to cron on the server:
#   0 3 * * * /opt/torotech/deploy/backup.sh >> /var/log/torotech-backup.log 2>&1
set -euo pipefail
DEST=${1:-/var/backups/torotech}
mkdir -p "$DEST"
STAMP=$(date +%Y%m%d-%H%M)
docker run --rm -v torotech_torotech-data:/data:ro -v "$DEST":/backup alpine \
  tar czf "/backup/torotech-$STAMP.tar.gz" -C /data .
find "$DEST" -name 'torotech-*.tar.gz' -mtime +30 -delete
echo "backup written: $DEST/torotech-$STAMP.tar.gz"
