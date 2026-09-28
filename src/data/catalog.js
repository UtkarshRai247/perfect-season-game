import { NBA_ROLES, nbaSport } from './sports/nba.js'
import { SOCCER_ROLES, soccerSport } from './sports/soccer.js'
import { NFL_ROLES, nflSport } from './sports/nfl.js'

export { NBA_ROLES, SOCCER_ROLES, NFL_ROLES }

export const SPORTS = {
  nba: nbaSport,
  soccer: soccerSport,
  nfl: nflSport,
}
