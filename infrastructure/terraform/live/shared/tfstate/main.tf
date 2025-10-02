terraform {
  required_version = ">= 1.0.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "futsal-app"
}

module "tfstate_backend" {
  source = "github.com/bdeak4/terraform-state-s3-backend"

  bucket_name = "futsal-app-tfstate"
  table_name  = "futsal-app-tfstate-lock"
}
