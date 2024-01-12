terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = "eu-central-1"
}

resource "aws_vpc" "main_vpc" {
  cidr_block           = "10.0.0.0/16"
  instance_tenancy     = "default"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "main_vpc"
  }
}

resource "aws_internet_gateway" "main_internet_gateway" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Name = "main_internet_gateway"
  }
}

resource "aws_route_table" "main_public_route_table" {
  vpc_id = aws_vpc.main_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_internet_gateway.id
  }

  tags = {
    Name = "main_public_route_table"
  }
}

resource "aws_subnet" "main_public_subnet1" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "eu-central-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "main_public_subnet1"
  }
}

resource "aws_subnet" "main_public_subnet2" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "eu-central-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "main_public_subnet2"
  }
}

resource "aws_subnet" "main_public_subnet3" {
  vpc_id                  = aws_vpc.main_vpc.id
  cidr_block              = "10.0.3.0/24"
  availability_zone       = "eu-central-1c"
  map_public_ip_on_launch = true

  tags = {
    Name = "main_public_subnet3"
  }
}

# ASSOCIATING THE PUBLIC SUBNET1 TO THE PUBLIC ROUTE TABLE
resource "aws_route_table_association" "public_subnet1_route_table_association" {
  subnet_id      = aws_subnet.main_public_subnet1.id
  route_table_id = aws_route_table.main_public_route_table.id
}

# ASSOCIATING THE PUBLIC SUBNET2 TO THE PUBLIC ROUTE TABLE
resource "aws_route_table_association" "public_subnet2_route_table_association" {
  subnet_id      = aws_subnet.main_public_subnet2.id
  route_table_id = aws_route_table.main_public_route_table.id
}

# ASSOCIATING THE PUBLIC SUBNET3 TO THE PUBLIC ROUTE TABLE
resource "aws_route_table_association" "public_subnet3_route_table_association" {
  subnet_id      = aws_subnet.main_public_subnet3.id
  route_table_id = aws_route_table.main_public_route_table.id
}

resource "aws_network_acl" "main_network_acl" {
  vpc_id = aws_vpc.main_vpc.id
  subnet_ids = [aws_subnet.main_public_subnet1.id, aws_subnet.main_public_subnet2.id, aws_subnet.main_public_subnet3.id]
  
  ingress {
    rule_no = 100
    protocol    = "-1"
    action = "allow"
    cidr_block = "0.0.0.0/0"
    from_port   = 0
    to_port     = 0
  }

egress {
    rule_no = 100
    protocol    = "-1"
    action = "allow"
    cidr_block = "0.0.0.0/0"
    from_port   = 0
    to_port     = 0
  }

}