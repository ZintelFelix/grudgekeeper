# Contributing to Grudgekeeper

Thanks for taking the time to contribute! Here's how you can help.

---

## Ways to contribute

### Fix or add faction data
The easiest way to contribute — no coding knowledge required. All campaign and lord data lives in two CSV files:

- `public/data/roadmap.csv` — faction entries with tips, difficulty ratings and key mechanics
- `public/data/races.csv` — Legendary Lords with race, DLC and icon info

You can edit these directly in the GitHub browser editor. Just open the file, click the pencil icon and submit a Pull Request.

**Good first contributions:**
- Fix an incorrect difficulty rating
- Add a missing Legendary Lord to `races.csv`
- Improve a campaign tip or key mechanic description
- Add a missing faction entry to `roadmap.csv`

### Report a bug
Open an [issue](https://github.com/ZintelFelix/grudgekeeper/issues) and describe:
- What you expected to happen
- What actually happened
- Your Windows version

### Suggest a feature
Open an [issue](https://github.com/ZintelFelix/grudgekeeper/issues) with the label `enhancement` and describe what you'd like to see and why it would be useful.

### Improve the code
1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test locally with `npm run electron:dev`
5. Commit: `git commit -m "Brief description of change"`
6. Push and open a Pull Request

---

## Guidelines

- Keep Pull Requests focused — one change per PR makes reviewing easier
- For data changes, double-check accuracy against the [Total War Wiki](https://totalwar.wiki.gg)
- Be respectful — see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

---

## Development setup

```bash
git clone https://github.com/ZintelFelix/grudgekeeper.git
cd grudgekeeper
npm install
npm run electron:dev
```

---

Thanks for helping make Grudgekeeper better!