import { SPORTS } from '../data/catalog.js'

export function isSlotCompatible(slot, player) {
  if (!slot || !player || !player.roles) return false

  const targetRole = slot.role

  // Exact match
  if (player.roles.includes(targetRole)) return true

  // NBA category mappings
  if (['PG', 'SG'].includes(targetRole) && player.roles.includes('G')) return true
  if (['SF', 'PF'].includes(targetRole) && player.roles.includes('F')) return true

  // Soccer category mappings
  // Defenders in defense
  const isDefenseSlot = ['LB', 'CB1', 'CB2', 'RB'].includes(targetRole)
  if (
    isDefenseSlot &&
    (player.roles.includes('DEF') ||
      player.roles.includes('CB') ||
      player.roles.includes('LB') ||
      player.roles.includes('RB'))
  ) {
    return true
  }

  // Midfielders in midfield
  const isMidfieldSlot = ['CDM', 'CM', 'CAM'].includes(targetRole)
  if (
    isMidfieldSlot &&
    (player.roles.includes('MID') ||
      player.roles.includes('CDM') ||
      player.roles.includes('CM') ||
      player.roles.includes('CAM'))
  ) {
    return true
  }

  // Attackers in attack
  const isAttackSlot = ['LW', 'ST', 'RW'].includes(targetRole)
  if (
    isAttackSlot &&
    (player.roles.includes('ATT') ||
      player.roles.includes('WING') ||
      player.roles.includes('ST') ||
      player.roles.includes('LW') ||
      player.roles.includes('RW'))
  ) {
    return true
  }

  // NFL category mappings
  if (['RB1', 'RB2'].includes(targetRole) && player.roles.includes('RB')) return true
  if (['WR1', 'WR2', 'WR3'].includes(targetRole) && player.roles.includes('WR')) return true

  return false
}

export function getCompatibleOpenSlots(run, player) {
  if (!run || !run.slots) return []
  return run.slots.filter((slot) => slot.player === null && isSlotCompatible(slot, player))
}

export function createRun(sportId, sport = SPORTS[sportId]) {
  const roles = sport ? sport.roles : []
  const slots = roles.map((role, index) => ({
    id: `slot-${index}`,
    index,
    role,
    player: null,
  }))

  return {
    sportId,
    slots,
    picks: [],
    activeDraw: null,
    season: null,
    rerollsUsed: 0,
    teamRerollsUsed: 0,
    eraRerollsUsed: 0,
  }
}

export function spinDraw(run, sport, random = Math.random) {
  if (isComplete(run, sport)) {
    throw new Error('Roster is already full')
  }

  const roll = typeof random === 'function' ? random() : Math.random()
  const index = Math.min(sport.draws.length - 1, Math.floor(roll * sport.draws.length))
  const draw = sport.draws[index]

  // All undrafted players from this draw, ordered from top overall to bottom overall
  const candidates = draw.players
    .filter((player) => !run.slots.some((s) => s.player?.id === player.id))
    .sort((a, b) => b.rating - a.rating)

  const openRoles = run.slots.filter((s) => s.player === null).map((s) => s.role)

  return {
    ...run,
    activeDraw: {
      franchise: draw.franchise,
      era: draw.era,
      role: openRoles[0] || null,
      candidates,
    },
  }
}

export function spinForCurrentRole(run, sport, random = Math.random) {
  return spinDraw(run, sport, random)
}

export function rerollTeam(run, sport, random = Math.random) {
  if (!run.activeDraw) {
    throw new Error('No active draw to re-roll')
  }
  if ((run.teamRerollsUsed || 0) >= 1) {
    throw new Error('No team re-rolls remaining (limit 1)')
  }

  const currentFranchise = run.activeDraw.franchise
  let pool = sport.draws.filter((d) => d.franchise !== currentFranchise)
  if (pool.length === 0) pool = sport.draws

  const roll = typeof random === 'function' ? random() : Math.random()
  const index = Math.min(pool.length - 1, Math.floor(roll * pool.length))
  const newDraw = pool[index]

  const candidates = newDraw.players
    .filter((player) => !run.slots.some((s) => s.player?.id === player.id))
    .sort((a, b) => b.rating - a.rating)
  const openRoles = run.slots.filter((s) => s.player === null).map((s) => s.role)

  return {
    ...run,
    teamRerollsUsed: (run.teamRerollsUsed || 0) + 1,
    rerollsUsed: (run.rerollsUsed || 0) + 1,
    activeDraw: {
      franchise: newDraw.franchise,
      era: newDraw.era,
      role: openRoles[0] || null,
      candidates,
    },
  }
}

