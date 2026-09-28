import React, { useEffect, useRef, useState } from 'react'
import { SPORTS } from './data/catalog.js'
import SportsBoard from './components/SportsBoard.jsx'
import { playTickSound, playWinChime } from './lib/audio.js'
import {
  createRun,
  getCompatibleOpenSlots,
  isComplete,
  rerollDraw,
  rerollEra,
  rerollTeam,
  selectPlayer,
  simulateSeason,
  spinDraw,
} from './lib/gameEngine.js'

export default function App({ random = Math.random }) {
  const [selectedSportId, setSelectedSportId] = useState(null)
  const [run, setRun] = useState(null)
  const [targetedSlotIndex, setTargetedSlotIndex] = useState(null)
  const [seasonResult, setSeasonResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [announcement, setAnnouncement] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soccerFormation, setSoccerFormation] = useState('4-3-3')
  const [rosterDisplayMode, setRosterDisplayMode] = useState('board')

  // Catalog encyclopedia modal state
  const [showCatalogModal, setShowCatalogModal] = useState(false)
  const [catalogSportFilter, setCatalogSportFilter] = useState('nba')
  const [catalogSearch, setCatalogSearch] = useState('')

  // Slot machine animation state
  const [isSpinning, setIsSpinning] = useState(false)
  const [reelTeam, setReelTeam] = useState('???')
  const [reelEra, setReelEra] = useState('???')

  const spinTimerRef = useRef(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (spinTimerRef.current) clearInterval(spinTimerRef.current)
    }
  }, [])

  const currentSport = selectedSportId ? SPORTS[selectedSportId] : null
  const totalEras = Object.values(SPORTS).reduce((sum, s) => sum + s.draws.length, 0)

  function handleSelectSport(sportId) {
    setSelectedSportId(sportId)
    setCatalogSportFilter(sportId)
    const newRun = createRun(sportId, SPORTS[sportId])
    setRun(newRun)
    setTargetedSlotIndex(null)
    setSeasonResult(null)
    setErrorMessage(null)
    setReelTeam('???')
    setReelEra('???')
    setSoccerFormation('4-3-3')
    setRosterDisplayMode('board')
    setAnnouncement(`Started ${SPORTS[sportId].label} draft. Choose positions freely or spin the wheel.`)
  }

  function triggerSlotAnimation(finalDraw, onComplete, mode = 'both') {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') {
      setReelTeam(finalDraw.franchise)
      setReelEra(finalDraw.era)
      onComplete()
      return
    }

    setIsSpinning(true)
    const allDraws = currentSport.draws
    let step = 0
    const totalSteps = 16

    if (spinTimerRef.current) clearInterval(spinTimerRef.current)

    spinTimerRef.current = setInterval(() => {
      step += 1
      const randDraw = allDraws[Math.floor(Math.random() * allDraws.length)]
      if (mode === 'both' || mode === 'team') {
        setReelTeam(randDraw.franchise)
      }
      if (mode === 'both' || mode === 'era') {
        setReelEra(randDraw.era)
      }
      playTickSound(soundEnabled)

      if (step >= totalSteps) {
        clearInterval(spinTimerRef.current)
        setReelTeam(finalDraw.franchise)
        setReelEra(finalDraw.era)
        setIsSpinning(false)
        playWinChime(soundEnabled)
        onComplete()
      }
    }, 60)
  }

  function handleSpin() {
    try {
      setErrorMessage(null)
      const nextRun = spinDraw(run, currentSport, random)
      triggerSlotAnimation(nextRun.activeDraw, () => {
        setRun(nextRun)
        setAnnouncement(`Draw landed on ${nextRun.activeDraw.franchise} (${nextRun.activeDraw.era}).`)
      }, 'both')
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  function handleRerollTeam() {
    try {
      setErrorMessage(null)
      const nextRun = rerollTeam(run, currentSport, random)
      triggerSlotAnimation(nextRun.activeDraw, () => {
        setRun(nextRun)
        setAnnouncement(`Re-rolled team to ${nextRun.activeDraw.franchise} (${nextRun.activeDraw.era}).`)
      }, 'team')
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  function handleRerollEra() {
    try {
      setErrorMessage(null)
      const nextRun = rerollEra(run, currentSport, random)
      triggerSlotAnimation(nextRun.activeDraw, () => {
        setRun(nextRun)
        setAnnouncement(`Re-rolled era to ${nextRun.activeDraw.era} for ${nextRun.activeDraw.franchise}.`)
      }, 'era')
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  function handleReroll() {
    try {
      setErrorMessage(null)
      const nextRun = rerollDraw(run, currentSport, random)
      triggerSlotAnimation(nextRun.activeDraw, () => {
        setRun(nextRun)
        setAnnouncement(`Re-rolled to ${nextRun.activeDraw.franchise} (${nextRun.activeDraw.era}).`)
      }, 'both')
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  function handleDraftPlayer(player, slotIndex = null) {
    try {
      setErrorMessage(null)
      const target = slotIndex !== null ? slotIndex : targetedSlotIndex
      const updatedRun = selectPlayer(run, player, target)
      setRun(updatedRun)
      setTargetedSlotIndex(null)
      setAnnouncement(`Drafted ${player.name} (${player.rating}).`)
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  function handleSlotClick(slot) {
    if (slot.player) return // Already filled
    if (targetedSlotIndex === slot.index) {
      setTargetedSlotIndex(null) // deselect
    } else {
      setTargetedSlotIndex(slot.index)
    }
  }

  function handleSimulate() {
    try {
      setErrorMessage(null)
      const result = simulateSeason(run, currentSport, random)
      setSeasonResult(result)
      const recordStr =
        currentSport.recordType === 'wins-draws-losses'
          ? `${result.record.wins}-${result.record.draws}-${result.record.losses}`
          : `${result.record.wins}-${result.record.losses}`
      setAnnouncement(`Season simulation complete. Final record: ${recordStr}.`)
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  function handleRestart() {
    setSelectedSportId(null)
    setRun(null)
    setTargetedSlotIndex(null)
    setSeasonResult(null)
    setErrorMessage(null)
    setReelTeam('???')
    setReelEra('???')
    setSoccerFormation('4-3-3')
    setRosterDisplayMode('board')
    setAnnouncement('Game reset. Select a sport to begin a new run.')
  }

  const complete = run && currentSport ? isComplete(run, currentSport) : false
  const filledCount = run ? run.slots.filter((s) => s.player !== null).length : 0
  const targetedSlot = targetedSlotIndex !== null && run ? run.slots[targetedSlotIndex] : null
  const teamRerollsLeft = run ? Math.max(0, 1 - (run.teamRerollsUsed || 0)) : 1
  const eraRerollsLeft = run ? Math.max(0, 1 - (run.eraRerollsUsed || 0)) : 1

  return (
    <main className={`app-container sport-${selectedSportId || 'none'}`}>
      <header className="app-header">
        <div className="header-top-bar">
          <h1>Perfect Season</h1>
          <button
            type="button"
            className="sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            title={soundEnabled ? 'Sound ON' : 'Sound OFF'}
          >
            {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
          </button>
        </div>
        <p className="subtitle">Draft historical icons with casino spins. Chase perfection.</p>
      </header>

      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      {errorMessage && (
        <div role="alert" className="error-banner">
          {errorMessage}
        </div>
      )}

      {/* VIEW 1: Sport Selection */}
      {!selectedSportId && (
        <section className="view-card sport-select-view">
          <h2>Pick your sport</h2>
          <p>
            Choose your sport to enter the draft lottery, assign players to the tactical positions you choose, and chase an undefeated season!
          </p>
          <div className="sport-preview-grid">
            <div className="sport-card sport-card-nba">
              <h3>NBA Basketball</h3>
              <p>Starting Five: PG, SG, SF, PF, C</p>
              <span className="season-tag">82-Game Season</span>
            </div>
            <div className="sport-card sport-card-soccer">
              <h3>Soccer Football</h3>
              <p>Full Starting XI: 1 GK, 4 DEF, 3 MID, 2 WINGS, 1 ST</p>
              <span className="season-tag">38-Match Season (W-D-L)</span>
            </div>
            <div className="sport-card sport-card-nfl">
              <h3>NFL Football</h3>
              <p>8-Player Lineup: 1 QB, 2 RB, 3 WR, 1 TE, 1 DEF</p>
              <span className="season-tag">17-Game Season</span>
            </div>
          </div>
          <div className="button-group sport-buttons">
            {Object.values(SPORTS).map((sport) => (
              <button
                key={sport.id}
                type="button"
                className={`btn btn-sport btn-${sport.id}`}
                onClick={() => handleSelectSport(sport.id)}
              >
                Play {sport.label}
              </button>
            ))}
          </div>
          <div className="catalog-browse-bar">
            <button
              type="button"
              className="btn btn-browse-catalog"
              onClick={() => setShowCatalogModal(true)}
            >
              📖 Browse All Teams, Eras & Rosters ({totalEras} Eras)
            </button>
          </div>
        </section>
      )}

      {/* VIEW 2: Draft Mode */}
      {selectedSportId && !seasonResult && (
        <section className="view-card draft-view">
          <div className="draft-header">
            <div>
              <h2>{currentSport.label} Draft Room</h2>
              <span className="roster-progress-badge">
                {filledCount} of {currentSport.roles.length} Slots Filled
              </span>
            </div>
            <div className="draft-header-actions">
              <button
                type="button"
                className="btn btn-browse-catalog-sm"
                onClick={() => {
                  setCatalogSportFilter(selectedSportId)
                  setShowCatalogModal(true)
                }}
              >
                📖 Teams & Rosters
              </button>
              <button type="button" className="btn btn-secondary btn-restart" onClick={handleRestart}>
                Abandon & Restart
              </button>
            </div>
          </div>

          {/* Interactive Roster Board / Field Layout */}
          <div className="roster-status">
            <div className="roster-section-header">
              <div>
                <h3>
                  {rosterDisplayMode === 'board'
                    ? `${currentSport.label} Tactical Field / Court Board`
                    : 'Your Roster List'}
                </h3>
                <p className="roster-subtitle">
                  {rosterDisplayMode === 'board'
                    ? 'Click any open position on the field or court to target it, or choose position when drafting.'
                    : 'Click an open position to target, or choose position when drafting.'}
                </p>
              </div>

              <div className="roster-header-controls">
                {targetedSlot && (
                  <span className="targeted-indicator">
                    Targeting: <strong>{targetedSlot.role}</strong> (Slot #{targetedSlot.index + 1})
                  </span>
                )}
                <div className="view-toggle-pills" role="group" aria-label="Lineup View Mode">
                  <button
                    type="button"
                    className={`btn-view-pill ${rosterDisplayMode === 'board' ? 'active' : ''}`}
                    onClick={() => setRosterDisplayMode('board')}
                    aria-pressed={rosterDisplayMode === 'board'}
                  >
                    🏟️ Field / Court View
                  </button>
                  <button
                    type="button"
                    className={`btn-view-pill ${rosterDisplayMode === 'list' ? 'active' : ''}`}
                    onClick={() => setRosterDisplayMode('list')}
                    aria-pressed={rosterDisplayMode === 'list'}
                  >
                    📋 List View
                  </button>
                </div>
              </div>
            </div>

            {rosterDisplayMode === 'board' ? (
              <SportsBoard
                sportId={selectedSportId}
                slots={run.slots}
                soccerFormation={soccerFormation}
                onSoccerFormationChange={setSoccerFormation}
                targetedSlotIndex={targetedSlotIndex}
                onSlotClick={handleSlotClick}
              />
            ) : (
              <ul className="roster-list">
                {run.slots.map((slot) => {
                  const isTargeted = targetedSlotIndex === slot.index
                  return (
                    <li
                      key={slot.id}
                      className={`roster-slot ${slot.player ? 'filled' : 'empty'} ${isTargeted ? 'targeted' : ''}`}
                      onClick={() => handleSlotClick(slot)}
                      role={slot.player ? undefined : 'button'}
                      tabIndex={slot.player ? undefined : 0}
                      aria-label={
                        slot.player
                          ? `${slot.role}: ${slot.player.name}`
                          : `Open slot ${slot.index + 1}: ${slot.role}. Click to target.`
                      }
                    >
                      <div className="slot-header">
                        <span className="slot-role">{slot.role}</span>
                        <span className="slot-num">#{slot.index + 1}</span>
                      </div>
                      {slot.player ? (
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
                })}
              </ul>
            )}
          </div>

          {!complete ? (
            <div className="draft-action-container">
              {/* CASINO SLOT MACHINE */}
              <div className={`casino-slot-machine ${isSpinning ? 'spinning' : ''}`}>
                <div className="slot-machine-marquee">
                  <span className="bulb"></span>
                  <span className="bulb"></span>
                  <span className="marquee-title">★ FRANCHISE LOTTERY WHEEL ★</span>
                  <span className="bulb"></span>
                  <span className="bulb"></span>
                </div>

                <div className="slot-reels-display">
                  <div className="slot-reel reel-team">
                    <span className="reel-label">FRANCHISE</span>
                    <div className="reel-window">
                      <span className="reel-value">{run.activeDraw ? run.activeDraw.franchise : reelTeam}</span>
                    </div>
                  </div>

                  <div className="slot-reel-divider">✦</div>

                  <div className="slot-reel reel-era">
                    <span className="reel-label">ERA</span>
                    <div className="reel-window">
                      <span className="reel-value">{run.activeDraw ? run.activeDraw.era : reelEra}</span>
                    </div>
                  </div>
                </div>

                <div className="slot-machine-controls">
                  {!run.activeDraw ? (
                    <button
                      type="button"
                      className="btn btn-spin-slot"
                      onClick={handleSpin}
                      disabled={isSpinning}
                    >
                      {isSpinning ? 'SPINNING...' : '🎰 SPIN FOR A TEAM AND ERA'}
                    </button>
                  ) : (
                    <div className="reroll-bar">
                      <button
                        type="button"
                        className="btn btn-reroll btn-reroll-team"
                        onClick={handleRerollTeam}
                        disabled={isSpinning || teamRerollsLeft <= 0}
                        aria-label="Re-roll team"
                      >
                        🎲 Re-roll Team ({teamRerollsLeft} left)
                      </button>
                      <button
                        type="button"
                        className="btn btn-reroll btn-reroll-era"
                        onClick={handleRerollEra}
                        disabled={isSpinning || eraRerollsLeft <= 0}
                        aria-label="Re-roll era"
                      >
                        ⏳ Re-roll Era ({eraRerollsLeft} left)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* CANDIDATES LIST WITH EXPLICIT POSITION CHOOSERS */}
              {run.activeDraw && (
                <div className="active-draw-area">
                  <div className="draw-title-bar">
                    <h3>
                      {run.activeDraw.franchise} ({run.activeDraw.era}) Roster
                    </h3>
                    <p className="draw-instructions">
                      Choose which position to play your player at. Defenders must play defense, midfielders in midfield, and attackers in attack!
                    </p>
                  </div>

                  <div className="candidates-list">
                    {run.activeDraw.candidates.map((player) => {
                      const compatibleOpenSlots = getCompatibleOpenSlots(run, player)
                      const hasOpenSlot = compatibleOpenSlots.length > 0

                      return (
                        <div
                          key={player.id}
                          className={`candidate-card ${hasOpenSlot ? 'eligible' : 'ineligible'}`}
                        >
                          <div className="card-top">
                            <span className="candidate-name">{player.name}</span>
                            <span className="candidate-rating">{player.rating}</span>
                          </div>

                          <div className="candidate-positions">
                            <span className="pos-label">Eligible Positions:</span>
                            {player.roles.map((r) => (
                              <span key={r} className="pos-badge">
                                {r}
                              </span>
                            ))}
                          </div>

                          <div className="candidate-stats">{player.stats}</div>

                          {/* POSITIONAL SELECTION BUTTONS */}
                          <div className="card-draft-actions">
                            {hasOpenSlot ? (
                              targetedSlotIndex !== null &&
                              compatibleOpenSlots.some((s) => s.index === targetedSlotIndex) ? (
                                <button
                                  type="button"
                                  className="btn btn-candidate"
                                  onClick={() => handleDraftPlayer(player, targetedSlotIndex)}
                                  disabled={isSpinning}
                                >
                                  Draft to {targetedSlot.role} #{targetedSlot.index + 1}
                                </button>
                              ) : (
                                <div className="position-select-panel">
                                  <span className="choose-pos-prompt">Choose position:</span>
                                  <div className="pos-button-group">
                                    {compatibleOpenSlots.map((slot) => (
                                      <button
                                        key={slot.id}
                                        type="button"
                                        className="btn btn-pos-choice"
                                        aria-label={`Draft ${player.name} as ${slot.role}`}
                                        onClick={() => handleDraftPlayer(player, slot.index)}
                                        disabled={isSpinning}
                                      >
                                        Draft as {slot.role}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )
                            ) : (
                              <button type="button" className="btn btn-candidate" disabled>
                                (All eligible positions full)
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="simulate-ready-card">
              <h3>🏆 Roster Complete!</h3>
              <p>All {currentSport.roles.length} positions are locked in. Ready to simulate your season?</p>
              <button
                type="button"
                className="btn btn-primary btn-simulate"
                onClick={handleSimulate}
              >
                Simulate {currentSport.seasonLength}-game season
              </button>
            </div>
          )}
        </section>
      )}

      {/* VIEW 3: Results View */}
      {seasonResult && (
        <section className="view-card results-view">
          <div className="results-header">
            <h2>Season Simulation Results</h2>
            <button
              type="button"
              className="btn btn-primary btn-new-game"
              onClick={handleRestart}
            >
              Start a new game
            </button>
          </div>

          <div className="results-summary">
            <div className="summary-stat">
              <span className="stat-label">Final Record</span>
              <span className="stat-value record-value">
                {currentSport.recordType === 'wins-draws-losses'
                  ? `${seasonResult.record.wins}W - ${seasonResult.record.draws}D - ${seasonResult.record.losses}L`
                  : `${seasonResult.record.wins}W - ${seasonResult.record.losses}L`}
              </span>
            </div>

            <div className="summary-stat">
              <span className="stat-label">Average Roster Rating</span>
              <span className="stat-value">{seasonResult.averageRating}</span>
            </div>

            <div className="summary-stat">
              <span className="stat-label">Re-rolls Used</span>
              <span className="stat-value">
                Team: {run.teamRerollsUsed || 0}/1 · Era: {run.eraRerollsUsed || 0}/1
              </span>
            </div>

            {seasonResult.record.wins === currentSport.seasonLength && (
              <div className="perfect-season-banner">
                🌟 UNBELIEVABLE! PERFECT SEASON ACHIEVED! UNDEFEATED CHAMPIONS! 🌟
              </div>
            )}
          </div>

          <div className="disclaimer-note">
            <em>Disclaimer: Player ratings and stats are curated for entertainment only and do not represent an official or analytical ranking.</em>
          </div>

          {/* Roster Recap with Player Stats */}
          <div className="roster-recap">
            <h3>Championship Tactical Lineup</h3>
            <SportsBoard
              sportId={selectedSportId}
              slots={run.slots}
              soccerFormation={soccerFormation}
              onSoccerFormationChange={setSoccerFormation}
              targetedSlotIndex={null}
              onSlotClick={() => {}}
            />

            <h3 style={{ marginTop: '2rem' }}>Player Details & Season Accolades</h3>
            <div className="recap-grid">
              {run.slots.map((slot) => (
                <div key={slot.id} className="recap-card">
                  <div className="recap-card-header">
                    <span className="recap-pos">{slot.role}</span>
                    <span className="recap-rating">{slot.player.rating}</span>
                  </div>
                  <strong className="recap-name">{slot.player.name}</strong>
                  <div className="recap-stats">{slot.player.stats}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Table */}
          <div className="schedule-results">
            <h3>Full Season Schedule ({seasonResult.results.length} Games)</h3>
            <div className="table-wrapper">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th scope="col">Game / Match</th>
                    <th scope="col">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {seasonResult.results.map((res) => (
                    <tr key={res.number} className={`row-outcome-${res.outcome.toLowerCase()}`}>
                      <td>{res.number}</td>
                      <td>
                        <span className={`badge badge-${res.outcome.toLowerCase()}`}>
                          {res.outcome === 'W' ? 'Win' : res.outcome === 'D' ? 'Draw' : 'Loss'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="results-actions">
            <button
              type="button"
              className="btn btn-primary btn-new-game"
              onClick={handleRestart}
            >
              Start a new game
            </button>
          </div>
        </section>
      )}

      {/* VIEW 4: Catalog Encyclopedia Modal */}
      {showCatalogModal && (
        <div className="modal-backdrop" onClick={() => setShowCatalogModal(false)}>
          <div
            className="catalog-modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-title"
          >
            <div className="catalog-modal-header">
              <h2 id="catalog-title">📖 Historical Teams & Rosters Encyclopedia</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowCatalogModal(false)}
                aria-label="Close encyclopedia"
              >
                ✕
              </button>
            </div>

            <div className="catalog-controls">
              <div className="catalog-sport-tabs">
                {Object.values(SPORTS).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`catalog-tab-btn ${catalogSportFilter === s.id ? 'active' : ''}`}
                    onClick={() => setCatalogSportFilter(s.id)}
                  >
                    {s.label} ({s.draws.length} Eras)
                  </button>
                ))}
              </div>
              <input
                type="search"
                className="catalog-search-input"
                placeholder="Search team, era, player or stat..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                aria-label="Filter teams and players"
              />
            </div>

            <div className="catalog-draws-container">
              {SPORTS[catalogSportFilter].draws
                .filter((draw) => {
                  if (!catalogSearch.trim()) return true
                  const query = catalogSearch.toLowerCase()
                  return (
                    draw.franchise.toLowerCase().includes(query) ||
                    draw.era.toLowerCase().includes(query) ||
                    draw.players.some(
                      (p) =>
                        p.name.toLowerCase().includes(query) ||
                        p.stats.toLowerCase().includes(query) ||
                        p.roles.some((r) => r.toLowerCase().includes(query)),
                    )
                  )
                })
                .map((draw) => (
                  <div key={`${draw.franchise}-${draw.era}`} className="catalog-team-card">
                    <div className="catalog-team-header">
                      <h3>{draw.franchise}</h3>
                      <span className="catalog-era-badge">{draw.era}</span>
                    </div>
                    <div className="catalog-roster-table">
                      {[...draw.players]
                        .sort((a, b) => b.rating - a.rating)
                        .map((p) => (
                        <div key={p.id} className="catalog-player-row">
                          <span className="catalog-player-name">{p.name}</span>
                          <div className="catalog-player-roles">
                            {p.roles.map((r) => (
                              <span key={r} className="pos-badge-sm">
                                {r}
                              </span>
                            ))}
                          </div>
                          <span className="catalog-player-rating">{p.rating}</span>
                          <span className="catalog-player-stats">{p.stats}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
