import React from 'react'

export const SOCCER_FORMATIONS = {
  '4-3-3': {
    name: '4-3-3 (Attacking Wide)',
    description: 'Classic attacking 4-3-3 with fullbacks, midfield trio and wingers',
    coords: {
      GK:  { x: 50, y: 88, label: 'GK' },
      LB:  { x: 16, y: 72, label: 'LB' },
      CB1: { x: 38, y: 75, label: 'CB1' },
      CB2: { x: 62, y: 75, label: 'CB2' },
      RB:  { x: 84, y: 72, label: 'RB' },
      CDM: { x: 50, y: 55, label: 'CDM' },
      CM:  { x: 30, y: 40, label: 'CM' },
      CAM: { x: 70, y: 40, label: 'CAM' },
      LW:  { x: 18, y: 20, label: 'LW' },
      ST:  { x: 50, y: 14, label: 'ST' },
      RW:  { x: 82, y: 20, label: 'RW' },
    },
  },
  '4-4-2': {
    name: '4-4-2 (Classic Flat)',
    description: 'Traditional solid bank of 4 midfielders supporting a dual strike partnership',
    coords: {
      GK:  { x: 50, y: 88, label: 'GK' },
      LB:  { x: 16, y: 74, label: 'LB' },
      CB1: { x: 38, y: 76, label: 'CB1' },
      CB2: { x: 62, y: 76, label: 'CB2' },
      RB:  { x: 84, y: 74, label: 'RB' },
      LW:  { x: 16, y: 46, label: 'LM (LW)' },
      CDM: { x: 38, y: 48, label: 'CM (CDM)' },
      CM:  { x: 62, y: 48, label: 'CM' },
      RW:  { x: 84, y: 46, label: 'RM (RW)' },
      CAM: { x: 38, y: 20, label: 'CF (CAM)' },
      ST:  { x: 62, y: 18, label: 'ST' },
    },
  },
  '4-2-3-1': {
    name: '4-2-3-1 (Modern Pivot)',
    description: 'Double-pivot midfield shield with a dynamic attacking trident behind a lone striker',
    coords: {
      GK:  { x: 50, y: 88, label: 'GK' },
      LB:  { x: 16, y: 74, label: 'LB' },
      CB1: { x: 38, y: 76, label: 'CB1' },
      CB2: { x: 62, y: 76, label: 'CB2' },
      RB:  { x: 84, y: 74, label: 'RB' },
      CDM: { x: 35, y: 58, label: 'CDM' },
      CM:  { x: 65, y: 58, label: 'CDM (CM)' },
      LW:  { x: 18, y: 35, label: 'LAM (LW)' },
      CAM: { x: 50, y: 33, label: 'CAM' },
      RW:  { x: 82, y: 35, label: 'RAM (RW)' },
      ST:  { x: 50, y: 15, label: 'ST' },
    },
  },
  '3-5-2': {
    name: '3-5-2 (Wing-Backs)',
    description: '3 commanding center backs, wide wing-backs controlling the flanks, and twin strikers',
    coords: {
      GK:  { x: 50, y: 88, label: 'GK' },
      CB1: { x: 28, y: 76, label: 'LCB (CB1)' },
      LB:  { x: 50, y: 78, label: 'CB (LB)' },
      CB2: { x: 72, y: 76, label: 'RCB (CB2)' },
      LW:  { x: 14, y: 44, label: 'LWB (LW)' },
      CDM: { x: 50, y: 58, label: 'CDM' },
      CM:  { x: 33, y: 44, label: 'CM' },
      CAM: { x: 67, y: 44, label: 'CAM' },
      RB:  { x: 86, y: 44, label: 'RWB (RB)' },
      ST:  { x: 38, y: 18, label: 'ST1' },
      RW:  { x: 62, y: 18, label: 'ST2 (RW)' },
    },
  },
  '3-4-3': {
    name: '3-4-3 (Total Football)',
    description: 'Cruyff-inspired fluid front three with wide wing-midfielders',
    coords: {
      GK:  { x: 50, y: 88, label: 'GK' },
      CB1: { x: 28, y: 76, label: 'LCB (CB1)' },
      LB:  { x: 50, y: 78, label: 'CB (LB)' },
      CB2: { x: 72, y: 76, label: 'RCB (CB2)' },
      CDM: { x: 18, y: 48, label: 'LM (CDM)' },
      CM:  { x: 40, y: 50, label: 'CM' },
      CAM: { x: 60, y: 50, label: 'CM (CAM)' },
      RB:  { x: 82, y: 48, label: 'RM (RB)' },
      LW:  { x: 20, y: 20, label: 'LW' },
      ST:  { x: 50, y: 15, label: 'ST' },
      RW:  { x: 80, y: 20, label: 'RW' },
    },
  },
}

