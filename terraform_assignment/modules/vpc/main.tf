terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = var.region
}

resource "aws_vpc" "vpc" {
  cidr_block           = var.vpc_cidr_block
  instance_tenancy     = "default"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# CREATING INTERNET GATEWAY TO BE ATTACHED TO THE VPC

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

resource "aws_subnet" "subnet1" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = var.subnet1_cidr_block
  availability_zone       = var.availability_zone1
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-subnet1"
  }
}

resource "aws_subnet" "subnet2" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = var.subnet2_cidr_block
  availability_zone       = var.availability_zone2
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-subnet2"
  }
}

# CREATING A ROUTE TABLE AND ADDING A PUBLIC ROUTE

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }

  tags = {
    Name = "${var.project_name}-public-route-table"
  }
}

# ASSOCIATING THE PUBLIC SUBNET1 TO THE PUBLIC ROUTE TABLE
resource "aws_route_table_association" "public_subnet1_route_table_association" {
  subnet_id      = aws_subnet.subnet1.id
  route_table_id = aws_route_table.public_route_table.id
}

# ASSOCIATING THE PUBLIC SUBNET2 TO THE PUBLIC ROUTE TABLE
resource "aws_route_table_association" "public_subnet2_route_table_association" {
  subnet_id      = aws_subnet.subnet2.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_instance" "main" {
  ami                         = var.ami
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.subnet1.id
  key_name                    = var.key_pair
  security_groups             = [aws_security_group.security_group.id]
  associate_public_ip_address = true

  connection {
    type = "ssh"
    user = "ubuntu"
    private_key                 = file("/home/vagrant/eu-central-key-key.pem")
  }

user_data = <<-EOT
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install docker.io -y
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo apt install ansible -y
              EOT

  tags = {
    Name = "${var.project_name}-instance"
  }
}
