resource "aws_lb" "load-balancer" {
    name = "load-balancer"
    internal = false
    load_balancer_type = "application"
    security_groups = [aws_security_group.load-balancer-sg.id]
    subnets = [aws_subnet.main_public_subnet1.id, aws_subnet.main_public_subnet2.id, aws_subnet.main_public_subnet3.id]
    enable_deletion_protection = false
    depends_on = [aws_instance.main_instance1, aws_instance.main_instance2, aws_instance.main_instance3]
}

resource "aws_lb_target_group" "main-target-group" {
 name = "main-target-group"
 target_type = "instance"
 port = 80
 protocol = "HTTP"
 vpc_id = aws_vpc.main_vpc.id

 health_check {
    path = "/health"
    protocol = "HTTP"
    matcher = "200"
    interval = 15
    timeout = 3
    healthy_threshold = 3
    unhealthy_threshold = 3
 }   
}

resource "aws_lb_listener" "main_listener" {
    load_balancer_arn = aws_lb.load-balancer.arn
    port = 80
    protocol = "HTTP"

    default_action {
        type = "forward"
        target_group_arn = aws_lb_target_group.main-target-group.arn
    }
}

resource "aws_lb_listener_rule" "main_listener_rule" {
 listener_arn  = aws_lb_listener.main_listener.arn
 priority = 1

 action {
    type = "forward"
    target_group_arn = aws_lb_target_group.main-target-group.arn
 }
    condition {
        path_pattern {
            values = ["/"]
        }
    }
}

resource "aws_lb_target_group_attachment" "main_lb_target_group_attachment1" {
   target_group_arn = aws_lb_target_group.main-target-group.arn
   target_id = aws_instance.main_instance1.id
   port = 80
}

resource "aws_lb_target_group_attachment" "main_lb_target_group_attachment2" {
   target_group_arn = aws_lb_target_group.main-target-group.arn
   target_id = aws_instance.main_instance2.id
   port = 80
}

resource "aws_lb_target_group_attachment" "main_lb_target_group_attachment3" {
   target_group_arn = aws_lb_target_group.main-target-group.arn
   target_id = aws_instance.main_instance3.id
   port = 80
}