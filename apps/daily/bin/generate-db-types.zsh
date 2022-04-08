#! /usr/bin/env zsh

SOURCE_PATH=$1

PKG_DIR=$(yarn -q dlx pkg-dir-cli)
GEN_PATH="backend"
ABS_PATH="$PKG_DIR/$GEN_PATH"
OUT_PATH="$ABS_PATH/types"

INDEX_PATH=$OUT_PATH/index.ts

mkdir -p $OUT_PATH

function generate() {
  out_file=$1
  source_file=$2

  yarn -q dlx quicktype -o "$OUT_PATH/$out_file" $source_file
  echo "export * from './$out_file';\n" >>$INDEX_PATH
}

generate 'db.types.ts' $SOURCE_PATH
