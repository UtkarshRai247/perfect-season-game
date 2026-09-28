import { describe, expect, it } from 'vitest'
import { SPORTS } from '../data/catalog.js'
import {
  createRun,
  getCompatibleOpenSlots,
  isComplete,
  isSlotCompatible,
  rerollDraw,
  rerollEra,
  rerollTeam,
  selectPlayer,
  simulateSeason,
  spinDraw,
  spinForCurrentRole,
} from './gameEngine.js'

const nba = SPORTS.nba
const soccer = SPORTS.soccer
const nfl = SPORTS.nfl

describe('game engine draft rules', () => {
  it('creates an initialized run with sport slots', () => {
    const run = createRun('nba', nba)
    expect(run.slots).toHaveLength(5)
    expect(run.slots.map((s) => s.role)).toEqual(['PG', 'SG', 'SF', 'PF', 'C'])
    expect(run.picks).toHaveLength(0)
    expect(run.rerollsUsed).toBe(0)
  })

  it('spins a random team and era draw with eligible candidates', () => {
    const run = createRun('nba', nba)
    const spun = spinDraw(run, nba, () => 0)
    expect(spun.activeDraw.franchise).toBe('Chicago Bulls')
    expect(spun.activeDraw.candidates.length).toBeGreaterThan(0)
  })

  it('spins candidates eligible for the first open role when called via legacy helper', () => {
    const run = createRun('nba', nba)
    const spun = spinForCurrentRole(run, nba, () => 0)
    expect(spun.activeDraw.role).toBe('PG')
    expect(spun.activeDraw.candidates.some((player) => isSlotCompatible({ role: 'PG' }, player))).toBe(true)
  })

  it('allows user to choose position for versatile players like LeBron James (PG, SG, SF, PF)', () => {
    const run = createRun('nba', nba)
    // Find Miami Heat draw
    const heatDraw = nba.draws.find((d) => d.franchise === 'Miami Heat')
    const lebron = heatDraw.players.find((p) => p.name.includes('LeBron'))
    expect(lebron).toBeDefined()

    // Verify LeBron is compatible with PG, SG, SF, PF but NOT C
    expect(isSlotCompatible({ role: 'PG' }, lebron)).toBe(true)
    expect(isSlotCompatible({ role: 'SG' }, lebron)).toBe(true)
    expect(isSlotCompatible({ role: 'SF' }, lebron)).toBe(true)
    expect(isSlotCompatible({ role: 'PF' }, lebron)).toBe(true)
    expect(isSlotCompatible({ role: 'C' }, lebron)).toBe(false)

    // Verify getCompatibleOpenSlots returns all 4 positions
    const openSlots = getCompatibleOpenSlots(run, lebron)
    expect(openSlots.map((s) => s.role)).toEqual(['PG', 'SG', 'SF', 'PF'])

    // User chooses to play LeBron at Point Guard (Slot 0)
    const runAtPG = selectPlayer({ ...run, activeDraw: { ...heatDraw, candidates: heatDraw.players } }, lebron, 0)
    expect(runAtPG.slots[0].player.name).toBe('LeBron James')
    expect(runAtPG.slots[0].role).toBe('PG')

    // Or user chooses to play LeBron at Power Forward (Slot 3)
    const runAtPF = selectPlayer({ ...run, activeDraw: { ...heatDraw, candidates: heatDraw.players } }, lebron, 3)
    expect(runAtPF.slots[3].player.name).toBe('LeBron James')
    expect(runAtPF.slots[3].role).toBe('PF')
  })

  it('enforces soccer positional integrity: defenders in defense, midfielders in midfield, attackers in attack', () => {
    const barcaDraw = soccer.draws.find((d) => d.franchise === 'Barcelona')
    const puyol = barcaDraw.players.find((p) => p.name.includes('Puyol'))
    const xavi = barcaDraw.players.find((p) => p.name.includes('Xavi'))
    const messi = barcaDraw.players.find((p) => p.name.includes('Messi'))

    // Defender Puyol can play in defense (LB, CB1, CB2, RB) but NOT midfield or attack
    expect(isSlotCompatible({ role: 'CB1' }, puyol)).toBe(true)
    expect(isSlotCompatible({ role: 'RB' }, puyol)).toBe(true)
    expect(isSlotCompatible({ role: 'CDM' }, puyol)).toBe(false)
    expect(isSlotCompatible({ role: 'ST' }, puyol)).toBe(false)

    // Midfielder Xavi can play in midfield (CDM, CM, CAM) but NOT defense or attack
    expect(isSlotCompatible({ role: 'CM' }, xavi)).toBe(true)
    expect(isSlotCompatible({ role: 'CAM' }, xavi)).toBe(true)
    expect(isSlotCompatible({ role: 'CB1' }, xavi)).toBe(false)
    expect(isSlotCompatible({ role: 'ST' }, xavi)).toBe(false)

    // Attacker Messi can play in attack (LW, ST, RW) and attacking midfield (CAM) but NOT defense
    expect(isSlotCompatible({ role: 'RW' }, messi)).toBe(true)
    expect(isSlotCompatible({ role: 'ST' }, messi)).toBe(true)
    expect(isSlotCompatible({ role: 'CAM' }, messi)).toBe(true)
    expect(isSlotCompatible({ role: 'CB1' }, messi)).toBe(false)
    expect(isSlotCompatible({ role: 'LB' }, messi)).toBe(false)
  })

  it('allows drafting any player who matches at least one open slot', () => {
    const run = createRun('nba', nba)
    const spun = spinDraw(run, nba, () => 0)
    // Find Luc Longley (C) in Chicago Bulls draw
    const center = spun.activeDraw.candidates.find((p) => p.roles.length === 1 && p.roles[0] === 'C')
    expect(center).toBeDefined()
    // User chooses Center directly first, without having to draft Guard first
    const drafted = selectPlayer(spun, center)
    expect(drafted.slots[4].player.id).toBe(center.id)
    expect(drafted.picks).toHaveLength(1)
  })

  it('allows drafting a player into a specific targeted slot', () => {
    const run = createRun('nba', nba)
    const spun = spinDraw(run, nba, () => 0)
    const pippen = spun.activeDraw.candidates.find((p) => p.name.includes('Pippen'))
    // Target slot 2 (Small Forward)
    const drafted = selectPlayer(spun, pippen, 2)
    expect(drafted.slots[2].player.id).toBe(pippen.id)
    expect(drafted.slots[3].player).toBeNull() // Power Forward slot remains open
  })

  it('allows re-rolling a draw and tracks reroll count', () => {
    const run = createRun('nba', nba)
    const first = spinDraw(run, nba, () => 0)
    expect(first.activeDraw.franchise).toBe('Chicago Bulls')
    const rerolled = rerollDraw(first, nba, () => 0.15)
    expect(rerolled.activeDraw).toBeDefined()
    expect(rerolled.rerollsUsed).toBe(1)
  })

  it('allows separate team and era re-rolls with 1-use quota limits', () => {
    const run = createRun('nba', nba)
    const first = spinDraw(run, nba, () => 0) // Bulls 1995-1996
    expect(first.activeDraw.franchise).toBe('Chicago Bulls')

    // Team re-roll
    const teamRerolled = rerollTeam(first, nba, () => 0)
    expect(teamRerolled.activeDraw.franchise).not.toBe('Chicago Bulls')
    expect(teamRerolled.teamRerollsUsed).toBe(1)
    expect(() => rerollTeam(teamRerolled, nba)).toThrow('No team re-rolls remaining')

    // Era re-roll
    expect(teamRerolled.eraRerollsUsed).toBe(0)
    const eraRerolled = rerollEra(teamRerolled, nba, () => 0)
    expect(eraRerolled.eraRerollsUsed).toBe(1)
    expect(() => rerollEra(eraRerolled, nba)).toThrow('No era re-rolls remaining')
  })

  it('does not permit selecting the same player twice', () => {
    const run = createRun('nba', nba)
    const first = spinDraw(run, nba, () => 0)
    const player = first.activeDraw.candidates[0]
    const drafted = selectPlayer(first, player)
    expect(() => selectPlayer({ ...drafted, activeDraw: first.activeDraw }, player))
      .toThrow('already drafted')
  })

  it('rejects drafting when no matching slots remain for that role', () => {
    let run = createRun('nba', nba)
    // Fill the only Center slot
    const centerSlotIndex = 4
    const first = spinDraw(run, nba, () => 0)
    const center = first.activeDraw.candidates.find((p) => p.roles.includes('C'))
    run = selectPlayer(first, center, centerSlotIndex)

    // Now try to draft another pure Center from another team
    const second = spinDraw(run, nba, () => 1 / nba.draws.length) // Lakers
    const kareem = second.activeDraw.candidates.find((p) => p.name.includes('Kareem'))
    expect(() => selectPlayer(second, kareem)).toThrow('No open slot')
  })

  it('rejects a season simulation before every role is filled', () => {
    expect(() => simulateSeason(createRun('nba', nba), nba, () => 0.5)).toThrow('Roster is incomplete')
  })
})

