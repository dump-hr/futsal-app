terraform {
  required_version = ">= 1.0.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
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

locals {
  github_repository = "dump-hr/futsal-app"
  deploy_branches   = ["main"]
  uploads_bucket    = "futsal-app-uploads"
  dev_bucket        = "futsal-app-uploads-dev"

  tags = {
    Project     = "futsal-app"
    Environment = "shared"
    ManagedBy   = "terraform"
  }
}

data "aws_kms_alias" "sops" {
  provider = aws.us-east-1
  name     = "alias/futsal-app"
}

data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

data "aws_iam_policy_document" "github_deploy_trust" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [data.aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = [for branch in local.deploy_branches : "repo:${local.github_repository}:ref:refs/heads/${branch}"]
    }
  }
}

data "aws_iam_policy_document" "github_deploy" {
  statement {
    actions   = ["kms:Decrypt"]
    resources = [data.aws_kms_alias.sops.target_key_arn]
  }

  statement {
    actions   = ["ec2:DescribeInstances"]
    resources = ["*"]
  }
}

resource "aws_iam_role" "github_deploy" {
  name                 = "futsal-app-github-deploy"
  assume_role_policy   = data.aws_iam_policy_document.github_deploy_trust.json
  max_session_duration = 3600

  tags = local.tags
}

resource "aws_iam_role_policy" "github_deploy" {
  name   = "deploy"
  role   = aws_iam_role.github_deploy.id
  policy = data.aws_iam_policy_document.github_deploy.json
}

data "aws_iam_policy_document" "api_trust" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "api" {
  statement {
    actions   = ["s3:PutObject"]
    resources = ["arn:aws:s3:::${local.uploads_bucket}/*"]
  }
}

resource "aws_iam_role" "api" {
  name               = "futsal-app-api"
  assume_role_policy = data.aws_iam_policy_document.api_trust.json

  tags = local.tags
}

resource "aws_iam_role_policy" "api" {
  name   = "uploads"
  role   = aws_iam_role.api.id
  policy = data.aws_iam_policy_document.api.json
}

resource "aws_iam_instance_profile" "api" {
  name = "futsal-app-api"
  role = aws_iam_role.api.name

  tags = local.tags
}

data "aws_iam_policy_document" "dev" {
  statement {
    actions   = ["s3:PutObject"]
    resources = ["arn:aws:s3:::${local.dev_bucket}/*"]
  }
}

resource "aws_iam_user" "dev" {
  name = "futsal-app-dev"

  tags = local.tags
}

resource "aws_iam_user_policy" "dev" {
  name   = "uploads-dev"
  user   = aws_iam_user.dev.name
  policy = data.aws_iam_policy_document.dev.json
}

output "github_deploy_role_arn" {
  value = aws_iam_role.github_deploy.arn
}

output "api_instance_profile" {
  value = aws_iam_instance_profile.api.name
}
