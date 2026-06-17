# ==================== S3 BACKUP TELEMETRY BUCKET ====================
resource "aws_s3_bucket" "backup" {
  bucket        = "${var.backup_bucket_prefix}-${var.environment}"
  force_destroy = true

  tags = {
    Name = "${var.backup_bucket_prefix}-${var.environment}"
  }
}

# ==================== VERSIONING CONTROL ====================
resource "aws_s3_bucket_versioning" "backup" {
  bucket = aws_s3_bucket.backup.id
  versioning_configuration {
    status = "Enabled"
  }
}

# ==================== SERVER SIDE ENCRYPTION ====================
resource "aws_s3_bucket_server_side_encryption_configuration" "backup" {
  bucket = aws_s3_bucket.backup.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ==================== PRIVATE ACCESS ENFORCEMENT ====================
resource "aws_s3_bucket_public_access_block" "backup" {
  bucket = aws_s3_bucket.backup.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
