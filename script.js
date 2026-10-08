// ---------- Settings ----------
const TIP_EVERY_MS = 2 * 60 * 1000;   // tips banner interval
const POPUP_EVERY_MS = 3 * 60 * 1000; // ad popup interval
const REFRESH_MS = 60 * 1000;         // live data refresh
const API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/'; // free, no key

// ---------- Navigation ----------
const pages = [...document.querySelectorAll('.page')];
const menu = document.getElementById('menu');
function route() {
  const id = location.hash.slice(1) || 'home';
  pages.forEach(p => p.classList.toggle('show', p.id === id));
  menu.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.hash === '#' + id));
  scrollTo(0, 0);
}
addEventListener('hashchange', route);
document.getElementById('contactForm').onsubmit = e => {
  e.preventDefault();
  document.getElementById('formResult').textContent = 'Thanks! Message sent (demo).';
  e.target.reset();
};

// ---------- Clock ----------
function tickClock() {
  const now = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' });
  document.querySelectorAll('.clock').forEach(el => el.textContent = now);
}
setInterval(tickClock, 1000);

// ---------- Tips banner (every 2 minutes) ----------
const TIPS = [
  'Tip: always check where your teammates are before receiving the ball.',
  'Tip: talk to your teammates, a silent defender is a lost defender.',
  'Tip: after passing, move straight into the free space.',
  'Tip: when defending, keep your lines short and compact.',
  'Tip: train with both feet, it makes you unpredictable.',
  'Tip: when you lose the ball, the first second is the most important to win it back.'
];
let tipIndex = 0;
function showTip() {
  const banner = document.getElementById('tipBanner');
  banner.textContent = TIPS[tipIndex++ % TIPS.length];
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 10000);
}
setInterval(showTip, TIP_EVERY_MS);

// ---------- Ad popup (every 3 minutes) ----------
const adModal = document.getElementById('adModal');
setInterval(() => adModal.classList.add('open'), POPUP_EVERY_MS);
document.getElementById('adClose').onclick = () => adModal.classList.remove('open');
adModal.onclick = e => { if (e.target === adModal) adModal.classList.remove('open'); };

