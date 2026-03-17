# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes    |

## Reporting a Vulnerability

If you discover a security vulnerability in Grudgekeeper, please **do not** open a public GitHub issue.

Instead, report it privately by opening a [GitHub Security Advisory](https://github.com/ZintelFelix/grudgekeeper/security/advisories/new).

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact

I will respond as soon as possible and aim to release a fix within 14 days of confirmation.

## Scope

Since Grudgekeeper is a local desktop app with no server, no user accounts and no network requests beyond the GitHub update check, the attack surface is minimal. Relevant security concerns would include:

- Malicious CSV injection via edited data files
- Electron security misconfigurations
- The GitHub API update check being hijacked

## Out of scope

- Issues in third-party dependencies (please report those upstream)
- Bugs that are not security-related (open a regular issue instead)