export function rerollEra(run, sport, random = Math.random) {
  if (!run.activeDraw) {
    throw new Error('No active draw to re-roll')
  }
  if ((run.eraRerollsUsed || 0) >= 1) {
    throw new Error('No era re-rolls remaining (limit 1)')
  }

  const currentFranchise = run.activeDraw.franchise
  const currentEra = run.activeDraw.era

  // Look for another era for the same franchise first
  const sameFranchisePool = sport.draws.filter(
    (d) => d.franchise === currentFranchise && d.era !== currentEra,
  )

  let pool = sameFranchisePool
  if (pool.length === 0) {
    // If no other era for this team, pick another draw with a different era
    pool = sport.draws.filter((d) => d.era !== currentEra)
  }
  if (pool.length === 0) {
    pool = sport.draws
  }

  const roll = typeof random === 'function' ? random() : Math.random()
  const index = Math.min(pool.length - 1, Math.floor(roll * pool.length))
  const newDraw = pool[index]

  const candidates = newDraw.players
    .filter((player) => !run.slots.some((s) => s.player?.id === player.id))
    .sort((a, b) => b.rating - a.rating)
  const openRoles = run.slots.filter((s) => s.player === null).map((s) => s.role)

  return {
    ...run,
    eraRerollsUsed: (run.eraRerollsUsed || 0) + 1,
    rerollsUsed: (run.rerollsUsed || 0) + 1,
    activeDraw: {
      franchise: newDraw.franchise,
      era: newDraw.era,
      role: openRoles[0] || null,
      candidates,
    },
  }
}

export function rerollDraw(run, sport, random = Math.random) {
  if ((run.teamRerollsUsed || 0) < 1) {
    return rerollTeam(run, sport, random)
  }
  const updatedRun = spinDraw(run, sport, random)
  return {
    ...updatedRun,
    rerollsUsed: (run.rerollsUsed || 0) + 1,
  }
}

export function selectPlayer(run, player, targetSlotIndex = null) {
  if (!run.activeDraw) {
    throw new Error('No active draw to select a player from')
  }

  if (run.slots.some((s) => s.player?.id === player.id)) {
    throw new Error(`Player ${player.name} is already drafted`)
  }

  const isCandidate = run.activeDraw.candidates.some((c) => c.id === player.id)
  if (!isCandidate) {
    throw new Error(`Player ${player.name} is not in the active draw candidates`)
  }

  let slotToFill = null

  if (targetSlotIndex !== null && targetSlotIndex !== undefined) {
    const targetSlot = run.slots[targetSlotIndex]
    if (!targetSlot) {
      throw new Error(`Slot index ${targetSlotIndex} is invalid`)
    }
    if (targetSlot.player !== null) {
      throw new Error(`Slot ${targetSlotIndex} is already filled`)
    }
    if (!isSlotCompatible(targetSlot, player)) {
      throw new Error(
        `Player ${player.name} (${player.roles.join(', ')}) cannot fill role ${targetSlot.role}`,
      )
    }
    slotToFill = targetSlot
  } else {
    const compatibleSlots = getCompatibleOpenSlots(run, player)
    if (compatibleSlots.length === 0) {
      throw new Error(
        `No open slot matches player ${player.name}'s position(s) (${player.roles.join(', ')})`,
      )
    }
    slotToFill = compatibleSlots[0]
  }

  const newSlots = run.slots.map((slot) =>
    slot.index === slotToFill.index ? { ...slot, player } : slot,
  )

  const newPick = { role: slotToFill.role, player, slotIndex: slotToFill.index }

  return {
    ...run,
    slots: newSlots,
    picks: [...run.picks, newPick],
    activeDraw: null,
  }
}

export function isComplete(run, sport) {
  if (!run.slots || run.slots.length === 0) return false
  return run.slots.every((slot) => slot.player !== null)
}

