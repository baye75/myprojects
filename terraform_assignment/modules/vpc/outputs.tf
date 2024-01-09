output "region" {
  value = var.region
}

output "project_name" {
  value = var.project_name
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.main.public_ip
}
