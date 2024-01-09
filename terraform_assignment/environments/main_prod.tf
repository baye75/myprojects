module "ec2_vpc_prod" {
  source                 = "../modules/vpc/"
  region                 = "eu-central-1"
  project_name           = "prod"
  vpc_cidr_block         = "10.0.0.0/16"
  ami                    = "ami-0faab6bdbac9486fb"
  instance_type          = "t2.micro"
  subnet_id              = "prod-subnet1"
  subnet1_cidr_block     = "10.0.1.0/24"
  subnet2_cidr_block     = "10.0.2.0/24"
  availability_zone1     = "eu-central-1a"
  availability_zone2     = "eu-central-1b"
  key_pair               = "eu-central-key"
}
