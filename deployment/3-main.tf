terraform {
  backend "s3" {
    bucket = "socialscamnet-terraform-state" # Your unique AWS S3 bucket
    # create a sub-folder called develop
    key     = "develop/socialscamnet.tfstate" # 
    region  = "ap-southeast-1"                # Your AWS region
    encrypt = true
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"

  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    ManagedBy   = "Terraform"
    Owner       = "Cristian Lopez Empillo" # Your fullname
  }
}