// ---------- Tactics data ----------
// [category, title, caption, team (blue), opponents (red), passes, runs, zones]
// pitch is 100x64, the team attacks to the right
const F = '4,32 20,10 20,24 20,40 20,54 40,18 40,32 40,46 62,12 64,32 62,52';
const TACTICS = [
 ['o','Central Triangle','Three players form a triangle to beat the defence with quick passes.','38,32 52,22 52,42 80,32','60,26 60,38 70,32','40,32,52,22 52,22,52,42 52,42,77,32','',''],
 ['o','Wing Attack','The midfielder finds the winger, who advances and crosses to the striker.','40,32 62,8 88,28','70,20 78,34','42,31,60,10 80,7,87,26','62,8,80,6',''],
 ['o','Fullback Overlap','The winger carries the ball while the fullback runs behind to receive the pass.','50,12 38,20 82,32','62,14 70,24','62,18,70,8 70,8,82,30','50,12,62,18 38,20,70,6',''],
 ['o','Give and Go','A player passes to the striker and immediately runs into the free space.','40,32 62,32','52,24 52,40','42,32,60,32 62,33,72,40','40,32,72,40',''],
 ['o','Switch of Play','Draw the opponents to one flank, then quickly switch to the other side.','30,10 46,18 46,52 82,56','38,14 44,24 52,16','30,10,46,18 46,18,46,52 46,52,80,56','',''],
 ['o','Through Ball','A midfielder plays the striker into the space behind the defenders.','40,32 78,36','62,24 62,32 62,42','42,32,76,36','',''],
 ['o','Front Three Combination','Three attackers combine with quick passes to create a numerical advantage.','40,32 58,20 58,44 78,32','64,28 64,38 72,32','40,32,58,20 58,20,58,44 58,44,76,33','',''],
 ['o','Decoy Run','The striker drifts away from goal, pulling a defender and freeing space for a teammate.','40,34 62,32 72,50','66,34 80,40','42,34,84,36','62,32,48,22 72,50,84,36',''],
 ['o','Cutback','The winger enters the box and, instead of crossing, passes back to a midfielder ready to shoot.','50,10 74,44','84,24 86,34 80,18','84,16,75,42 75,44,98,32','50,10,84,14',''],
 ['o','Counter-Press','After losing the ball, the attackers immediately press the carrier to win it back near goal.','70,32 66,18 66,46','80,32 85,22','','70,32,78,32 66,18,76,26 66,46,76,38',''],
 ['d','Zonal Marking','Each player guards an area of the pitch instead of following an opponent.','20,10 20,24 20,40 20,54 38,20 38,44','42,32 55,22','','','10,2,22,30 10,32,22,30'],
 ['d','Man-to-Man Marking','Each defender follows a specific opposing player.','22,16 22,32 22,48','34,16 34,32 34,48','','22,16,32,16 22,32,32,32 22,48,32,48',''],
 ['d','Low Block','The team sits near its own box, leaving little space for the attackers.','14,10 14,24 14,40 14,54 26,20 26,44','44,20 44,44 52,32 36,32','','','8,2,26,60'],
 ['d','Mid Block','The team defends in the middle of the pitch, stopping the opponents from progressing.','30,12 30,24 30,40 30,52 44,22 44,42','58,32 66,20 66,44','','','26,2,22,60'],
 ['d','High Press','Players push up to pressure opponents already in their own half.','56,16 56,48 64,32 44,24 44,40','74,32 80,20 80,44','','64,32,73,32 56,16,70,22 56,48,70,42',''],
 ['d','Double Team on the Wing','Two defenders close down the opponent carrying the ball on the flank.','36,14 52,14','44,8 56,32','','36,14,43,10 52,14,46,9',''],
 ['d','Closing Passing Lanes','Defenders position themselves to block passes towards the attackers.','30,24 30,40 38,32','52,32 44,16 44,48','','38,32,46,32 30,24,43,18 30,40,43,46',''],
 ['d','Defensive Shift','The whole back line slides together towards the side where the ball is.','20,10 20,24 20,40 20,54','40,12','','20,10,20,4 20,24,20,18 20,40,20,34 20,54,20,48',''],
 ['d','Offside Trap','The back line steps up quickly to catch the opposing attackers offside.','20,10 20,24 20,40 20,54','26,16 24,32 28,46 44,30','','20,10,32,10 20,24,32,24 20,40,32,40 20,54,32,54',''],
 ['d','Central Double Team','Two players close the space in front of the defence to stop passes and shots from the centre.','22,32 30,24 30,40','46,32 44,18 44,46','','30,24,38,28 30,40,38,36','24,18,16,28'],
 ['g','Sweeper Keeper','The goalkeeper steps out of the box to intercept long balls and cover the space behind the defence.','4,32 18,20 18,44','36,32 30,18','','4,32,26,32',''],
 ['g','Claiming Crosses','The goalkeeper comes out quickly to catch or punch away crosses.','6,32 14,22','30,6 18,28','30,6,16,26','6,32,14,24',''],
 ['g','One-on-One','The goalkeeper advances towards the striker, narrowing the shooting angle.','6,32','28,32','','6,32,19,32',''],
 ['g','Quick Distribution','After a save, the goalkeeper immediately finds a free teammate to start the counter-attack.','4,32 24,10 56,22 80,32','40,28 40,40','4,32,24,12 24,12,56,20','56,22,80,31',''],
 ['g','Playing Out from the Back','The goalkeeper looks for a free defender or midfielder instead of kicking long.','4,32 14,12 14,52 30,32 44,20','34,22 34,44','4,32,14,14 14,12,28,30 30,32,42,22','',''],
 ['f','Goalkeeper to Striker','The goalkeeper starts the move, defenders spread wide, midfielders open passing lanes and the striker runs in behind.','4,32 18,8 22,24 22,40 18,56 38,18 40,32 38,46 62,12 72,32 62,52','','4,32,22,24 22,24,40,32 40,32,70,32','72,32,84,28',''],
 ['f','Fast Counter-Attack','After winning the ball, the first pass goes to midfield and then to attackers running into space.',F,'30,30 34,40','20,40,40,32 40,32,64,32','62,12,84,12 62,52,84,52',''],
 ['f','Full-Pitch Press','The whole team moves up to stop the opponents building play, keeping the lines compact.','4,32 40,10 42,24 42,40 40,54 60,18 60,32 60,46 76,12 80,32 76,52','84,20 84,44','','76,12,84,16 80,32,86,32 76,52,84,48 60,32,66,32',''],
 ['f','Flank-to-Flank Switch','Play builds on one flank, draws the opponents, then quickly switches to the other flank.',F,'30,14 34,22','20,10,40,18 40,18,40,46 40,46,62,52','62,52,80,50',''],
 ['f','Defence-to-Attack Transition','After winning the ball, defenders, midfielders and attackers move forward together to create options and numbers.',F,'','40,32,64,32','20,24,32,24 20,40,32,40 40,18,54,18 40,46,54,46 62,12,80,12 62,52,80,52 64,32,82,32',''],
 ['o','Flank Overload','Several players crowd one flank to draw defenders, then the ball is switched to a free winger.','38,18 52,12 52,26 84,52','58,18 64,28 62,10 70,48','38,18,52,26 52,26,52,12 52,12,84,50','',''],
 ['o','Third-Man Run','Two players combine while a third runs into the space created behind the defence.','36,32 52,32 62,48','58,28 60,40','38,32,50,32 52,33,74,34','62,48,76,36',''],
 ['o','Early Cross','The winger crosses quickly before the defence can set, targeting attackers arriving in the box.','40,32 60,10 86,28 84,40','74,24 78,34','42,32,58,12 62,10,84,38','',''],
 ['o','Long Ball to the Target Man','A long pass finds the striker, who holds the ball up and lays it off to a runner.','10,32 70,32 82,22 82,44','68,28 72,38','12,32,66,32 70,33,84,44','82,22,90,26',''],
 ['o','Short Corner Routine','Two players play a short corner to change the angle and create a better crossing opportunity.','98,2 90,8 80,24 86,34','92,20 94,28 90,30 96,34','97,3,91,8 90,9,84,24','86,34,88,26',''],
 ['o','Near-Post Run','An attacker darts to the near post to meet a low cross while teammates attack the far side.','60,8 78,30 84,44','88,28 82,34 90,36','62,8,90,24','78,30,90,24 84,44,84,34',''],
 ['o','Inverted Winger Cut-Inside','The winger drives inside from the flank onto the stronger foot to shoot or find a teammate.','60,10 82,40','70,20 68,34 80,26','76,28,98,32','60,10,76,28',''],
 ['d','Flat Back Four','Four defenders hold a straight line, stepping up and dropping back together.','20,10 20,24 20,40 20,54','40,20 40,44','','20,10,26,10 20,24,26,24 20,40,26,40 20,54,26,54',''],
 ['d','Touchline Trap','The team forces play toward the sideline and closes in to win the ball.','48,12 58,22 50,32','62,8 70,30','','48,12,58,10 58,22,64,14 50,32,56,24',''],
 ['d','Cover and Balance','The first defender pressures the ball while a teammate covers behind and others balance the shape.','36,22 28,34 26,50','46,22 52,40','','36,22,44,22 28,34,36,28 26,50,30,44',''],
 ['d','Corner Defence','Defenders protect the goal area at corners, marking zones and key attackers.','4,28 4,36 8,26 8,38 12,32 14,22 14,42 18,32','10,30 12,24 12,40 16,30 16,36 8,20','','','3,22,18,20'],
 ['d','Compact 4-4-2 Block','Two banks of four stay close together to deny space between the lines.','20,10 20,24 20,40 20,54 38,10 38,24 38,40 38,54 54,24 54,40','64,32 72,16 72,48','','','14,2,32,60'],
 ['d','Recovery Run','A defender sprints back to delay the attacker while teammates recover their positions.','30,18 22,40','46,30 40,40','','30,18,38,28 22,40,32,40',''],
 ['d','Pressing Trigger','The team presses together as soon as the opponent plays a backward pass or receives with a poor touch.','56,12 56,32 56,52 40,32','72,20 80,32 72,44','72,20,80,32','56,12,70,20 56,52,70,44 56,32,64,28',''],
 ['g','Free Kick Positioning','The goalkeeper organises the wall and positions to cover the exposed side of the goal.','4,30 14,22 14,28 14,34 14,40','32,32','','',''],
 ['g','Throw-Out Distribution','The goalkeeper throws the ball quickly to a wide teammate to start an attack.','4,32 20,14 24,50','36,20','4,32,22,16 22,16,44,12','',''],
 ['g','Covering the Space Behind','The goalkeeper stays high to cover through balls played behind the defensive line.','6,32 24,12 24,52','40,32 30,26','50,32,34,32','6,32,18,32',''],
 ['f','4-3-3 Build-Up Shape','The team builds in a 4-3-3 shape, moving the ball from the back to the wide forward.',F,'','4,32,20,24 20,24,40,32 40,32,62,12','',''],
 ['f','Defensive Compact Shape','The whole team shrinks the pitch, keeping three tight lines to protect the centre.','4,32 16,10 16,24 16,40 16,54 28,18 28,32 28,46 40,12 42,32 40,52','52,20 60,32 52,44','','','10,2,36,60'],
 ['f','Wing Overload Attack','The team shifts its midfield and forwards to one wing to create a numerical advantage.','4,32 20,10 20,24 20,40 20,54 44,12 46,26 40,40 66,10 68,24 70,44','58,14 70,18','46,26,64,12 66,10,76,28','44,12,60,8 20,10,50,8','']
];

