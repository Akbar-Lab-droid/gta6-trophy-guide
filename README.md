# GTA VI Trophy Guide &amp; Tracker

[![GTA 6 Trophy Guide](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/Akbar-Lab-Droid/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/Akbar-Lab-Droid/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all 55 **Grand Theft Auto VI** trophies on PlayStation 5 — built for the [make.fun bounty "Build the best GTA 6 trophy guide"](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

A static web app under `app/` that works with the network off:

- **All 55 trophies** with their official name, description and grade (1 platinum, 2 gold, 6 silver, 46 bronze), each with a guide written for this entry, in its own words, that cites its sources.
- **Roadmap to the platinum** in 7 stages, built from the official descriptions — story first, then stranger strands, activities, collectibles, crime and money, moments, and cleanup.
- **Missable flags** — one trophy is reported as possibly missable (Positive Mental Attitude, a Chapter 1 meditation); everything else can be done after the story in free roam.
- **Tracker checklist** — tick trophies off as you earn them; progress saves in the browser (localStorage) and can be exported to a file and imported back.
- **Filters** by kind (story, missable, collectibles, activities, side quests, crime), by grade, and by search.
- **Spoiler setting** that hides the names and descriptions of story trophies until they are earned.

## Use it

Serve `app/` with any static server and open `index.html`, or run the included dev server:

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network requests. `?demo=1` opens it with sample progress (for screenshots and previews); `#trophy-17` opens one trophy's guide; `#roadmap` jumps to the roadmap.

## Where the facts come from

Names, descriptions, grades and PSN counts are the official list, as tracked by Exophase and PSNProfiles. The roadmap, the ~200-hour estimate, the 4/10 difficulty and the missable warning come from the guides cited beside each trophy (GTABase, sixshore, GTA Spotter, progressbar.gg, EGamers, PowerPyx) — cited, never copied. This guide is unofficial and not affiliated with Rockstar Games, Sony or PlayStation. No Rockstar logo, artwork or game screenshots are used anywhere in it.

## Entry

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored `vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
