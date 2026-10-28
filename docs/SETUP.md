# Personal setup and deployment

## Current repository

Personal remote: `git@github.com:TangoJamaicaFoxtrot/TheLedger.git`

Author: Tyler Fox <tylerjoelfox@gmail.com>. These settings are local to this repository. Global work identity and credential helpers are unchanged. The local SSH command ignores shared SSH configuration and agent identities and explicitly selects `~/.ssh/id_ed25519_ledger`.

An unauthenticated HTTPS read confirmed the remote is currently readable and contains no refs. SSH write access remains unverified. Check history again before the first push; do not force-push or overwrite new remote history.

## Finish SSH registration

In VS Code's terminal, create the dedicated key interactively. Set a passphrase when prompted. Do not paste the passphrase or private key into chat.

```sh
ssh-keygen -t ed25519 -C tylerjoelfox@gmail.com -f ~/.ssh/id_ed25519_ledger
pbcopy < ~/.ssh/id_ed25519_ledger.pub
```

If that key already exists, use it; do not overwrite it. In your **personal** GitHub account, Settings → SSH and GPG keys → New SSH key, paste the public key as an authentication key.

Verify GitHub's host fingerprint against its official documentation before accepting a new host key. Test the exact identity used by this repository:

```sh
ssh -F /dev/null -o IdentitiesOnly=yes -o IdentityAgent=none -i ~/.ssh/id_ed25519_ledger -T git@github.com
```

The greeting must say `Hi TangoJamaicaFoxtrot!`. GitHub normally exits with code 1 even on successful authentication. Stop if it names another account.

## Inspect remote history and prepare the first commit

```sh
npm run check:identity
git ls-remote origin
git fetch origin
git branch -r
```

If the remote has history, inspect it and reconcile with the scaffold before committing. If `origin/main` exists and local HEAD is still unborn, `git reset --mixed origin/main` adopts the existing history while leaving scaffold files in place; review the resulting changes, especially any existing README/licence. If another default branch exists, use that branch instead after inspection. Never use `reset --hard` here.

For an empty remote, or after reconciling its history:

```sh
npm run typecheck
npm run build
git status --short
git add app components lib scripts docs .vscode .gitignore package.json package-lock.json tsconfig.json next-env.d.ts README.md AGENTS.md
git diff --cached --stat
git diff --cached
git commit -m "Scaffold The Ledger personal study"
git push --dry-run origin main
git push -u origin main
```

Identity hooks are enabled locally with `core.hooksPath=scripts/hooks`. They guard routine commits/pushes; they are not an access-control boundary. A new clone must configure its local personal identity, expected email, SSH command and hooks before committing. Use the same configuration as this checkout; never change global work settings.

## Personal Vercel deployment

Use a separate browser profile signed into personal GitHub and personal Vercel. In Vercel, choose your personal account/team before Add New → Project. Import only `TangoJamaicaFoxtrot/TheLedger`; restrict the GitHub integration to this repository. Use Next.js, root directory `.`, default build/output settings, and Node 24. No environment variables are needed for this scaffold.

Review the selected owner and repository, then deploy. This avoids switching the machine's existing work Vercel CLI session. A private GitHub repository does not by itself make the website private. This scaffold serves the app shell; user records remain in browser storage. Before adding cloud journal data, implement authentication and per-user database access, then review preview/production protection.

Use `main` for production. For later work, create a feature branch, push it, review its Vercel preview, then merge to main for production. Branch pushes and production merges can deploy automatically once connected. Do not add Vercel tokens or `.vercel` project links to Git.

Sources: [GitHub multiple accounts](https://docs.github.com/en/account-and-profile/how-tos/account-management/managing-multiple-accounts), [GitHub SSH fingerprints](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints), [Vercel Git deployments](https://vercel.com/docs/git), [Codex in VS Code](https://developers.openai.com/codex/ide/).
