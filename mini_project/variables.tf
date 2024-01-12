variable "ami" {
    default = "ami-0faab6bdbac9486fb"
    type    = string
}

variable "instance_type" {
    default = "t2.micro"
    type    = string
}

variable "availability_zone" {
    type    = map(any)
    default = {
        "a" = "eu-central-1a"
        "b" = "eu-central-1b"
        "c" = "eu-central-1c"
    }    
}

variable "key_pair" {
    default = "eu-central-key"
}