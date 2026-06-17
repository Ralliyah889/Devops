output "vpc_id" {
  value       = aws_vpc.main.id
  description = "The ID of the main VPC"
}

output "public_subnets" {
  value       = aws_subnet.public[*].id
  description = "The IDs of the public subnets"
}

output "private_subnets" {
  value       = aws_subnet.private[*].id
  description = "The IDs of the private subnets"
}

output "eks_cluster_name" {
  value       = aws_eks_cluster.main.name
  description = "EKS cluster name identifier"
}

output "eks_cluster_endpoint" {
  value       = aws_eks_cluster.main.endpoint
  description = "Endpoint API URL for EKS cluster"
}

output "rds_endpoint" {
  value       = aws_db_instance.postgres.endpoint
  description = "The connection endpoint for the PostgreSQL RDS instance"
}

output "rds_database_name" {
  value       = aws_db_instance.postgres.db_name
  description = "PostgreSQL default database name"
}

output "backup_s3_bucket_name" {
  value       = aws_s3_bucket.backup.id
  description = "The name of the S3 telemetry backup bucket"
}
