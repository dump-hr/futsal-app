terraform {
  required_version = ">= 1.0.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }

    sops = {
      source  = "carlpett/sops"
      version = "~> 0.5"
    }
  }

  backend "s3" {
    bucket         = "futsal-app-tfstate"
    dynamodb_table = "futsal-app-tfstate-lock"
    region         = "us-east-1"
    profile        = "futsal-app"
    encrypt        = true
  }
}

provider "aws" {
  region  = "eu-central-1"
  profile = "futsal-app"
}

provider "aws" {
  alias   = "us-east-1"
  region  = "us-east-1"
  profile = "futsal-app"
}

provider "cloudflare" {
  api_token = data.sops_file.secrets.data["cloudflare_api_token"]
}

data "cloudflare_zone" "dump_hr" {
  name = "dump.hr"
}

data "sops_file" "secrets" {
  source_file = "secrets.enc.json"
}

module "uploads" {
  source = "../../../modules/static-website"

  bucket_name        = "futsal-app-uploads"
  bucket_versioning  = true
  website_domain     = "futsal-app-uploads.dump.hr"
  cloudflare_zone_id = data.cloudflare_zone.dump_hr.id

  tags = {
    Project     = "futsal-app"
    Role        = "uploads"
    Environment = "shared"
  }

  providers = {
    aws.us-east-1 = aws.us-east-1
  }
}
