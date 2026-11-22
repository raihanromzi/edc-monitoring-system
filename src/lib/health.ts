export type HealthStatus = "RED" | "YELLOW" | "GREEN";

export interface HealthThresholds {
  redVolumeThreshold: number;
  yellowDropPctThreshold: number;
}

export interface HealthInput {
  status: "ACTIVE" | "INACTIVE";
  salesVolumeCurrent: number;
  salesVolumePrevious: number;
  txCountCurrent: number;
}

/** RED: inactive, zero current transactions, or current volume below red threshold.
 *  YELLOW: qualifying volume drop. Otherwise GREEN. See data-model.md §4. */
export function calculateHealth(m: HealthInput, t: HealthThresholds): HealthStatus {
  if (m.status === "INACTIVE" || m.txCountCurrent === 0 || m.salesVolumeCurrent < t.redVolumeThreshold) {
    return "RED";
  }
  if (m.salesVolumePrevious > 0) {
    const dropPct = (m.salesVolumePrevious - m.salesVolumeCurrent) / m.salesVolumePrevious;
    if (dropPct >= t.yellowDropPctThreshold) return "YELLOW";
  }
  return "GREEN";
}
