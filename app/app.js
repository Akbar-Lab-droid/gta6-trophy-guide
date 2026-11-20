// GTA VI Trophy Guide & Tracker — offline checklist over the official 55 trophies.
// Loads app/data/trophies.json, saves earned ticks in localStorage, and renders the
// roadmap, the filters, the spoiler setting and each trophy's cited guide.
const STORAGE_KEY = 'gta6-trophy-checklist';
const DEMO_EARNED = [8, 15, 16, 17, 19, 21, 28, 30, 35, 42, 46, 55];

const SOURCES = {
  gtabase: { label: 'GTABase — GTA 6 Trophy Guide & Achievements List (full list, roadmap, tips)', url: 'https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series' },
  sixshore: { label: 'sixshore — GTA 6 Trophy and Achievement List: All 55, Missables and Roadmap', url: 'https://sixshore.com/gta-6/guides/trophies-and-achievements/' },
  gtaspotter: { label: 'GTA Spotter — GTA VI trophies and achievements: the full official list', url: 'https://gtaspotter.com/en/guides/gta-6-trophies-and-achievements/' },
  progressbar: { label: 'progressbar.gg — GTA 6 Trophies and Achievements (checklist)', url: 'https://progressbar.gg/gta6/trophies/' },
  egamers: { label: 'EGamers — GTA 6 Trophy List: All 55 Trophies and Achievements', url: 'https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/' },
  powerpyx: { label: 'PowerPyx — GTA 6 Trophy Guide (roadmap, difficulty 4/10, about 200 hours to the platinum)' },
  exophase: { label: 'Exophase — Grand Theft Auto VI trophy list (official names, descriptions, grades and PSN counts)' },
  psnprofiles: { label: 'PSNProfiles — Grand Theft Auto VI trophy list (official names, descriptions, grades and PSN counts)' },
};

const ROADMAP = [
  { n: 1, title: 'Stage 1 — Play the story', text: 'Chapters 1–4, the named missions, and the final mission. One playthrough is enough and there is no mission replay, so grab the possibly-missable meditation (Positive Mental Attitude) as you go — especially the Chapter 1 spot with Lucia.', ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { n: 2, title: 'Stage 2 — Stranger strands', text: 'Finish the side questlines for Andy, Kenton, Billy, Randy, Tyrone and Bret, and complete 8 strands for Strangers & Freaks. All doable after the story.', ids: [22, 23, 24, 25, 26, 27, 29] },
  { n: 3, title: 'Stage 3 — Activities & challenges', text: 'Try all 9 activity types, gold the 42 shooting-range challenges, win drone races at all 14 spots and 20 races, beat Cal at fishing, finish an arcade game, bowl a game, and complete 50 of the 80 challenges.', ids: [15, 16, 17, 18, 19, 20, 21, 32, 46] },
  { n: 4, title: 'Stage 4 — Collectibles', text: 'Meditate at all 18 spots, finish 3 of the 18 card sets, WAiNK It at 100 spots, discover 100 vehicles, explore all 52 areas, buy all 8 garages, register 10 vehicles.', ids: [28, 30, 31, 35, 42, 54, 55] },
  { n: 5, title: 'Stage 5 — Crime & money', text: 'Partner robberies, 5 bank vaults (of 8), an armored truck, a jewelry store, one illegal operation per gang (9 gangs), launder $250,000 of marked bills, spend $100,000, and 5 takedowns in one Combat Focus.', ids: [33, 34, 36, 39, 40, 41, 43, 52, 53] },
  { n: 6, title: 'Stage 6 — Moments & odd jobs', text: 'The one-off moments the descriptions hint at: the VCIA departure, the Rhino tanks, the Ocean Beach cocktail, the showroom smash, the bowling alley, the partnership, the choices, the second try, the strange event, and the melee drive-by.', ids: [37, 38, 44, 45, 47, 48, 49, 50, 51] },
  { n: 7, title: 'Stage 7 — Cleanup & platinum', text: 'Reach 100% completion (A Long Road), then the platinum pops. Around 200 hours all in, difficulty 4/10. Keep cheats off — they disable trophies and saving.', ids: [14, 1] },
];

const params = new URLSearchParams(location.search);
const demoMode = params.get('demo') === '1';
const spoilerParam = params.get('spoiler') === '1';
const view = params.get('view');
if (view === 'roadmap' || view === 'guide' || view === 'tracker') {
  document.body.classList.add(`view-${view}`);
}

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const byName = new Map(trophies.map((t) => [t.name, t]));

let earned = new Set(loadEarnedNames());
if (demoMode) earned = new Set(DEMO_EARNED.map((id) => byId.get(id).name));
let kindFilter = 'all';
let gradeFilter = 'all';
let query = '';

const rowsEl = document.getElementById('rows');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const spoilerEl = document.getElementById('spoiler');
const detailEl = document.getElementById('detail');

function loadEarnedNames() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) ? saved.filter((n) => byName.has(n)) : [];
  } catch {
    return [];
  }
}

