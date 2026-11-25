#!/usr/bin/env bash
set -euo pipefail

SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APPLIQUER="$HOME/.local/bin/sites-hermes-appliquer"
SITES="$HOME/.config/sites"
UNITES="$HOME/.config/systemd/user"
ADRESSE="http://100.75.25.89/esgi-entrainement/"

if [[ ! -x "$APPLIQUER" ]]; then
  echo "Installer d'abord hermes-sites" >&2
  exit 1
fi

mkdir -p "$SITES" "$UNITES" "$HOME/esgi-entrainement-supports" "$HOME/.local/share/esgi-entrainement"
install -m 644 "$SOURCE/esgi-entrainement.caddy" "$SITES/esgi-entrainement.caddy"
install -m 644 "$SOURCE/esgi-entrainement.json" "$SITES/esgi-entrainement.json"
install -m 644 "$SOURCE/esgi-entrainement.service" "$UNITES/esgi-entrainement.service"

systemctl --user daemon-reload
systemctl --user enable --now esgi-entrainement
systemctl --user restart esgi-entrainement

"$APPLIQUER"

if ! curl -fsS -o /dev/null --retry 10 --retry-connrefused --retry-delay 1 --retry-all-errors "$ADRESSE"; then
  echo "ESGI Entraînement ne répond pas sur $ADRESSE" >&2
  journalctl --user -u esgi-entrainement -n 20 --no-pager >&2 || true
  exit 1
fi

echo "ESGI Entraînement en ligne : http://hermes/esgi-entrainement/"
