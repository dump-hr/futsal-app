data "aws_instance" "monitoring" {
  filter {
    name   = "tag:Role"
    values = ["monitoring"]
  }

  filter {
    name   = "instance-state-name"
    values = ["running"]
  }
}
