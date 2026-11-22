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
| `merchant_name` | String | Yes | `Kopi Kenangan Senopati` | Trade name of the merchant |
| `product_type` | String | Yes | `EDC` | One of: `EDC`, `LIVIN_MERCHANT`, `BOTH` |
| `mid` | String | Yes | `MID991001` | Merchant ID (Unique business identifier) |
| `tid` | String | No | `TID4401` | Physical Terminal ID (Required for EDC, optional for LVM) |
| `status` | String | Yes | `ACTIVE` | One of: `ACTIVE`, `INACTIVE` |
| `sales_volume_current` | Number | Yes | `1450000` | Turnover in IDR for current reporting period (MTD) |
| `sales_volume_previous` | Number | No | `8500000` | Turnover in IDR for previous period (defaults to 0) |
| `tx_count_current` | Integer | Yes | `14` | Total transaction count in current period |
| `tx_count_previous` | Integer | No | `95` | Total transaction count in previous period (defaults to 0) |
| `business_address` | String | Yes | `Jl. Senopati No. 41` | Physical outlet address for navigation |
| `latitude` | Float | Yes | `-6.229712` | Decimal latitude coordinate (-90 to +90) |
| `longitude` | Float | Yes | `106.808234` | Decimal longitude coordinate (-180 to +180) |
| `contact_phone` | String | No | `081234567890` | Merchant PIC or cashier contact number |

---

## 2. Sample CSV Data

```csv
cif,merchant_name,product_type,mid,tid,status,sales_volume_current,sales_volume_previous,tx_count_current,tx_count_previous,business_address,latitude,longitude,contact_phone
10982341,Kopi Kenangan Senopati,EDC,MID8891001,TID445501,ACTIVE,1250000,8900000,18,124,"Jl. Senopati No. 41, Jakarta Selatan",-6.2297,106.8082,081234567890
10982342,Warung Kopi Sejahtera,LIVIN_MERCHANT,LVM99201,N/A,ACTIVE,450000,1200000,12,35,"Jl. Suryo No. 12, Jakarta Selatan",-6.2345,106.8123,081298765432
10982343,Bakso Solo Samrat,EDC,MID8891003,TID445503,ACTIVE,15400000,16200000,310,325,"Jl. Wolter Monginsidi No. 58, Jakarta Selatan",-6.2389,106.8184,081311223344
10982344,Cafe Batavia Corner,BOTH,MID8891004,TID445504,ACTIVE,0,4500000,0,62,"Jl. Gunawarman No. 22, Jakarta Selatan",-6.2321,106.8099,081122334455
10982345,Apotek Sehat Mandiri,EDC,MID8891005,TID445505,INACTIVE,0,0,0,0,"Jl. Cikajang No. 18, Jakarta Selatan",-6.2401,106.8115,081566778899
```

---

## 3. Ingestion & Upsert Semantics

1. **Uniqueness**: Rows are matched and upserted based on `mid`.
2. **Visit Log Preservation**: Updating a merchant record does NOT delete or overwrite linked `visit_logs`.
3. **Health Recalculation**: The system automatically computes `healthStatus` (`RED`, `YELLOW`, `GREEN`) based on the newly ingested volume and transaction metrics.
