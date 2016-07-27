#!/bin/bash

set -euo pipefail

scriptdir=$(cd "$(dirname "$0")"; pwd)

# Check for modifications
# for dir in $(find . -maxdepth 3 -name Stylesheets); do find $dir -mtime -1; done
mountothersites="${1:-}"
backendhost="${2:-}"
edits="$scriptdir/css-substitutions.txt"

if [[ ! -d $mountothersites ]]; then
    echo "Usage: $(basename "$0") <other site dir> <backend site host name>"
    exit 1
fi

if [[ -z $backendhost ]]; then
    echo "Usage: $(basename "$0") <other site dir> <backend site host name>"
    exit 1
fi

if [[ ! -f $edits ]]; then
    echo "Couldn't find css-substitutions.txt in $scriptdir"
    exit 1
fi

IFS=$'\n'
for file in $(find "$mountothersites"/*/Web/Stylesheets -iname '*.css' -not -path "*/$backendhost/Web/Stylesheets/*")
do
    echo "Processing $file"
    sed -i -f "${edits}" "$file" || true
done
