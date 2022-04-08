#! /usr/bin/env zsh

PKG_DIR=$(yarn -q dlx pkg-dir-cli)
GEN_PATH="backend/open-weather"
ABS_PATH="$PKG_DIR/$GEN_PATH"
OUT_PATH="$ABS_PATH/types"

INDEX_PATH=$OUT_PATH/index.ts

mkdir -p $OUT_PATH

function generate() {
  out_file=$1
  url=$2

  yarn -q dlx quicktype -o "$OUT_PATH/$out_file" $url
}

generate 'one-call-response-type.ts' $($ABS_PATH/one-call.main.ts url)
