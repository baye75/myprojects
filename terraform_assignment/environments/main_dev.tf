module "ec2_vpc_dev" {
  source                 = "../modules/vpc/"
  region                 = "eu-west-1"
  project_name           = "dev"
  vpc_cidr_block         = "10.0.0.0/16"
  ami                    = "ami-0905a3c97561e0b69"
  instance_type          = "t2.micro"
  subnet_id              = "dev-subnet1"
  subnet1_cidr_block     = "10.0.1.0/24"
  subnet2_cidr_block     = "10.0.2.0/24"
  availability_zone1     = "eu-west-1a"
  availability_zone2     = "eu-west-1b"
  key_pair               = "eu-central-key"
}