export const NBA_COORDS = {
  PG: { x: 50, y: 78, label: 'PG', zone: 'Top of the Key' },
  SG: { x: 82, y: 58, label: 'SG', zone: 'Right Wing' },
  SF: { x: 18, y: 58, label: 'SF', zone: 'Left Wing' },
  PF: { x: 30, y: 38, label: 'PF', zone: 'High Post' },
  C:  { x: 50, y: 24, label: 'C',  zone: 'The Paint / Rim' },
}

export const NFL_COORDS = {
  // Defense (Opposite side of Line of Scrimmage: Y < 42%)
  DEF: { x: 50, y: 20, label: 'DEF', zone: 'Defensive Unit' },

  // Line of Scrimmage is at Y = 42%
  // Offense (On or behind Line of Scrimmage: Y > 42%)
  WR1: { x: 14, y: 50, label: 'WR1', zone: 'Split End (Wide L)' },
  WR2: { x: 86, y: 50, label: 'WR2', zone: 'Flanker (Wide R)' },
  TE:  { x: 68, y: 50, label: 'TE',  zone: 'Tight End (Line)' },
  WR3: { x: 28, y: 56, label: 'WR3', zone: 'Slot Receiver' },
  QB:  { x: 50, y: 68, label: 'QB',  zone: 'Quarterback (Shotgun)' },
  RB1: { x: 38, y: 84, label: 'RB1', zone: 'Halfback' },
  RB2: { x: 62, y: 84, label: 'RB2', zone: 'Fullback / RB2' },
}

/**
 * Interactive Slot Token placed onto the court/field.
 * Maintains full accessibility (role="button", aria-label, tabIndex)
 * and DOM structure (.player-name, .player-rating-pill, .roster-slot)
 * to ensure all automated tests and keyboard navigation continue to work perfectly.
 */
function BoardSlotToken({ slot, coord, isTargeted, onSlotClick }) {
  const isFilled = Boolean(slot.player)

  return (
    <li
      className={`roster-slot board-slot ${isFilled ? 'filled' : 'empty'} ${isTargeted ? 'targeted' : ''}`}
      style={{
        left: `${coord.x}%`,
        top: `${coord.y}%`,
      }}
      onClick={() => onSlotClick(slot)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSlotClick(slot)
        }
      }}
      role={isFilled ? undefined : 'button'}
      tabIndex={isFilled ? undefined : 0}
      aria-label={
        isFilled
          ? `${slot.role}: ${slot.player.name}`
          : `Open slot ${slot.index + 1}: ${slot.role}. Click to target.`
      }
    >
      <div className="slot-header">
        <span className="slot-role">{coord.label || slot.role}</span>
        <span className="slot-num">#{slot.index + 1}</span>
      </div>

      {isFilled ? (
        <div className="slot-player-details">
          <strong className="player-name">{slot.player.name}</strong>
          <span className="player-rating-pill">{slot.player.rating}</span>
          <div className="player-stat-line">{slot.player.stats}</div>
        </div>
      ) : (
        <div className="slot-empty-prompt">
          {isTargeted ? 'Targeted' : 'Open (Click to target)'}
        </div>
      )}
    </li>
  )
}

/**
 * Soccer Pitch Board with 11-player layout and preset formation switcher.
 */
