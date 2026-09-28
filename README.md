# Perfect Season Game

A fast, keyboard-accessible sports draft and regular-season simulation game built for the UW Sports Analytics Club table at the RSO fair.

Visitors choose NBA, Soccer, or NFL, spin a casino slot machine for historical franchise-era draws to fill their roster, and simulate the full season in pursuit of an undefeated record.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Local Development

```bash
cd perfect-season-game
npm install
npm run dev
```

Visit the local URL printed by Vite (typically `http://localhost:5173`) to play.

### Running Tests

```bash
npm test
```

Executes the Vitest suite (19 tests) covering catalog completeness, pure draft and simulation rules, free-form position drafting, re-rolls, and the React UI.

### Production Build

```bash
npm run build
```

Compiles the static production assets into `dist/`.

## Key Features

1. **Free-Form Position Selection:**
   - Draft any position you want without being forced into a strict order.
   - Click any open slot on your roster board to target it, or spin and draft any eligible player to automatically fill an open position.
2. **Casino Slot Machine Animations & Sound:**
   - Two mechanical reels for Franchise and Era with high-energy rolling animations and ticker sounds.
   - Victory chime upon landing on your drawn team.
   - Audio toggle (Sound ON / OFF) built into the header.
3. **Re-Roll Controls:**
   - Don't like the rolled franchise-era? Hit **🎲 Re-roll Team & Era** to spin again!
4. **Rich Player Statistics:**
   - **NBA:** Points, Rebounds, Assists, Steals, Blocks, Shooting Percentages (e.g. `31.5 PPG, 6.3 RPG, 5.4 APG, 2.5 SPG`).
   - **Soccer:** Goals, Assists, Clean Sheets, Save %, Pass Accuracy, Tackles.
   - **NFL:** Passing Yds/TD/INT, Rushing Yds/TD/YPC, Receiving Yds/TD/Rec, Defensive PPG/Sacks/INT.
5. **Rosters & Formations:**
   - **NBA:** 5 positions: 2 Guards, 2 Forwards, 1 Center (82-game regular season).
   - **Soccer (Full Starting XI):** 11 positions: 1 GK, 4 DEF, 3 MID, 2 WINGS, 1 ST (38-match regular season).
   - **NFL:** 8 positions: 1 QB, 2 RB, 3 WR, 1 TE, 1 DEF (17-game regular season).
6. **Championship Simulation & Schedule:**
   - Simulates the full regular season using average roster rating + bounded randomness.
   - Numbered game-by-game schedule table with W, D, and L badges.
   - Special championship banner for undefeated Perfect Seasons (82–0, 38–0, 17–0).

## Disclaimer

All player names, ratings, stats, and historical franchise associations are hand-curated strictly for recreational and entertainment purposes. Player ratings are arbitrary and do not represent an official or authoritative ranking. This application is completely unaffiliated with the NBA, NFL, FIFA, UEFA, or any professional league, club, or player association. No game data or runs are persisted.