const CATEGORY_NAMES = { o: 'Attack', d: 'Defense', g: 'Goalkeeper', f: 'Full pitch' };
const parsePoints = s => s.trim() ? s.trim().split(/\s+/).map(p => p.split(',').map(Number)) : [];

function drawPitch(tactic) {
  const [, title, , team, opp, passes, runs, zones] = tactic;
  let svg = `<svg viewBox="0 0 100 64" role="img" aria-label="${title}">
  <defs><marker id="arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0L5,2.5L0,5z" fill="#111"/></marker></defs>
  <rect width="100" height="64" fill="#3c9d5d"/>
  <g fill="none" stroke="#fff" stroke-width=".5"><rect x="1" y="1" width="98" height="62"/><line x1="50" y1="1" x2="50" y2="63"/><circle cx="50" cy="32" r="8"/>
  <rect x="1" y="16" width="14" height="32"/><rect x="85" y="16" width="14" height="32"/></g>`;
  parsePoints(zones).forEach(([x, y, w, h]) => {
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fde68a" fill-opacity=".3" stroke="#fde68a" stroke-dasharray="2"/>`;
  });
  const arrows = (list, dashed) => parsePoints(list).forEach(([x1, y1, x2, y2]) => {
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#111" stroke-width="${dashed ? .6 : .9}" ${dashed ? 'stroke-dasharray="1.8 1.2"' : ''} marker-end="url(#arrow)"/>`;
  });
  arrows(runs, true);
  arrows(passes, false);
  const dots = (list, color) => parsePoints(list).forEach(([x, y]) => {
    svg += `<circle cx="${x}" cy="${y}" r="2.3" fill="${color}" stroke="#fff" stroke-width=".5"/>`;
  });
  dots(opp, '#dc2626');
  dots(team, '#1d4ed8');
  return svg + '</svg>';
}

