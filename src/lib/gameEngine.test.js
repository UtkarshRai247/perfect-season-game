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
    const arsenalDraw = soccer.draws.find((d) => d.franchise === 'Arsenal')
    const campbell = arsenalDraw.players.find((p) => p.name.includes('Campbell'))
    const vieira = arsenalDraw.players.find((p) => p.name.includes('Vieira'))
    const henry = arsenalDraw.players.find((p) => p.name.includes('Henry'))

    // Defender Campbell can play in defense (LB, CB1, CB2, RB) but NOT midfield or attack
    expect(isSlotCompatible({ role: 'CB1' }, campbell)).toBe(true)
    expect(isSlotCompatible({ role: 'RB' }, campbell)).toBe(true)
    expect(isSlotCompatible({ role: 'CDM' }, campbell)).toBe(false)
    expect(isSlotCompatible({ role: 'ST' }, campbell)).toBe(false)

    // Midfielder Vieira can play in midfield (CDM, CM, CAM) but NOT defense or attack
    expect(isSlotCompatible({ role: 'CM' }, vieira)).toBe(true)
    expect(isSlotCompatible({ role: 'CDM' }, vieira)).toBe(true)
    expect(isSlotCompatible({ role: 'CB1' }, vieira)).toBe(false)
    expect(isSlotCompatible({ role: 'ST' }, vieira)).toBe(false)

    // Attacker Henry can play in attack (LW, ST, RW) but NOT defense
    expect(isSlotCompatible({ role: 'RW' }, henry)).toBe(true)
    expect(isSlotCompatible({ role: 'ST' }, henry)).toBe(true)
    expect(isSlotCompatible({ role: 'LW' }, henry)).toBe(true)
    expect(isSlotCompatible({ role: 'CB1' }, henry)).toBe(false)
    expect(isSlotCompatible({ role: 'LB' }, henry)).toBe(false)
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

  it('allows an all-time God squad with no weak links (97+ rating) to achieve a perfect 82-0 season', () => {
    const run = createRun('nba', nba)
    const godPlayers = [
      { id: 'p1', name: 'Magic Johnson', roles: ['PG'], rating: 98 },
      { id: 'p2', name: 'Michael Jordan', roles: ['SG'], rating: 99 },
      { id: 'p3', name: 'LeBron James', roles: ['SF'], rating: 99 },
      { id: 'p4', name: 'Tim Duncan', roles: ['PF'], rating: 98 },
      { id: 'p5', name: 'Wilt Chamberlain', roles: ['C'], rating: 99 },
    ]
    const godRun = {
      ...run,
      slots: run.slots.map((s, idx) => ({ ...s, player: godPlayers[idx] })),
    }

    const season = simulateSeason(godRun, nba, () => 0.5)
    expect(season.record.wins).toBe(82)
    expect(season.record.losses).toBe(0)
  })

  it('penalizes a team with a weak link hole preventing an 82-0 perfect season', () => {
    const run = createRun('nba', nba)
    // 4 superstars and 1 weak hole (rating 74)
    const weakLinkPlayers = [
      { id: 'p1', name: 'Magic Johnson', roles: ['PG'], rating: 98 },
      { id: 'p2', name: 'Michael Jordan', roles: ['SG'], rating: 99 },
      { id: 'p3', name: 'LeBron James', roles: ['SF'], rating: 99 },
      { id: 'p4', name: 'Tim Duncan', roles: ['PF'], rating: 98 },
      { id: 'p5', name: 'Bill Wennington', roles: ['C'], rating: 74 },
    ]
    const weakRun = {
      ...run,
      slots: run.slots.map((s, idx) => ({ ...s, player: weakLinkPlayers[idx] })),
    }

    const season = simulateSeason(weakRun, nba, () => 0.5)
    // Weak link penalty prevents 82-0 perfection
    expect(season.record.wins).toBeLessThan(75)
    expect(season.record.losses).toBeGreaterThan(0)
  })

  it('projects a lottery record (under 25 wins) for a team with 70s ratings', () => {
    const run = createRun('nba', nba)
    const lotteryPlayers = [
      { id: 'p1', name: 'Rookie PG', roles: ['PG'], rating: 74 },
      { id: 'p2', name: 'Bench SG', roles: ['SG'], rating: 75 },
      { id: 'p3', name: 'Hustle SF', roles: ['SF'], rating: 76 },
      { id: 'p4', name: 'Backup PF', roles: ['PF'], rating: 74 },
      { id: 'p5', name: 'Raw C', roles: ['C'], rating: 72 },
    ]
    const lotteryRun = {
      ...run,
      slots: run.slots.map((s, idx) => ({ ...s, player: lotteryPlayers[idx] })),
    }

    const season = simulateSeason(lotteryRun, nba, () => 0.5)
    expect(season.record.wins).toBeLessThan(25)
    expect(season.record.losses).toBeGreaterThan(57)
  })
})
