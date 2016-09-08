#!/bin/bash

set -euo pipefail

scriptdir=$(cd "$(dirname "$0")"; pwd)

# Check for modifications
# for dir in $(find . -maxdepth 3 -name Stylesheets); do find $dir -mtime -1; done
styledir="${1:-}"
edits="$scriptdir/css-substitutions.txt"

if [[ ! -d $styledir ]]; then
    echo "Usage: $(basename "$0") <stylesheet dir dir>"
    exit 1
fi

if [[ ! -f $edits ]]; then
    echo "Couldn't find css-substitutions.txt in $scriptdir"
    exit 1
fi

IFS=$'\n'
for file in $(find "$styledir" -iname '*.css')
do
    echo "Processing $file"
    sed -i -f "${edits}" "$file" || true
done

for file in $(find "$styledir" -iname '*.scss')
do
    echo "Processing $file"
    sed -i -f "${edits}" "$file" || true
done
