export interface MerchantDto {
  id: string;
  cif: string;
  merchantName: string;
  productType: "EDC" | "LIVIN_MERCHANT" | "BOTH";
  mid: string;
  tid: string | null;
  status: "ACTIVE" | "INACTIVE";
  salesVolumeCurrent: number;
  salesVolumePrevious: number;
  dropPercentage: number;
  txCountCurrent: number;
  txCountPrevious: number;
  healthStatus: "RED" | "YELLOW" | "GREEN";
  businessAddress: string;
  latitude: number | null;
  longitude: number | null;
  contactPhone: string | null;
  distanceMeters: number | null;
  visitCount: number;
  lastVisitedAt: string | null;
}

export interface MerchantSummary {
  total: number;
  redCount: number;
  yellowCount: number;
  greenCount: number;
  completedVisitsThisMonth: number;
}

export interface MerchantListResponse {
  summary: MerchantSummary;
  merchants: MerchantDto[];
}