export function SoccerPitchBoard({
  slots,
  formation,
  onFormationChange,
  targetedSlotIndex,
  onSlotClick,
}) {
  const currentFormation = SOCCER_FORMATIONS[formation] || SOCCER_FORMATIONS['4-3-3']

  return (
    <div className="sports-board-wrapper">
      <div className="formation-control-bar">
        <div className="formation-info">
          <span className="formation-title">Tactical Formation:</span>
          <span className="formation-active-name">{currentFormation.name}</span>
          <span className="formation-note">(Visual layout preset — does not alter win odds)</span>
        </div>
        <div className="formation-buttons" role="group" aria-label="Soccer Formation Presets">
          {Object.keys(SOCCER_FORMATIONS).map((formKey) => (
            <button
              key={formKey}
              type="button"
              className={`btn-formation ${formation === formKey ? 'active' : ''}`}
              onClick={() => onFormationChange(formKey)}
              aria-pressed={formation === formKey}
            >
              {formKey}
            </button>
          ))}
        </div>
      </div>

      <div className="board-container soccer-pitch-container">
        {/* SVG Pitch Markings */}
        <svg
          className="field-markings pitch-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Halfway line & center circle at top */}
          <line x1="0" y1="4" x2="100" y2="4" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <path
            d="M 38,4 A 12,12 0 0,0 62,4"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.8"
          />
          <circle cx="50" cy="4" r="1" fill="rgba(255,255,255,0.5)" />

          {/* Attacking / opponent box outline at top */}
          <rect
            x="24"
            y="4"
            width="52"
            height="10"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.6"
          />

          {/* Penalty box (18-yard box) at bottom */}
          <rect
            x="20"
            y="76"
            width="60"
            height="23.5"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="0.8"
          />

          {/* 6-yard box at bottom */}
          <rect
            x="36"
            y="88"
            width="28"
            height="11.5"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="0.7"
          />

          {/* Penalty spot */}
          <circle cx="50" cy="82" r="1" fill="rgba(255,255,255,0.7)" />

          {/* Penalty Arc / The D */}
          <path
            d="M 40,76 A 11,11 0 0,1 60,76"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="0.7"
          />

          {/* Goal Line & Goal Box */}
          <line x1="42" y1="99.5" x2="58" y2="99.5" stroke="#ffffff" strokeWidth="1.5" />

          {/* Corner arcs */}
          <path d="M 0,96 A 4,4 0 0,0 4,100" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
          <path d="M 96,100 A 4,4 0 0,0 100,96" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
        </svg>

        {/* Pitch Zones Label */}
        <div className="pitch-zone-label attacking-label" aria-hidden="true">
          ▲ ATTACKING THIRD
        </div>
        <div className="pitch-zone-label midfield-label" aria-hidden="true">
          MIDFIELD ENGINE
        </div>
        <div className="pitch-zone-label defense-label" aria-hidden="true">
          ▼ DEFENSIVE THIRD & GOAL
        </div>

        {/* Roster slots overlaid on pitch */}
        <ul className="roster-list board-roster-list">
          {slots.map((slot) => {
            const coord = currentFormation.coords[slot.role] || { x: 50, y: 50, label: slot.role }
            const isTargeted = targetedSlotIndex === slot.index
            return (
              <BoardSlotToken
                key={slot.id}
                slot={slot}
                coord={coord}
                isTargeted={isTargeted}
                onSlotClick={onSlotClick}
              />
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/**
 * NBA Half-Court Board with Starting 5 positions.
 */
export function NbaCourtBoard({ slots, targetedSlotIndex, onSlotClick }) {
  return (
    <div className="sports-board-wrapper">
      <div className="court-legend">
        <span className="legend-tag">Starting 5 Half-Court</span>
        <span className="legend-hint">PG at top of key · Wings on perimeter · Bigs in post & paint</span>
      </div>

      <div className="board-container nba-court-container">
        {/* SVG Court Markings */}
        <svg
          className="field-markings court-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Baseline at top */}
          <line x1="0" y1="2" x2="100" y2="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />

          {/* Key / Paint area (shaded) */}
          <rect
            x="32"
            y="2"
            width="36"
            height="38"
            fill="rgba(30, 58, 138, 0.28)"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.9"
          />

          {/* Free throw line */}
          <line x1="32" y1="40" x2="68" y2="40" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />

          {/* Free throw circle (solid bottom half) */}
          <path
            d="M 38,40 A 12,12 0 0,0 62,40"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="0.9"
          />
          {/* Free throw circle (dashed top half inside key) */}
          <path
            d="M 38,40 A 12,12 0 0,1 62,40"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />

          {/* Backboard & Rim */}
          <line x1="42" y1="7" x2="58" y2="7" stroke="#ffffff" strokeWidth="2.2" />
          <circle cx="50" cy="11" r="2.8" fill="none" stroke="#f97316" strokeWidth="1.2" />

          {/* Restricted area arc */}
          <path
            d="M 45,7 A 5,5 0 0,0 55,7"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="0.8"
          />

          {/* 3-Point Line */}
          {/* Left straight corner line */}
          <line x1="8" y1="2" x2="8" y2="24" stroke="rgba(255,255,255,0.65)" strokeWidth="0.9" />
          {/* Right straight corner line */}
          <line x1="92" y1="2" x2="92" y2="24" stroke="rgba(255,255,255,0.65)" strokeWidth="0.9" />
          {/* Big 3-point Arc */}
          <path
            d="M 8,24 C 8,62 92,62 92,24"
            fill="none"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="0.9"
          />

          {/* Half-court line at bottom */}
          <line x1="0" y1="98" x2="100" y2="98" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          {/* Center circle arc */}
          <path
            d="M 36,98 A 14,14 0 0,1 64,98"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="0.9"
          />
        </svg>

        {/* Tactical zones overlay */}
        <div className="court-zone-tag paint-zone-tag" aria-hidden="true">
          THE PAINT
        </div>
        <div className="court-zone-tag perimeter-zone-tag" aria-hidden="true">
          3-POINT ARC
        </div>

        {/* 5 Starting NBA Tokens */}
        <ul className="roster-list board-roster-list">
          {slots.map((slot) => {
            const coord = NBA_COORDS[slot.role] || { x: 50, y: 50, label: slot.role }
            const isTargeted = targetedSlotIndex === slot.index
            return (
              <BoardSlotToken
                key={slot.id}
                slot={slot}
                coord={coord}
                isTargeted={isTargeted}
                onSlotClick={onSlotClick}
              />
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/**
 * NFL Gridiron Board with Offense and Defense on opposite sides of the Line of Scrimmage.
 */
export function NflGridironBoard({ slots, targetedSlotIndex, onSlotClick }) {
  return (
    <div className="sports-board-wrapper">
      <div className="gridiron-legend">
        <span className="legend-tag def-tag">🛡️ Defense (Top)</span>
        <span className="scrimmage-tag">⚡ Line of Scrimmage ⚡</span>
        <span className="legend-tag off-tag">🏈 Offense (Bottom)</span>
      </div>

      <div className="board-container nfl-gridiron-container">
        {/* SVG Turf Yard Lines & Markings */}
        <svg
          className="field-markings gridiron-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Sideline boundaries */}
          <line x1="4" y1="0" x2="4" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
          <line x1="96" y1="0" x2="96" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />

          {/* 10-Yard Lines */}
          <line x1="4" y1="12" x2="96" y2="12" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
          <line x1="4" y1="24" x2="96" y2="24" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
          <line x1="4" y1="36" x2="96" y2="36" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
          <line x1="4" y1="58" x2="96" y2="58" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
          <line x1="4" y1="72" x2="96" y2="72" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
          <line x1="4" y1="88" x2="96" y2="88" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />

          {/* Hash Marks across middle */}
          {[12, 18, 24, 30, 36, 50, 58, 65, 72, 80, 88].map((y) => (
            <g key={y} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5">
              <line x1="38" y1={y} x2="42" y2={y} />
              <line x1="58" y1={y} x2="62" y2={y} />
              <line x1="4" y1={y} x2="7" y2={y} />
              <line x1="93" y1={y} x2="96" y2={y} />
            </g>
          ))}
        </svg>

        {/* Yard Numbers */}
        <div className="yard-numbers left-numbers" aria-hidden="true">
          <span>20</span>
          <span>30</span>
          <span>40</span>
          <span>50</span>
          <span>40</span>
          <span>30</span>
        </div>
        <div className="yard-numbers right-numbers" aria-hidden="true">
          <span>20</span>
          <span>30</span>
          <span>40</span>
          <span>50</span>
          <span>40</span>
          <span>30</span>
        </div>

        {/* DEFENSE ZONE HEADER */}
        <div className="gridiron-zone-banner defense-zone-banner" aria-hidden="true">
          🛡️ OPPOSING DEFENSIVE UNIT
        </div>

        {/* GLOWING LINE OF SCRIMMAGE */}
        <div className="scrimmage-line-bar" aria-label="Line of Scrimmage">
          <div className="scrimmage-line-laser"></div>
          <span className="scrimmage-badge">⚡ LINE OF SCRIMMAGE ⚡</span>
        </div>

        {/* OFFENSE ZONE HEADER */}
        <div className="gridiron-zone-banner offense-zone-banner" aria-hidden="true">
          ⚡ OFFENSIVE FORMATION (PASS & RUN SPREAD)
        </div>

        {/* Roster slots overlaid on gridiron */}
        <ul className="roster-list board-roster-list">
          {slots.map((slot) => {
            const coord = NFL_COORDS[slot.role] || { x: 50, y: 50, label: slot.role }
            const isTargeted = targetedSlotIndex === slot.index
            return (
              <BoardSlotToken
                key={slot.id}
                slot={slot}
                coord={coord}
                isTargeted={isTargeted}
                onSlotClick={onSlotClick}
              />
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/**
 * Universal Sports Board selector component.
 */
export default function SportsBoard({
  sportId,
  slots,
  soccerFormation,
  onSoccerFormationChange,
  targetedSlotIndex,
  onSlotClick,
}) {
  if (sportId === 'soccer') {
    return (
      <SoccerPitchBoard
        slots={slots}
        formation={soccerFormation}
        onFormationChange={onSoccerFormationChange}
        targetedSlotIndex={targetedSlotIndex}
        onSlotClick={onSlotClick}
      />
    )
  }

  if (sportId === 'nba') {
    return (
      <NbaCourtBoard
        slots={slots}
        targetedSlotIndex={targetedSlotIndex}
        onSlotClick={onSlotClick}
      />
    )
  }

  if (sportId === 'nfl') {
    return (
      <NflGridironBoard
        slots={slots}
        targetedSlotIndex={targetedSlotIndex}
        onSlotClick={onSlotClick}
      />
    )
  }

  return null
}
