variable "region" {
  description = "AWS region"
}

variable "vpc_cidr_block" {
  description = "CIDR block for the VPC"
}

variable "subnet1_cidr_block" {
  description = "CIDR block for subnet 1"
}

variable "subnet2_cidr_block" {
  description = "CIDR block for subnet 2"
}

variable "availability_zone1" {
  description = "Availability Zone for subnet 1"
}

variable "availability_zone2" {
  description = "Availability Zone for subnet 2"
}

variable "ami" {
  description = "ID of the AMI to use for the EC2 instance"
}

variable "instance_type" {
  description = "Type of the EC2 instance"
}

variable "subnet_id" {
  description = "ID of the subnet in which to launch the instance"
}

variable "project_name" {}

variable "key_pair" {}

