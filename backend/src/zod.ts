import { z } from 'zod'

export const activateSuperSchema = z.number().int().nonnegative()

export const basicUpgrades = [
    'ATK Increase',
    'HP Increase',
    'Follow-Up Chance Increase',
    'Crit Chance Increase',
] as const

export const specialUpgrades = [
    'Heal on Kill',
    'Last Stand',
    'Vampiric Super',
    'Critical Surge',
] as const

export const upgradeSchema = z.union([
    z.enum(basicUpgrades),
    z.enum(specialUpgrades)
])

export const specialUpgradeSchema = z.enum(specialUpgrades)

export type Upgrade = z.infer<typeof upgradeSchema>
export type SpecialUpgrade = z.infer<typeof specialUpgradeSchema>