let activeFilter = 'all';
function renderTactics() {
  const filters = document.getElementById('filters');
  filters.innerHTML = [['all', 'All'], ...Object.entries(CATEGORY_NAMES)]
    .map(([k, name]) => `<button data-k="${k}" class="${k === activeFilter ? 'on' : ''}">${name}</button>`).join('');
  filters.querySelectorAll('button').forEach(b => b.onclick = () => { activeFilter = b.dataset.k; renderTactics(); });
  visible = TACTICS.filter(t => activeFilter === 'all' || t[0] === activeFilter);
  document.getElementById('grid').innerHTML = visible
    .map((t, i) => `<figure data-i="${i}" title="Click to zoom">${drawPitch(t)}<figcaption><b>${t[1]}</b><span>${t[2]}</span></figcaption></figure>`).join('');
  document.querySelectorAll('#grid figure').forEach(f => f.onclick = () => openZoom(+f.dataset.i));
}

// ---------- Zoom viewer ----------
let visible = [], zoomIndex = 0, zoomLevel = 100;
const zoomModal = document.getElementById('zoomModal');
const zoomView = document.getElementById('zoomView');
function renderZoom() {
  const t = visible[zoomIndex];
  zoomView.innerHTML = drawPitch(t);
  zoomView.firstChild.style.width = zoomLevel + '%';
  document.getElementById('zoomCaption').innerHTML = `<b>${t[1]}</b> ${t[2]}`;
}
function openZoom(i) {
  zoomIndex = (i + visible.length) % visible.length;
  zoomLevel = 100;
  renderZoom();
  zoomModal.classList.add('open');
}
function setZoom(delta) {
  zoomLevel = Math.min(250, Math.max(100, zoomLevel + delta));
  renderZoom();
}
document.getElementById('zPrev').onclick = () => openZoomKeep(-1);
document.getElementById('zNext').onclick = () => openZoomKeep(1);
function openZoomKeep(step) { zoomIndex = (zoomIndex + step + visible.length) % visible.length; renderZoom(); }
document.getElementById('zIn').onclick = () => setZoom(25);
document.getElementById('zOut').onclick = () => setZoom(-25);
document.getElementById('zClose').onclick = () => zoomModal.classList.remove('open');
zoomModal.onclick = e => { if (e.target === zoomModal) zoomModal.classList.remove('open'); };
addEventListener('keydown', e => {
  if (!zoomModal.classList.contains('open')) return;
  if (e.key === 'Escape') zoomModal.classList.remove('open');
  if (e.key === 'ArrowRight') openZoomKeep(1);
  if (e.key === 'ArrowLeft') openZoomKeep(-1);
});

