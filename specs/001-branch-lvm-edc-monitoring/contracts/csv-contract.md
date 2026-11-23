# CSV Ingestion Contract

**Interface Type**: Batch File Ingestion  
**Format**: Comma-Separated Values (`.csv`)  
**Encoding**: UTF-8  
**Header**: Mandatory, row 1  

---

## 1. Column Specifications

| Header Name | Type | Required | Sample Value | Description & Constraints |
| :--- | :--- | :---: | :--- | :--- |
| `cif` | String | Yes | `1089201` | Customer Information File ID in Core Banking |
| `merchant_name` | String | Yes | `Kopi Kenangan Menara Mulia` | Trade name of the merchant |
| `product_type` | String | Yes | `EDC` | One of: `EDC`, `LIVIN_MERCHANT`, `BOTH` |
| `mid` | String | Yes | `MID8891001` | Merchant ID (Unique business identifier) |
| `tid` | String | No | `TID4401` | Physical Terminal ID (Required for EDC, optional for LVM) |
| `status` | String | Yes | `ACTIVE` | One of: `ACTIVE`, `INACTIVE` |
| `sales_volume_current` | Number | Yes | `1450000` | Turnover in IDR for current reporting period (MTD) |
| `sales_volume_previous` | Number | No | `8500000` | Turnover in IDR for previous period (defaults to 0) |
| `tx_count_current` | Integer | Yes | `14` | Total transaction count in current period |
| `tx_count_previous` | Integer | No | `95` | Total transaction count in previous period (defaults to 0) |
| `business_address` | String | Yes | `Menara Mulia GF, Jl. Jend. Gatot Subroto Kav. 9-11` | Physical outlet address for navigation |
| `latitude` | Float | Yes | `-6.225800` | Decimal latitude coordinate (-90 to +90) |
| `longitude` | Float | Yes | `106.817200` | Decimal longitude coordinate (-180 to +180) |
| `contact_phone` | String | No | `081234567890` | Merchant PIC or cashier contact number |

---

## 2. Sample CSV Data

```csv
cif,merchant_name,product_type,mid,tid,status,sales_volume_current,sales_volume_previous,tx_count_current,tx_count_previous,business_address,latitude,longitude,contact_phone
10982341,Kopi Kenangan Menara Mulia,EDC,MID8891001,TID445501,ACTIVE,1250000,8900000,18,124,"Menara Mulia GF, Jl. Jend. Gatot Subroto Kav. 9-11, Jakarta Selatan",-6.2258,106.8172,081234567890
10982342,Warung Kopi Sejahtera Tendean,LIVIN_MERCHANT,LVM99201,N/A,ACTIVE,450000,1200000,12,35,"Jl. Kapten Tendean No. 12, Mampang, Jakarta Selatan",-6.2345,106.8210,081298765432
10982343,Bakmi GM Semanggi,EDC,MID8891003,TID445503,ACTIVE,15400000,16200000,310,325,"Plaza Semanggi Lt. 3A, Jl. Jend. Sudirman Kav. 50, Jakarta Selatan",-6.2198,106.8152,081311223344
10982344,Cafe Batavia SCBD,BOTH,MID8891004,TID445504,ACTIVE,0,4500000,0,62,"Fairgrounds SCBD Lot 14, Jl. Jend. Sudirman, Jakarta Selatan",-6.2268,106.8085,081122334455
10982345,Apotek Century Menara Jamsostek,EDC,MID8891005,TID445505,INACTIVE,0,0,0,0,"Menara Jamsostek GF, Jl. Jend. Gatot Subroto Kav. 38, Jakarta Selatan",-6.2285,106.8198,081566778899
```

---

## 3. Ingestion & Upsert Semantics

1. **Uniqueness**: Rows are matched and upserted based on `mid`.
2. **Visit Log Preservation**: Updating a merchant record does NOT delete or overwrite linked `visit_logs`.
3. **Health Recalculation**: The system automatically computes `healthStatus` (`RED`, `YELLOW`, `GREEN`) based on the newly ingested volume and transaction metrics.
