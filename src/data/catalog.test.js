import { describe, expect, it } from 'vitest'
import { isSlotCompatible } from '../lib/gameEngine.js'
import { NBA_ROLES, NFL_ROLES, SOCCER_ROLES, SPORTS } from './catalog.js'

describe('SPORTS catalog', () => {
  it('supplies valid roles, draws, and stats for all sports', () => {
    expect(Object.keys(SPORTS)).toEqual(['nba', 'soccer', 'nfl'])

    expect(SPORTS.nba.roles).toEqual(NBA_ROLES)
    expect(SPORTS.nba.roles).toHaveLength(5)

    expect(SPORTS.soccer.roles).toEqual(SOCCER_ROLES)
    expect(SPORTS.soccer.roles).toHaveLength(11)

    expect(SPORTS.nfl.roles).toEqual(NFL_ROLES)
    expect(SPORTS.nfl.roles).toHaveLength(8)

    for (const sport of Object.values(SPORTS)) {
      expect(sport.draws.length).toBeGreaterThanOrEqual(16)

      for (const draw of sport.draws) {
        // Every role has at least one eligible player in the draw according to positional compatibility rules
        for (const role of sport.roles) {
          expect(draw.players.some((player) => isSlotCompatible({ role }, player))).toBe(true)
        }

        // Players are strictly ordered from top overall to bottom overall (rating descending)
        for (let i = 0; i < draw.players.length - 1; i++) {
          expect(draw.players[i].rating).toBeGreaterThanOrEqual(draw.players[i + 1].rating)
        }

        // Every player has valid metadata and stats string
        for (const player of draw.players) {
          expect(player.id).toBeTruthy()
          expect(player.name).toBeTruthy()
          expect(player.roles.length).toBeGreaterThan(0)
          expect(player.rating).toBeGreaterThanOrEqual(60)
          expect(player.rating).toBeLessThanOrEqual(99)
          expect(typeof player.stats).toBe('string')
          expect(player.stats.length).toBeGreaterThan(0)
        }
      }
    }
  })
})