function fillFullRoster(sport) {
  let run = createRun(sport.id, sport)
  for (let i = 0; i < sport.roles.length; i += 1) {
    const spun = spinDraw(run, sport, () => 0.1 * i)
    // Find candidate for the current unfilled slot
    const openSlot = run.slots.find((s) => s.player === null)
    const candidate = spun.activeDraw.candidates.find(
      (p) => isSlotCompatible(openSlot, p) && !run.slots.some((s) => s.player?.id === p.id),
    )
    run = selectPlayer(spun, candidate, openSlot.index)
  }
  return run
}

describe('game engine season simulation with new roster sizes', () => {
  it('correctly reports completion status', () => {
    const run = createRun('soccer', soccer)
    expect(isComplete(run, soccer)).toBe(false)
    const complete = fillFullRoster(soccer)
    expect(complete.slots).toHaveLength(11)
    expect(isComplete(complete, soccer)).toBe(true)
  })

  it('simulates 82 games for NBA', () => {
    const complete = fillFullRoster(nba)
    const season = simulateSeason(complete, nba, () => 0.5)
    expect(season.results).toHaveLength(82)
    expect(season.record.wins + season.record.losses).toBe(82)
  })

  it('simulates 38 matches for Soccer with Full XI (11 players)', () => {
    const complete = fillFullRoster(soccer)
    expect(complete.slots).toHaveLength(11)
    const season = simulateSeason(complete, soccer, () => 0.5)
    expect(season.results).toHaveLength(38)
    expect(season.record.wins + season.record.draws + season.record.losses).toBe(38)
  })

  it('simulates 17 games for NFL with 8 players', () => {
    const complete = fillFullRoster(nfl)
    expect(complete.slots).toHaveLength(8)
    const season = simulateSeason(complete, nfl, () => 0.5)
    expect(season.results).toHaveLength(17)
    expect(season.record.wins + season.record.losses).toBe(17)
  })
})
