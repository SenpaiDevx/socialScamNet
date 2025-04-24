variable "aws_region" {
  description = "Region in which AWS resources are created"
  type        = string
  default     = "ap-southeast-1" # Your AWS region
}

variable "vpc_cidr_block" { # cidr means classes inter-domain routing , it is a 32 bit number, it is used to define the network range, internet protocol for assigning ip addresses on vpc's
  description = "VPC CIDR Block"
  type        = string
  default     = "10.0.0.0/16" # Your VPC CIDR Block total of 65,536
}

variable "vpc_availability_zones" {
  description = "VPC Availability Zones"
  type        = list(string)
  default     = ["ap-southeast-1a", "ap-southeast-1b"] # Two availability zones for your specific region
}

variable "vpc_public_subnets" {      # allow public and private subnets to connect with the internet
  description = "VPC Public Subnets" # example database services postgress not allow in public but except for private 
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"] # public subnet allow internet to any service to launch
}

variable "vpc_private_subnets" {
  description = "VPC Private Subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "global_destination_cidr_block" { # allow internet access traffic it either specific or all ip address 
  description = "CIDR Block for all IPs"
  type        = string
  default     = "0.0.0.0/0" #targeting all ip address allowing internet traffic
}

variable "bastion_host_cidr" {                        # is an ec2 instance, to get an access to service that is running in private subnets
  description = "CIDR Block for Bastion Host Ingress" # ex: elastic cache and redis is not allow lauch in a subnet that have internet like public subnet
  type        = string
  default     = "0.0.0.0/0" # Your <IP address>/32
}

variable "https_ssl_policy" {
  description = "HTTPS SSL Policy"
  type        = string
  default     = "ELBSecurityPolicy-2016-08"
}

variable "main_api_server_domain" {
  description = "Main API Server Domain"
  type        = string
  default     = "socialscamnet.space" # Your backend domain you created a route53 zone for
}

variable "dev_api_server_domain" {
  description = "Dev API Server Domain"
  type        = string
  default     = "api.dev.socialscamnet.space"
}

variable "ec2_iam_role_name" {
  description = "EC2 IAM Role Name"
  type        = string
  default     = "socialscamnet-server-ec2-role" # Add a unique name
}

variable "ec2_iam_role_policy_name" {
  description = "EC2 IAM Role Policy Name"
  type        = string
  default     = "socialscamnet-server-ec2-role-profile" # Add a unique name
}

variable "ec2_instance_profile_name" {
  description = "EC2 Instance Profile Name"
  type        = string
  default     = "socialscamnet-server-ec2-instance-profile" # Add a unique name
}

variable "elasticache_node_type" {
  description = "Elasticache Node Type"
  type        = string
  default     = "cache.t2.micro"
}

variable "elasticache_parameter_group_name" {
  description = "Elasticache Parameter Group Name"
  type        = string
  default     = "default.redis7"
}

variable "ec2_instance_type" {
  description = "EC2 Instance Type"
  type        = string
  default     = "t2.medium"
}

variable "bastion_host_type" {
  description = "Bastion Instance Type"
  type        = string
  default     = "t2.micro"
}

variable "code_deploy_role_name" {
  description = "CodeDeploy IAM Role"
  type        = string
  default     = "socialscamnet-server-codedeploy-role" # Add a unique name
}

variable "prefix" {
  description = "Prefix to be added to AWS resources tags"
  type        = string
  default     = "socialscamnet-server" # Add a unique identifier name
}

variable "project" {
  description = "Prefix to be added to AWS resources local tags"
  type        = string
  default     = "socialscamnet-server" # You can use the name unique identifier created above
}
