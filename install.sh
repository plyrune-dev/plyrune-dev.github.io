#!/bin/sh
# Install the pinned Plyrune preview for Linux x86-64. No sudo or shell profile edits.
set -eu
main() {
    case "$(uname -s)/$(uname -m)" in Linux/x86_64) ;; *)
        echo 'Plyrune preview binaries currently support Linux x86-64 (including WSL2) only.' >&2
        exit 1;;
    esac
    dir=${PLYRUNE_INSTALL_DIR:-"$HOME/.local/bin"}
    case "$dir" in /*) ;; *) echo 'PLYRUNE_INSTALL_DIR must be absolute.' >&2; exit 1;; esac
    version=v0.0.1-preview.1
    asset=plyrune-linux-x86_64
    sha=82646d5bc43ec0fb243cd364a63de90686ff5057ab259b65dcb036ad458113b6
    url="https://github.com/plyrune-dev/plyrune/releases/download/$version/$asset"
    printf 'Installing %s from %s to %s/plyrune\n' "$version" "$url" "$dir"
    mkdir -p -- "$dir"
    work=$(mktemp -d -- "$dir/.plyrune-install.XXXXXXXX")
    trap 'rm -rf -- "$work"' EXIT
    trap 'exit 1' HUP INT TERM
    curl --proto '=https' --proto-redir '=https' -fsSL "$url" -o "$work/$asset"
    (cd "$work" && printf '%s  %s\n' "$sha" "$asset" | sha256sum -c -)
    chmod 755 "$work/$asset"
    "$work/$asset" --version
    mv -fT -- "$work/$asset" "$dir/plyrune"
    printf 'Try: "%s/plyrune" demo\n' "$dir"
}
main "$@"
