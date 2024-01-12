resource "aws_instance" "main_instance1" {
    ami =  var.ami
    instance_type = var.instance_type
    key_name = var.key_pair
    subnet_id = aws_subnet.main_public_subnet1.id
    availability_zone = var.availability_zone["a"]
    security_groups = [aws_security_group.security-group-rule.id]

    connection {
        type = "ssh"
        host = "self.public_ip"
        user = "ubuntu"
        private_key = file("/home/vagrant/eu-central-key.pem")
        #private_key = file(var.eu-central-key)
    }

    tags = {
        Name = "main_instance1"
        source = "terraform"
    }
}

resource "aws_instance" "main_instance2" {
    ami =  var.ami
    instance_type = var.instance_type
    key_name = var.key_pair
    subnet_id = aws_subnet.main_public_subnet2.id
    availability_zone = var.availability_zone["b"]
    security_groups = [aws_security_group.security-group-rule.id]

    connection {
        type = "ssh"
        host = "self.public_ip"
        user = "ubuntu"
        private_key = file("/home/vagrant/eu-central-key.pem")
        #private_key = file(var.eu-central-key)
    }

    tags = {
        Name = "main_instance2"
        source = "terraform"
    }
}

resource "aws_instance" "main_instance3" {
    ami =  var.ami
    instance_type = var.instance_type
    key_name = var.key_pair
    subnet_id = aws_subnet.main_public_subnet3.id
    availability_zone = var.availability_zone["c"]
    security_groups = [aws_security_group.security-group-rule.id]

    connection {
        type = "ssh"
        host = "self.public_ip"
        user = "ubuntu"
        private_key = file("/home/vagrant/eu-central-key.pem") 
        #private_key = file(var.eu-central-key)
    }

    tags = {
        Name = "main_instance3"
        source = "terraform"
    }
}

resource "local_file" "IP_address" {
    filename = "/vagrant/terraform_folder/mini_project/host-inventory.ini"
    content = <<EOF
    [web_servers]
    main_instance1 ansible_host=${aws_instance.main_instance1.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=/home/vagrant/eu-central-key.pem
    main_instance2 ansible_host=${aws_instance.main_instance2.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=/home/vagrant/eu-central-key.pem
    main_instance3 ansible_host=${aws_instance.main_instance3.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=/home/vagrant/eu-central-key.pem
    EOF
}