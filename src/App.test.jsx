import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'
import { SPORTS } from './data/catalog.js'

describe('App', () => {
  it('starts an NBA draft and shows casino slot reels and player stats', async () => {
    const user = userEvent.setup()
    render(<App random={() => 0} />)
    await user.click(screen.getByRole('button', { name: /play nba/i }))

    expect(screen.getByText(/0 of 5 slots filled/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /spin for a team and era/i }))

    expect(screen.getByRole('heading', { name: /chicago bulls/i })).toBeInTheDocument()
    // Verify player stats are displayed on the card
    expect(screen.getByText(/30.4 PPG/i)).toBeInTheDocument()
  })

  it('allows separate team and era re-rolls with 1 of each', async () => {
    let rollIndex = 0
    // Roll 1: Bulls (0)
    // Roll 2 (Team re-roll): Lakers (0 in non-Bulls pool)
    // Roll 3 (Era re-roll): 2000-2001 Lakers (0 in other Lakers eras)
    const rolls = [0, 0, 0]
    const user = userEvent.setup()
    render(<App random={() => rolls[rollIndex++ % rolls.length]} />)
    await user.click(screen.getByRole('button', { name: /play nba/i }))

    await user.click(screen.getByRole('button', { name: /spin for a team and era/i }))
    expect(screen.getByRole('heading', { name: /chicago bulls \(1990s\)/i })).toBeInTheDocument()

    const teamBtn = screen.getByRole('button', { name: /re-roll team/i })
    const eraBtn = screen.getByRole('button', { name: /re-roll era/i })

    expect(teamBtn).toHaveTextContent(/1 left/i)
    expect(eraBtn).toHaveTextContent(/1 left/i)

    // Re-roll Team (discrete: changes team to Lakers, keeps era 1990s)
    await user.click(teamBtn)
    expect(screen.getByRole('heading', { name: /los angeles lakers \(1990s\)/i })).toBeInTheDocument()
    expect(teamBtn).toHaveTextContent(/0 left/i)
    expect(teamBtn).toBeDisabled()
    expect(eraBtn).toHaveTextContent(/1 left/i)
    expect(eraBtn).not.toBeDisabled()

    // Re-roll Era (discrete: keeps team Lakers, changes era to 1980s)
    await user.click(eraBtn)
    expect(screen.getByRole('heading', { name: /los angeles lakers \(1980s\)/i })).toBeInTheDocument()
    expect(eraBtn).toHaveTextContent(/0 left/i)
    expect(eraBtn).toBeDisabled()
  })

  it('allows targeting a specific slot and fills an NFL 8-player roster', async () => {
    const user = userEvent.setup()
    render(<App random={() => 0} />)
    await user.click(screen.getByRole('button', { name: /play nfl/i }))

    // Target the DEF slot directly (Slot #8)
    const defSlot = screen.getByRole('button', { name: /open slot 8: def/i })
    await user.click(defSlot)
    expect(screen.getByText(/targeting:/i)).toBeInTheDocument()

    // Spin San Francisco 49ers (1989)
    await user.click(screen.getByRole('button', { name: /spin for a team and era/i }))
    // Draft 49ers Defense directly into the targeted slot
    await user.click(screen.getByRole('button', { name: /draft to def #8/i }))

    // Slot 8 should now be filled with 49ers Defense
    expect(screen.getByText('49ers Defense', { selector: '.player-name' })).toBeInTheDocument()

    // Fill the remaining 7 positions freely
    for (let pick = 1; pick < 8; pick += 1) {
      await user.click(screen.getByRole('button', { name: /spin for a team and era/i }))
      const draftableButtons = screen.getAllByRole('button', { name: /draft /i })
      await user.click(draftableButtons[0])
    }

    // Now all 8 slots are filled, simulate the 17-game season
    await user.click(screen.getByRole('button', { name: /simulate 17-game season/i }))
    expect(screen.getByRole('heading', { name: /season simulation results/i })).toBeInTheDocument()

    // Reset game
    await user.click(screen.getAllByRole('button', { name: /start a new game/i })[0])
    expect(screen.getByRole('heading', { name: /pick your sport/i })).toBeInTheDocument()
  })

  it('completes a soccer draft with full XI (11 players) and simulates 38-match season', async () => {
    const user = userEvent.setup()
    render(<App random={() => 0.05} />)
    await user.click(screen.getByRole('button', { name: /play soccer/i }))

    for (let pick = 0; pick < 11; pick += 1) {
      await user.click(screen.getByRole('button', { name: /spin for a team and era/i }))
      const draftableButtons = screen.getAllByRole('button', { name: /draft /i })
      await user.click(draftableButtons[0])
    }

    await user.click(screen.getByRole('button', { name: /simulate 38-game season/i }))
    expect(screen.getByRole('heading', { name: /season simulation results/i })).toBeInTheDocument()
    expect(screen.getByText(/full season schedule \(38 games\)/i)).toBeInTheDocument()
    expect(screen.getByText('Final Record')).toBeInTheDocument()
  })

  it('allows user to explicitly choose position for versatile players like LeBron James', async () => {
    const heatIndex = SPORTS.nba.draws.findIndex((d) => d.franchise === 'Miami Heat')
    const user = userEvent.setup()
    render(<App random={() => heatIndex / SPORTS.nba.draws.length} />)
    await user.click(screen.getByRole('button', { name: /play nba/i }))
    await user.click(screen.getByRole('button', { name: /spin for a team and era/i }))

    expect(screen.getByRole('heading', { name: /miami heat/i })).toBeInTheDocument()

    // Verify LeBron James has position choices: PG, SG, SF, PF
    const draftAsPg = screen.getByRole('button', { name: /draft lebron james as pg/i })
    expect(draftAsPg).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /draft lebron james as sg/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /draft lebron james as sf/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /draft lebron james as pf/i })).toBeInTheDocument()

    // User chooses to play LeBron at Point Guard
    await user.click(draftAsPg)

    // Slot 1 (PG) should now have LeBron James
    expect(screen.getByText('LeBron James', { selector: '.player-name' })).toBeInTheDocument()
  })

  it('toggles sound on and off', async () => {
    const user = userEvent.setup()
    render(<App random={() => 0} />)
    const soundBtn = screen.getByRole('button', { name: /mute sound effects/i })
    expect(soundBtn).toHaveTextContent(/sound on/i)
    await user.click(soundBtn)
    expect(screen.getByRole('button', { name: /enable sound effects/i })).toHaveTextContent(/sound off/i)
  })

  it('opens historical teams encyclopedia and allows searching', async () => {
    const user = userEvent.setup()
    render(<App random={() => 0} />)

    // Open catalog from sport selection screen
    await user.click(screen.getByRole('button', { name: /browse all teams, eras & rosters/i }))
    expect(screen.getByRole('heading', { name: /historical teams & rosters encyclopedia/i })).toBeInTheDocument()

    // Switch to NFL tab
    await user.click(screen.getByRole('button', { name: /nfl \(/i }))
    expect(screen.getAllByRole('heading', { name: /san francisco 49ers/i }).length).toBeGreaterThanOrEqual(1)

    // Search for a specific player like "Myles Garrett" or "Blake Bortles"
    const searchInput = screen.getByRole('searchbox', { name: /filter teams and players/i })
    await user.type(searchInput, 'Bortles')
    expect(screen.getByRole('heading', { name: /jacksonville jaguars/i })).toBeInTheDocument()

    // Close modal
    await user.click(screen.getByRole('button', { name: /close encyclopedia/i }))
    expect(screen.queryByRole('heading', { name: /historical teams & rosters encyclopedia/i })).not.toBeInTheDocument()
  })

  it('renders soccer starting 11 on the pitch and allows switching formations freely without altering results', async () => {
    const user = userEvent.setup()
    render(<App random={() => 0} />)
    await user.click(screen.getByRole('button', { name: /play soccer/i }))

    // Default formation is 4-3-3
    expect(screen.getByText(/4-3-3 \(attacking wide\)/i)).toBeInTheDocument()
    const form433Btn = screen.getByRole('button', { name: '4-3-3' })
    expect(form433Btn).toHaveAttribute('aria-pressed', 'true')

    // All 11 slots are present on the pitch
    expect(screen.getByRole('button', { name: /open slot 1: gk/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open slot 2: lb/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open slot 10: st/i })).toBeInTheDocument()

    // Switch to 4-4-2
    const form442Btn = screen.getByRole('button', { name: '4-4-2' })
    await user.click(form442Btn)
    expect(screen.getByText(/4-4-2 \(classic flat\)/i)).toBeInTheDocument()
    expect(form442Btn).toHaveAttribute('aria-pressed', 'true')
    expect(form433Btn).toHaveAttribute('aria-pressed', 'false')

    // Switch to 3-5-2
    const form352Btn = screen.getByRole('button', { name: '3-5-2' })
    await user.click(form352Btn)
    expect(screen.getByText(/3-5-2 \(wing-backs\)/i)).toBeInTheDocument()
    expect(form352Btn).toHaveAttribute('aria-pressed', 'true')

    // Switch to 4-2-3-1
    const form4231Btn = screen.getByRole('button', { name: '4-2-3-1' })
    await user.click(form4231Btn)
    expect(screen.getByText(/4-2-3-1 \(modern pivot\)/i)).toBeInTheDocument()
  })

  it('renders NBA starting 5 on half court with tactical markings and slot targeting', async () => {
    const user = userEvent.setup()
    render(<App random={() => 0} />)
    await user.click(screen.getByRole('button', { name: /play nba/i }))

    // Verify NBA court legend & zones
    expect(screen.getByText(/starting 5 half-court/i)).toBeInTheDocument()
    expect(screen.getByText(/the paint/i)).toBeInTheDocument()
    expect(screen.getByText(/3-point arc/i)).toBeInTheDocument()

    // Verify 5 starting slots on the court
    expect(screen.getByRole('button', { name: /open slot 1: pg/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open slot 2: sg/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open slot 3: sf/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open slot 4: pf/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open slot 5: c/i })).toBeInTheDocument()

    // Target the Point Guard slot
    await user.click(screen.getByRole('button', { name: /open slot 1: pg/i }))
    expect(screen.getByText(/targeting:/i)).toHaveTextContent(/pg/i)
  })

  it('renders NFL gridiron with offense and defense on opposite sides of the line of scrimmage', async () => {
    const user = userEvent.setup()
    render(<App random={() => 0} />)
    await user.click(screen.getByRole('button', { name: /play nfl/i }))

    // Verify Line of Scrimmage and zone markings
    expect(screen.getByLabelText(/line of scrimmage/i)).toBeInTheDocument()
    expect(screen.getByText(/opposing defensive unit/i)).toBeInTheDocument()
    expect(screen.getByText(/offensive formation/i)).toBeInTheDocument()

    // Verify defensive unit slot across the line of scrimmage
    expect(screen.getByRole('button', { name: /open slot 8: def/i })).toBeInTheDocument()

    // Verify offensive lineup positions behind the line
    expect(screen.getByRole('button', { name: /open slot 1: qb/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open slot 2: rb1/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open slot 3: rb2/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open slot 4: wr1/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open slot 5: wr2/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open slot 6: wr3/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /open slot 7: te/i })).toBeInTheDocument()
  })

  it('toggles between tactical board view and classic card list view', async () => {
    const user = userEvent.setup()
    render(<App random={() => 0} />)
    await user.click(screen.getByRole('button', { name: /play nba/i }))

    // Initially in Tactical Board view
    expect(screen.getByText(/nba tactical field \/ court board/i)).toBeInTheDocument()

    // Switch to List View
    await user.click(screen.getByRole('button', { name: /list view/i }))
    expect(screen.getByText(/your roster list/i)).toBeInTheDocument()

    // Switch back to Board View
    await user.click(screen.getByRole('button', { name: /field \/ court view/i }))
    expect(screen.getByText(/nba tactical field \/ court board/i)).toBeInTheDocument()
  })

  it('orders soccer candidate players strictly from top overall to bottom overall', async () => {
    const user = userEvent.setup()
    render(<App random={() => 0} />)
    await user.click(screen.getByRole('button', { name: /play soccer/i }))
    await user.click(screen.getByRole('button', { name: /spin for a team and era/i }))

    // Draw is Arsenal (2000s)
    expect(screen.getByRole('heading', { name: /arsenal \(2000s\)/i })).toBeInTheDocument()

    // Candidates must be ordered from highest rating (top overall) to lowest rating (bottom overall)
    const candidateCards = screen.getAllByText(/\d{2}/, { selector: '.candidate-rating' })
    const ratings = candidateCards.map((el) => Number.parseInt(el.textContent, 10))

    expect(ratings.length).toBeGreaterThanOrEqual(10)
    expect(ratings[0]).toBe(98) // Thierry Henry (98) is at the very top!
    for (let i = 0; i < ratings.length - 1; i++) {
      expect(ratings[i]).toBeGreaterThanOrEqual(ratings[i + 1])
    }
  })
})

