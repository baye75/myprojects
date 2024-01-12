output "vpc_id" {
    value = aws_vpc.main_vpc.id
}

output "elb_load_balancer_dns_name" {
    value = aws_lb.load-balancer.dns_name
}

output "instance1_public_ip" {
  description = "Public IP address of the instance 1"
  value       = aws_instance.main_instance1.public_ip
}

output "instance2_public_ip" {
  description = "Public IP address of the instance 2"
  value       = aws_instance.main_instance2.public_ip
}

output "instance3_public_ip" {
  description = "Public IP address of the instance 3"
  value       = aws_instance.main_instance3.public_ip
}