function saveEarned() {
  if (demoMode) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned]));
}

function isHiddenBySpoiler(t) {
  return spoilerEl.checked && t.kind === 'story' && !earned.has(t.name);
}

function sourceLinks(t) {
  return t.sources.map((key) => {
    const s = SOURCES[key];
    if (!s) return key;
    return s.url ? `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>` : s.label;
  }).join(' &middot; ');
}

function gradeTag(t) {
  return `<span class="tag grade-${t.grade}">${t.grade}</span>`;
}

function kindTag(t) {
  const labels = { story: 'Story', collectible: 'Collectible', activity: 'Activity', side: 'Side quest', crime: 'Crime', misc: 'Moment', completion: 'Completion', platinum: 'Platinum' };
  return `<span class="tag">${labels[t.kind] ?? t.kind}</span>`;
}

function renderProgress() {
  const n = earned.size;
  const pct = Math.round((n / trophies.length) * 100);
  document.getElementById('earnedCount').textContent = n;
  document.getElementById('barFill').style.width = `${pct}%`;
  document.getElementById('progressSub').textContent = n === trophies.length
    ? 'Platinum earned — Vice Got a Price!'
    : `${pct}% to the platinum — Vice Got a Price!`;
  document.getElementById('demoBadge').hidden = !demoMode;
}

function renderRoadmap() {
  const list = document.getElementById('roadmapList');
  list.replaceChildren();
  for (const stage of ROADMAP) {
    const done = stage.ids.filter((id) => earned.has(byId.get(id).name)).length;
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.innerHTML = `${stage.title} <span class="stage-count">${done}/${stage.ids.length} earned</span>`;
    const p = document.createElement('p');
    p.textContent = stage.text;
    const names = document.createElement('p');
    names.className = 'stage-trophies';
    names.innerHTML = stage.ids.map((id) => {
      const t = byId.get(id);
      const got = earned.has(t.name);
      return got ? `<b>✓ ${t.name}</b>` : t.name;
    }).join(' &middot; ');
    li.append(h, p, names);
    list.append(li);
  }
}

function trophyMatches(t) {
  if (kindFilter === 'missable' && !t.missable) return false;
  if (kindFilter !== 'all' && kindFilter !== 'missable' && t.kind !== kindFilter) return false;
  if (gradeFilter !== 'all' && t.grade !== gradeFilter) return false;
  if (query) {
    const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
    if (!hay.includes(query)) return false;
  }
  return true;
}

