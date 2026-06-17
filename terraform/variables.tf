variable "aws_region" {
  type        = string
  description = "AWS region for provisioning resources"
  default     = "us-west-2"
}

variable "environment" {
  type        = string
  description = "Deployment environment name"
  default     = "production"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the main VPC"
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  type        = list(string)
  description = "Availability zones to span subnets across"
  default     = ["us-west-2a", "us-west-2b"]
}

variable "eks_cluster_name" {
  type        = string
  description = "EKS cluster name identifier"
  default     = "omni-civilization-cluster"
}

variable "db_password" {
  type        = string
  description = "Administrator password for EKS-attached RDS PostgreSQL"
  default     = "OmniSecurePass1424!"
  sensitive   = true
}

variable "backup_bucket_prefix" {
  type        = string
  description = "Prefix identifier for the backup bucket"
  default     = "omni-civilization-telemetry-backup"
}