export function simulateSeason(run, sport, random = Math.random) {
  if (!isComplete(run, sport)) {
    throw new Error('Roster is incomplete')
  }

  const totalRating = run.slots.reduce((sum, s) => sum + s.player.rating, 0)
  const exactAverage = totalRating / run.slots.length
  const averageRating = Math.round(exactAverage)

  const minRating = Math.min(...run.slots.map((s) => s.player.rating))
  // Weak link penalty: in high-level competition, any liability below 90 is exploited by opponents
  const weakLinkPenalty = Math.max(0, 90 - minRating) * 0.35
  const effectiveRating = exactAverage - weakLinkPenalty

  const seasonLength = sport.seasonLength
  const isSoccer = sport.recordType === 'wins-draws-losses'

  // Authentic non-linear target win rate curve from the original 82-0 challenge
  let targetWinRate = 0.5
  if (sport.id === 'nba') {
    if (effectiveRating <= 80) {
      targetWinRate = 0.12 + ((effectiveRating - 70) / 10) * 0.32
    } else if (effectiveRating <= 86) {
      targetWinRate = 0.44 + ((effectiveRating - 80) / 6) * 0.18
    } else if (effectiveRating <= 92) {
      targetWinRate = 0.62 + ((effectiveRating - 86) / 6) * 0.18
    } else if (effectiveRating <= 96) {
      targetWinRate = 0.8 + ((effectiveRating - 92) / 4) * 0.14
    } else {
      // 96 to 98.5: diminishing returns, reaching 1.0 (82-0) for an all-time God squad
      targetWinRate = 0.94 + ((effectiveRating - 96) / 2.5) * 0.06
    }
  } else if (sport.id === 'nfl') {
    if (effectiveRating <= 80) {
      targetWinRate = 0.15 + ((effectiveRating - 70) / 10) * 0.25
    } else if (effectiveRating <= 86) {
      targetWinRate = 0.4 + ((effectiveRating - 80) / 6) * 0.22
    } else if (effectiveRating <= 92) {
      targetWinRate = 0.62 + ((effectiveRating - 86) / 6) * 0.2
    } else if (effectiveRating <= 96) {
      targetWinRate = 0.82 + ((effectiveRating - 92) / 4) * 0.12
    } else {
      targetWinRate = 0.94 + ((effectiveRating - 96) / 2.5) * 0.06
    }
  } else {
    // Soccer
    if (effectiveRating <= 80) {
      targetWinRate = 0.2 + ((effectiveRating - 70) / 10) * 0.25
    } else if (effectiveRating <= 86) {
      targetWinRate = 0.45 + ((effectiveRating - 80) / 6) * 0.22
    } else if (effectiveRating <= 92) {
      targetWinRate = 0.67 + ((effectiveRating - 86) / 6) * 0.18
    } else if (effectiveRating <= 96) {
      targetWinRate = 0.85 + ((effectiveRating - 92) / 4) * 0.1
    } else {
      targetWinRate = 0.95 + ((effectiveRating - 96) / 2.5) * 0.05
    }
  }

  targetWinRate = Math.max(0.08, Math.min(1.0, targetWinRate))

  const results = []
  let wins = 0
  let draws = 0
  let losses = 0

  for (let i = 0; i < seasonLength; i += 1) {
    let outcome = 'L'
    const roll = typeof random === 'function' ? random() : Math.random()
    const difficulty = (i + 0.5) / seasonLength
    const variance = (roll - 0.5) * 0.16
    const gamePerformance = targetWinRate + variance

    if (isSoccer) {
      // Draw occurs when team performance is very close to game difficulty
      const diff = Math.abs(gamePerformance - difficulty)
      if (diff < 0.035 && targetWinRate < 0.98) {
        outcome = 'D'
        draws += 1
      } else if (gamePerformance >= difficulty) {
        outcome = 'W'
        wins += 1
      } else {
        outcome = 'L'
        losses += 1
      }
    } else {
      if (gamePerformance >= difficulty) {
        outcome = 'W'
        wins += 1
      } else {
        outcome = 'L'
        losses += 1
      }
    }

    results.push({ number: i + 1, outcome })
  }

  const record = isSoccer ? { wins, draws, losses } : { wins, losses }

  return {
    results,
    record,
    averageRating,
  }
}
