#!/bin/bash
# Run this once in Cursor terminal after GitHub auth is set up.
set -e
cd "$(dirname "$0")"

echo "→ Pushing to https://github.com/tcyedesign/portfolio-site ..."
git push -u origin main
echo "✓ Done. Open https://github.com/tcyedesign/portfolio-site to confirm index.html is there."