// ---------- Live data (ESPN free API) + Chart.js ----------
let goalsChart;
function renderChart(labels, goals) {
  if (!window.Chart) return; // Chart.js not loaded
  if (goalsChart) goalsChart.destroy();
  goalsChart = new Chart(document.getElementById('goalsChart'), {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Total goals', data: goals, backgroundColor: '#14532d' }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { title: { display: true, text: 'Goals per match' }, legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });
}

async function loadLive() {
  const league = document.getElementById('league').value;
  const matchesBox = document.getElementById('matches');
  const newsBox = document.getElementById('news');
  try {
    const data = await (await fetch(`${API}${league}/scoreboard`)).json();
    const labels = [], goals = [];
    matchesBox.innerHTML = (data.events || []).map(ev => {
      const teams = ev.competitions[0].competitors;
      const home = teams.find(x => x.homeAway === 'home');
      const away = teams.find(x => x.homeAway === 'away');
      const isLive = ev.status.type.state === 'in';
      const when = new Date(ev.date).toLocaleString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      labels.push(`${home.team.abbreviation}-${away.team.abbreviation}`);
      goals.push((+home.score || 0) + (+away.score || 0));
      return `<div>${isLive ? '<span class="dot"></span>' : ''}<b>${home.team.displayName} ${home.score ?? ''} - ${away.score ?? ''} ${away.team.displayName}</b>
        <small>${when} · ${ev.status.type.shortDetail}</small></div>`;
    }).join('') || 'No matches right now.';
    renderChart(labels, goals);
  } catch { matchesBox.textContent = 'Scores unavailable.'; }
  try {
    const data = await (await fetch(`${API}${league}/news`)).json();
    newsBox.innerHTML = (data.articles || []).slice(0, 8).map(n =>
      `<div><a href="${n.links.web.href}" target="_blank" rel="noopener">${n.headline}</a><small>${n.description || ''}</small></div>`).join('') || 'No news.';
  } catch { newsBox.textContent = 'News unavailable.'; }
}
document.getElementById('league').onchange = loadLive;
setInterval(loadLive, REFRESH_MS);

// ---------- Init ----------
renderTactics(); tickClock(); route();
window.addEventListener('load', loadLive); // wait for Chart.js
