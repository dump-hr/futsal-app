#!/bin/sh

ENV=$1
ACTION=$2

if [ -z "$ENV" ] || [ -z "$ACTION" ]; then
  echo "Usage: $0 <env> <load|unload>"
  exit 1
fi

cd -P -- "$(dirname -- "$0")" || exit 1

case "$ACTION" in
load)
  if [ ! -f "../ssh-keys/$ENV.enc" ]; then
    echo "SSH key '../ssh-keys/$ENV.enc' does not exist" >&2
    exit 1
  fi

  key=$(sops -d "../ssh-keys/$ENV.enc") || {
    echo "Failed to decrypt SSH key '../ssh-keys/$ENV.enc'" >&2
    exit 1
  }

  output=$(printf '%s\n' "$key" | ssh-add - 2>&1) || {
    echo "Failed to add SSH key for '$ENV' to ssh-agent: $output" >&2
    exit 1
  }
  ;;
unload)
  output=$(ssh-add -d "../ssh-keys/$ENV.pub" 2>&1) || {
    echo "Failed to remove SSH key for '$ENV' from ssh-agent: $output" >&2
    exit 1
  }
  ;;
*)
  echo "Usage: $0 <env> <load|unload>"
  exit 1
  ;;
esac
