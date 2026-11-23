# REST API & Endpoint Contracts

**Protocol**: HTTPS / JSON  
**Base URL**: `/api`  

---

## 1. Merchant Operations

### 1.1 List Merchants (Distance-Ranked & Filtered)
- **Method**: `GET /api/merchants`
- **Query Parameters**:
  - `status`: Optional filter (`RED` | `YELLOW` | `GREEN` | `ALL`). Default: `ALL`.
  - `product`: Optional filter (`EDC` | `LIVIN_MERCHANT` | `BOTH` | `ALL`). Default: `ALL`.
  - `search`: Optional string search across `merchantName`, `cif`, `mid`.
  - `lat`: Optional reference latitude (defaults to branch latitude).
  - `lng`: Optional reference longitude (defaults to branch longitude).

#### Response `200 OK`:
```json
{
  "summary": {
    "total": 45,
    "redCount": 8,
    "yellowCount": 12,
    "greenCount": 25,
    "completedVisitsThisMonth": 6
  },
  "merchants": [
    {
      "id": "cm3r1a2b...",
      "cif": "10982341",
      "merchantName": "Djournal Coffee Grand Indonesia",
      "productType": "EDC",
      "mid": "MID8891001",
      "tid": "TID445501",
      "status": "ACTIVE",
      "salesVolumeCurrent": 1250000,
      "salesVolumePrevious": 8900000,
      "dropPercentage": 85.95,
      "txCountCurrent": 18,
      "txCountPrevious": 124,
      "healthStatus": "RED",
      "businessAddress": "Grand Indonesia West Mall GF, Jl. M.H. Thamrin No. 1, Jakarta Pusat",
      "latitude": -6.1952,
      "longitude": 106.8218,
      "contactPhone": "081234567890",
      "distanceMeters": 245.0,
      "visitCount": 1,
      "lastVisitedAt": "2026-11-15T09:30:00.000Z"
    }
  ]
}
```

---

### 1.2 Update Merchant Coordinates (Pin Adjustment)
- **Method**: `PATCH /api/merchants/:id/coordinates`
- **Request Body**:
```json
{
  "latitude": -6.22985,
  "longitude": 106.80835
}
```
#### Response `200 OK`:
```json
{
  "id": "cm3r1a2b...",
  "latitude": -6.22985,
  "longitude": 106.80835,
  "updatedAt": "2026-11-22T12:00:00.000Z"
}
```

---

## 2. Field Visit Operations

### 2.1 Record Field Visit (Mark as Done)
- **Method**: `POST /api/visits`
- **Request Body**:
```json
{
  "merchantId": "cm3r1a2b...",
  "visitorName": "Budi Santoso",
  "rootCause": "PAPER_OUT",
  "actionTaken": "Diserahkan 5 roll kertas thermal dan dilakukan test transaksi Rp 1.000 berhasil.",
  "notes": "Kasir shift pagi sudah diberikan edukasi cara penggantian kertas."
}
```
#### Response `201 Created`:
```json
{
  "id": "cm3r9x8y...",
  "merchantId": "cm3r1a2b...",
  "visitDate": "2026-11-22T10:15:00.000Z",
  "visitorName": "Budi Santoso",
  "rootCause": "PAPER_OUT",
  "actionTaken": "Diserahkan 5 roll kertas thermal...",
  "notes": "Kasir shift pagi...",
  "status": "DONE"
}
```

---

### 2.2 Get Merchant Visit History
- **Method**: `GET /api/visits?merchantId=:merchantId`
#### Response `200 OK`:
```json
[
  {
    "id": "cm3r9x8y...",
    "visitDate": "2026-11-22T10:15:00.000Z",
    "visitorName": "Budi Santoso",
    "rootCause": "PAPER_OUT",
    "actionTaken": "Diserahkan 5 roll kertas thermal...",
    "notes": "Kasir shift pagi...",
    "status": "DONE"
  }
]
```

---

## 3. Data Ingestion & Configuration

### 3.1 Upload CSV Data
- **Method**: `POST /api/merchants/upload`
- **Content-Type**: `multipart/form-data` or `application/json` (parsed rows)
#### Response `200 OK`:
```json
{
  "success": true,
  "totalProcessed": 45,
  "inserted": 5,
  "updated": 40,
  "redCount": 8,
  "yellowCount": 12,
  "greenCount": 25
}
```

---

### 3.2 Branch Configuration & Thresholds
- **Method**: `GET /api/branch-config`
- **Response `200 OK`**:
```json
{
  "id": "default-branch",
  "branchName": "Bank Mandiri KCP Jakarta Wisma Nusantara",
  "branchCode": "10310",
  "latitude": -6.193962,
  "longitude": 106.823673,
  "redVolumeThreshold": 3000000,
  "yellowDropPctThreshold": 0.30,
  "redInactivityDays": 14
}
```

- **Method**: `PUT /api/branch-config`
- **Request Body**:
```json
{
  "branchName": "Bank Mandiri KCP Jakarta Wisma Nusantara",
  "latitude": -6.193962,
  "longitude": 106.823673,
  "redVolumeThreshold": 4000000,
  "yellowDropPctThreshold": 0.35
}
```

---

### 3.3 Load Sample Demo Data
- **Method**: `POST /api/seed`
- **Response `200 OK`**:
```json
{
  "success": true,
  "seededMerchants": 20,
  "message": "Sample Central Jakarta (Thamrin/Menteng) merchants loaded successfully."
}
```
