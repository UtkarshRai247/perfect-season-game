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

  it('includes all 30 NBA franchises in the NBA catalog', () => {
    const nbaFranchises = new Set(SPORTS.nba.draws.map((d) => d.franchise))
    expect(nbaFranchises.size).toBe(30)
    expect(nbaFranchises.has('Atlanta Hawks')).toBe(true)
    expect(nbaFranchises.has('Boston Celtics')).toBe(true)
    expect(nbaFranchises.has('Brooklyn Nets')).toBe(true)
    expect(nbaFranchises.has('Charlotte Bobcats')).toBe(true)
    expect(nbaFranchises.has('Chicago Bulls')).toBe(true)
    expect(nbaFranchises.has('Cleveland Cavaliers')).toBe(true)
    expect(nbaFranchises.has('Dallas Mavericks')).toBe(true)
    expect(nbaFranchises.has('Denver Nuggets')).toBe(true)
    expect(nbaFranchises.has('Detroit Pistons')).toBe(true)
    expect(nbaFranchises.has('Golden State Warriors')).toBe(true)
    expect(nbaFranchises.has('Houston Rockets')).toBe(true)
    expect(nbaFranchises.has('Indiana Pacers')).toBe(true)
    expect(nbaFranchises.has('Los Angeles Clippers')).toBe(true)
    expect(nbaFranchises.has('Los Angeles Lakers')).toBe(true)
    expect(nbaFranchises.has('Memphis Grizzlies')).toBe(true)
    expect(nbaFranchises.has('Miami Heat')).toBe(true)
    expect(nbaFranchises.has('Milwaukee Bucks')).toBe(true)
    expect(nbaFranchises.has('Minnesota Timberwolves')).toBe(true)
    expect(nbaFranchises.has('New Orleans Pelicans')).toBe(true)
    expect(nbaFranchises.has('New York Knicks')).toBe(true)
    expect(nbaFranchises.has('Oklahoma City Thunder')).toBe(true)
    expect(nbaFranchises.has('Orlando Magic')).toBe(true)
    expect(nbaFranchises.has('Philadelphia 76ers')).toBe(true)
    expect(nbaFranchises.has('Phoenix Suns')).toBe(true)
    expect(nbaFranchises.has('Portland Trail Blazers')).toBe(true)
    expect(nbaFranchises.has('Sacramento Kings')).toBe(true)
    expect(nbaFranchises.has('San Antonio Spurs')).toBe(true)
    expect(nbaFranchises.has('Toronto Raptors')).toBe(true)
    expect(nbaFranchises.has('Utah Jazz')).toBe(true)
    expect(nbaFranchises.has('Washington Wizards')).toBe(true)
  })

  it('includes all 32 NFL franchises in the NFL catalog', () => {
    const nflFranchises = new Set(SPORTS.nfl.draws.map((d) => d.franchise))
    expect(nflFranchises.size).toBe(32)
    expect(nflFranchises.has('Arizona Cardinals')).toBe(true)
    expect(nflFranchises.has('Atlanta Falcons')).toBe(true)
    expect(nflFranchises.has('Baltimore Ravens')).toBe(true)
    expect(nflFranchises.has('Buffalo Bills')).toBe(true)
    expect(nflFranchises.has('Carolina Panthers')).toBe(true)
    expect(nflFranchises.has('Chicago Bears')).toBe(true)
    expect(nflFranchises.has('Cincinnati Bengals')).toBe(true)
    expect(nflFranchises.has('Cleveland Browns')).toBe(true)
    expect(nflFranchises.has('Dallas Cowboys')).toBe(true)
    expect(nflFranchises.has('Denver Broncos')).toBe(true)
    expect(nflFranchises.has('Detroit Lions')).toBe(true)
    expect(nflFranchises.has('Green Bay Packers')).toBe(true)
    expect(nflFranchises.has('Houston Texans')).toBe(true)
    expect(nflFranchises.has('Indianapolis Colts')).toBe(true)
    expect(nflFranchises.has('Jacksonville Jaguars')).toBe(true)
    expect(nflFranchises.has('Kansas City Chiefs')).toBe(true)
    expect(nflFranchises.has('Los Angeles Chargers')).toBe(true)
    expect(nflFranchises.has('Miami Dolphins')).toBe(true)
    expect(nflFranchises.has('Minnesota Vikings')).toBe(true)
    expect(nflFranchises.has('New England Patriots')).toBe(true)
    expect(nflFranchises.has('New Orleans Saints')).toBe(true)
    expect(nflFranchises.has('New York Giants')).toBe(true)
    expect(nflFranchises.has('New York Jets')).toBe(true)
    expect(nflFranchises.has('Oakland Raiders')).toBe(true)
    expect(nflFranchises.has('Philadelphia Eagles')).toBe(true)
    expect(nflFranchises.has('Pittsburgh Steelers')).toBe(true)
    expect(nflFranchises.has('San Francisco 49ers')).toBe(true)
    expect(nflFranchises.has('Seattle Seahawks')).toBe(true)
    expect(nflFranchises.has('St. Louis Rams')).toBe(true)
    expect(nflFranchises.has('Tampa Bay Buccaneers')).toBe(true)
    expect(nflFranchises.has('Tennessee Titans')).toBe(true)
    expect(nflFranchises.has('Washington Commanders')).toBe(true)
  })
})