function renderTrophyList() {
  rowsEl.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!trophyMatches(t)) continue;
    shown += 1;
    const hidden = isHiddenBySpoiler(t);
    const card = document.createElement('article');
    card.className = `card${earned.has(t.name) ? ' earned' : ''}`;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', hidden ? 'Hidden story trophy' : t.name);

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${hidden ? 'this trophy' : t.name} as earned`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      saveEarned();
      renderProgress();
      renderRoadmap();
      renderTrophyList();
    });

    const name = document.createElement('p');
    name.className = 'name';
    name.textContent = hidden ? 'Hidden trophy — story spoiler' : t.name;
    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = hidden ? 'Earn it to reveal its name and description.' : t.description;
    const guide = document.createElement('p');
    guide.className = 'guide';
    guide.textContent = hidden ? '' : t.guide;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = hidden ? '' : `${gradeTag(t)}${kindTag(t)}${t.missable ? '<span class="tag missable">⚠ Possibly missable</span>' : ''}`;
    const src = document.createElement('p');
    src.className = 'sources';
    src.innerHTML = hidden ? '' : `Sources: ${sourceLinks(t)}`;
    const open = document.createElement('span');
    open.className = 'open';
    open.textContent = hidden ? '' : 'Guide →';

    const openDetail = () => { if (!hidden) openTrophyDetail(t.id); };
    card.addEventListener('click', openDetail);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(); } });

    card.append(box, name, open, desc, guide, meta, src);
    rowsEl.append(card);
  }
  document.getElementById('shownCount').textContent = shown;
  document.getElementById('empty').hidden = shown !== 0;
}

function openTrophyDetail(id) {
  const t = byId.get(id);
  if (!t || isHiddenBySpoiler(t)) return;
  detailEl.hidden = false;
  detailEl.innerHTML = `
    <button type="button" class="close" id="detailClose">Close</button>
    <h2>${t.name}</h2>
    <p class="desc">${t.description}</p>
    <p>${gradeTag(t)} ${kindTag(t)}${t.missable ? ' <span class="tag missable">⚠ Possibly missable</span>' : ''}</p>
    <p><strong>Guide:</strong> ${t.guide}</p>
    <p class="sources"><strong>Sources:</strong> ${sourceLinks(t)}</p>
    <p class="sources">Earned: ${earned.has(t.name) ? 'yes ✓' : 'not yet — tick it in the checklist when you earn it.'}</p>`;
  document.getElementById('detailClose').addEventListener('click', closeTrophyDetail);
  detailEl.scrollIntoView({ behavior: 'auto', block: 'start' });
  history.replaceState(null, '', `#trophy-${t.id}`);
}

function closeTrophyDetail() {
  detailEl.hidden = true;
  detailEl.replaceChildren();
  history.replaceState(null, '', location.pathname + location.search);
}

function renderSourceList() {
  const ul = document.getElementById('sourceList');
  for (const s of Object.values(SOURCES)) {
    const li = document.createElement('li');
    li.innerHTML = s.url ? `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>` : s.label;
    ul.append(li);
  }
}

function exportProgress() {
  const blob = new Blob([JSON.stringify([...earned], null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importProgress(file) {
  try {
    const names = JSON.parse(await file.text());
    if (!Array.isArray(names)) throw new Error('not an array');
    earned = new Set(names.filter((n) => byName.has(n)));
    saveEarned();
    renderProgress();
    renderRoadmap();
    renderTrophyList();
  } catch {
    alert('That file is not a trophy-progress export (a JSON list of trophy names).');
  }
}

document.getElementById('export').addEventListener('click', exportProgress);
document.getElementById('import').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) importProgress(file);
  e.target.value = '';
});
document.getElementById('kindChips').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-kind]');
  if (!btn) return;
  kindFilter = btn.dataset.kind;
  document.querySelectorAll('#kindChips .chip').forEach((c) => c.classList.toggle('active', c === btn));
  renderTrophyList();
});
gradeEl.addEventListener('change', () => { gradeFilter = gradeEl.value; renderTrophyList(); });
searchEl.addEventListener('input', () => { query = searchEl.value.trim().toLowerCase(); renderTrophyList(); });
spoilerEl.addEventListener('change', () => { renderTrophyList(); closeTrophyDetail(); });

if (spoilerParam) spoilerEl.checked = true;
renderProgress();
renderRoadmap();
renderTrophyList();
renderSourceList();

const hash = location.hash;
const viewTrophy = view === 'guide' ? Number(params.get('trophy')) : NaN;
if (Number.isInteger(viewTrophy) && byId.has(viewTrophy)) {
  openTrophyDetail(viewTrophy);
} else if (hash.startsWith('#trophy-')) {
  const id = Number(hash.slice('#trophy-'.length));
  if (byId.has(id)) openTrophyDetail(id);
} else if (hash === '#roadmap') {
  document.getElementById('roadmap').scrollIntoView();
} else if (hash === '#trophies') {
  document.getElementById('trophies').scrollIntoView();
}
