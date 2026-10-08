# Football Tactics

A responsive, dependency-light website that explains football tactics with simple diagrams (dots and arrows) and short captions, plus live scores and news from the major European leagues.

> **Draw the game, win the match.**

## Features

- **50 tactics** grouped into four categories: Attack, Defense, Goalkeeper and Full pitch.
- **Auto-generated diagrams**: every pitch is an SVG drawn from a few coordinates, so there are no image files to maintain.
- **Zoom viewer**: click any diagram to open it in a larger view, with zoom in/out, previous/next and keyboard support (`Esc`, `←`, `→`).
- **Category filters** to browse tactics quickly.
- **Live scores and news** for Serie A, Premier League, LaLiga, Bundesliga, Ligue 1 and Champions League, refreshed every minute.
- **Goals-per-match chart** built with [Chart.js](https://www.chartjs.org/).
- **Live clock** with date and time, and a blinking green indicator for matches in progress.
- **Tips banner** that appears every 2 minutes with a football coaching tip.
- **Promotional popup** that opens every 3 minutes.
- **Responsive layout** for mobile, tablet and desktop.
- Pages: Home, About, Contact, FAQ (single-page navigation with hash routing).

## Project structure

```
.
├── index.html   # Page structure and sections
├── style.css    # Styles and responsive layout
├── script.js    # Navigation, tactics data, SVG drawing, zoom, live data
└── README.md
```

## Getting started

No build step and no package manager are required.

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/<your-repo>.git
   cd <your-repo>
   ```
2. Open `index.html` in your browser.

If your browser blocks network requests when opening the file directly, serve the folder with a small local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

An internet connection is needed for Chart.js (loaded from cdnjs) and for the live scores and news.

## Tactics

| Category | Count | Examples |
|----------|-------|----------|
| Attack | 17 | Central Triangle, Wing Attack, Fullback Overlap, Give and Go, Through Ball, Cutback, Third-Man Run, Near-Post Run |
| Defense | 17 | Zonal Marking, Man-to-Man Marking, Low Block, High Press, Offside Trap, Flat Back Four, Touchline Trap |
| Goalkeeper | 8 | Sweeper Keeper, Claiming Crosses, One-on-One, Playing Out from the Back, Free Kick Positioning |
| Full pitch | 8 | Goalkeeper to Striker, Fast Counter-Attack, Full-Pitch Press, Defence-to-Attack Transition, 4-3-3 Build-Up Shape |

### Diagram legend

- Blue dots: your team
- Red dots: opponents
- Solid arrows: passes
- Dashed arrows: runs without the ball
- Shaded areas: zones

## Adding or editing a tactic

All tactics live in the `TACTICS` array in `script.js`. Each entry follows this format:

```js
[category, title, caption, team, opponents, passes, runs, zones]
```

| Field | Description |
|-------|-------------|
| `category` | `'o'` Attack, `'d'` Defense, `'g'` Goalkeeper, `'f'` Full pitch |
| `title` | Tactic name |
| `caption` | Short description shown under the diagram |
| `team` | Blue players as `'x,y x,y ...'` |
| `opponents` | Red players as `'x,y x,y ...'` |
| `passes` | Solid arrows as `'x1,y1,x2,y2 ...'` |
| `runs` | Dashed arrows as `'x1,y1,x2,y2 ...'` |
| `zones` | Shaded rectangles as `'x,y,width,height ...'` |

The pitch is **100 × 64** units and the team attacks towards the **right** (the opponent goal is at `x = 100`). The constant `F` holds a ready-made 4-3-3 formation you can reuse.

Example:

```js
['o', 'Through Ball', 'A midfielder plays the striker into the space behind the defenders.',
 '40,32 78,36', '62,24 62,32 62,42', '42,32,76,36', '', '']
```

## Configuration

Timing constants are at the top of `script.js`:

```js
const TIP_EVERY_MS = 2 * 60 * 1000;   // tips banner interval
const POPUP_EVERY_MS = 3 * 60 * 1000; // popup interval
const REFRESH_MS = 60 * 1000;         // live data refresh
```

Set smaller values while testing.

To change the popup link or text, edit the `#adModal` block in `index.html`.

## Data sources

Live scores and news come from ESPN's public site API, which does not require an API key:

```
https://site.api.espn.com/apis/site/v2/sports/soccer/{league}/scoreboard
https://site.api.espn.com/apis/site/v2/sports/soccer/{league}/news
```

Supported league codes: `ita.1`, `eng.1`, `esp.1`, `ger.1`, `fra.1`, `uefa.champions`.

> These endpoints are public but **unofficial and undocumented**. They may change, be rate-limited or stop working at any time. If a request fails, the site shows an "unavailable" message and keeps working. Check ESPN's terms of use before using the data commercially.

## Built with

- HTML5, CSS3 and vanilla JavaScript (no framework)
- SVG for the tactic diagrams
- [Chart.js](https://www.chartjs.org/) 4.4.1 via cdnjs

## Browser support

Any modern evergreen browser (Chrome, Edge, Firefox, Safari).

## Publishing on GitHub Pages

1. Push the files to your repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch** and select your main branch and the `/ (root)` folder.
4. Your site will be available at `https://<your-username>.github.io/<your-repo>/`.

## Contributing

Suggestions and pull requests are welcome. For new tactics, please keep the caption to one sentence and check the diagram in the zoom viewer before submitting.

## License

Released under the [MIT License](https://opensource.org/licenses/MIT). Add a `LICENSE` file to your repository to make it official.
