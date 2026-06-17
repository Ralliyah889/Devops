# ==================== RDS SECURITY GROUP ====================
resource "aws_security_group" "rds" {
  name        = "${var.environment}-rds-sg"
  description = "Security rules restricting PostgreSQL access"
  vpc_id      = aws_vpc.main.id

  # Allow ingress strictly from EKS worker node security groups or VPC private subnet ranges
  ingress {
    description = "Allow EKS Node Group connection"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = aws_subnet.private[*].cidr_block
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.environment}-rds-sg"
  }
}

# ==================== DB PRIVATE SUBNET GROUP ====================
resource "aws_db_subnet_group" "main" {
  name       = "${var.environment}-rds-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "${var.environment}-rds-subnet-group"
  }
}

# ==================== POSTGRESQL DB INSTANCE ====================
resource "aws_db_instance" "postgres" {
  identifier             = "omnicivilization-db-${var.environment}"
  allocated_storage      = 20
  max_allocated_storage  = 100
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.t4g.micro"
  db_name                = "omnicivilization"
  username               = "postgres"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = true
  multi_az               = false

  tags = {
    Name = "${var.environment}-postgres-rds"
  }
}
