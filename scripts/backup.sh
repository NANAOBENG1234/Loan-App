#!/bin/bash

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

# Backup PostgreSQL
docker exec loan-platform-postgres-1 pg_dump -U postgres loan_platform > "$BACKUP_DIR/db_$TIMESTAMP.sql"

# Backup uploads
tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" ./server/uploads 2>/dev/null

echo "Backup completed: $BACKUP_DIR"
