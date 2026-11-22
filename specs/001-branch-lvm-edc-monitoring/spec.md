# Feature Specification: Branch LVM & EDC Monitoring System

**Feature Branch**: `001-branch-lvm-edc-monitoring`

**Created**: 2026-11-22

**Status**: Draft

**Input**: User description: "read the /Users/raihanromzi/.gemini/antigravity/brain/1360b23d-d7b9-4101-b3e8-8dcba34b896a/system-design-spec.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Locate and Prioritize Underperforming Merchants (Priority: P1)

A branch officer or manager needs to quickly identify which nearby merchants that the branch acquired are struggling with low sales volume or idle payment terminals (EDC and Livin' Merchant), so they can prioritize who to visit first based on physical proximity and urgency.

**Why this priority**: This is the core value proposition of the system. Without the ability to view, filter, and geographically locate merchants by health status, the branch cannot conduct targeted field interventions.

**Independent Test**: Can be fully tested by loading a set of merchants with varying transaction volumes and verifying that underperforming merchants are visually highlighted in red, displayed on an interactive map centered around the branch, and sorted from nearest to furthest with their key metrics visible.

**Acceptance Scenarios**:

1. **Given** a populated list of branch-acquired merchants with varying transaction performance, **When** a branch officer views the monitoring screen, **Then** all merchants are displayed on an interactive map with distinct color-coded markers representing their health status (Red for underperforming, Yellow for watchlist, Green for healthy).
2. **Given** merchants displayed on the map, **When** the officer selects an underperforming (Red) merchant marker, **Then** a detail card opens displaying the merchant's trade name, product type (EDC, Livin' Merchant, or both), current sales volume, transaction count, physical address, and contact number.
3. **Given** the merchant list drawer, **When** the officer views the merchant list, **Then** merchants are sorted by distance ascending from the branch, with options to filter by health status and product type.
4. **Given** a merchant's location pin is inaccurate relative to their actual physical store, **When** an authorized branch user enters pin-adjustment mode and relocates the pin, **Then** the updated geographic coordinates are saved for future sessions.
5. **Given** a merchant detail view, **When** the officer clicks the external navigation action, **Then** the system opens turn-by-turn navigation in their default map navigation application with the merchant's exact coordinates.

---

### User Story 2 - Conduct On-Site Diagnostics and Record Field Visits (Priority: P1)

A branch officer arrives at an underperforming merchant's business location (e.g., a coffee shop with low EDC sales), conducts on-site troubleshooting with the store staff/cashier, and marks the visit as completed while logging the primary root cause and corrective action taken.

**Why this priority**: Logging the diagnosis and actions taken on-site closes the operational loop between identifying a problem and tracking whether the intervention resolves it.

**Independent Test**: Can be tested independently by opening an underperforming merchant, launching the visit modal, selecting diagnostic findings (e.g., paper roll out, cashier untrained), typing resolution notes, submitting "Mark as Done", and verifying that the visit history is permanently recorded and visible on the merchant profile.

**Acceptance Scenarios**:

1. **Given** an underperforming merchant profile, **When** the branch officer clicks "Log Visit", **Then** a diagnostic form opens pre-filled with the current date/time and officer details.
2. **Given** the diagnostic form, **When** the officer completes the visit, **Then** they can select one or more structured root causes (e.g., Thermal Paper Out, Cellular Signal Dead, Cashier Untrained, Competitor Terminal Preferred, Store Closed, or Other) and enter free-text notes detailing the action taken.
3. **Given** a submitted visit report, **When** the form is saved, **Then** the merchant's visit record is stored, the status is marked as "Visited", and the timestamped entry appears in the merchant's historical activity log.
4. **Given** a merchant with prior visits, **When** any branch staff inspects the merchant, **Then** they can view the full timeline of previous visits, who conducted them, the recorded root causes, and subsequent sales performance.

---

### User Story 3 - Ingest Periodic Merchant Performance Data (Priority: P2)

A branch administrator receives an updated periodic report (e.g., weekly or monthly transaction dump from enterprise analytics) containing sales turnover, transaction counts, and terminal statuses, and uploads it to refresh the branch portfolio data.

**Why this priority**: Ensures the monitoring system stays up-to-date with fresh commercial numbers while preserving historical field visit logs and allowing automatic recalculation of merchant health.

**Independent Test**: Can be tested independently by uploading a structured data file with new sales figures, verifying that existing merchant metrics are updated, new merchants are added, and the health status classification updates accordingly without deleting previous visit records.

**Acceptance Scenarios**:

1. **Given** a valid spreadsheet/CSV file matching the system data contract, **When** the branch administrator uploads the file in the administrative interface, **Then** the system validates the file columns, confirms row counts, and previews the update summary before applying changes.
2. **Given** an uploaded file with invalid or missing required columns (e.g., missing coordinates or CIF), **When** the system parses the file, **Then** ingestion stops and displays specific, user-friendly error messages indicating which rows or headers require correction.
3. **Given** successful ingestion of updated sales metrics, **When** the data is committed, **Then** merchant sales volumes, transaction counts, and health statuses are updated, while existing visit histories linked to merchants remain intact.
4. **Given** an admin preparing data, **When** they request a template, **Then** the system provides a downloadable example file showing the exact required column structure and sample data rows.

---

### User Story 4 - Branch Health Thresholds & Demonstration Sandbox (Priority: P3)

A branch manager needs to adjust performance thresholds (such as minimum acceptable monthly volume or acceptable percentage drop) to reflect local market conditions, and a evaluator needs to populate demo data to test the end-to-end flow without real customer data.

**Why this priority**: Provides operational flexibility for branches in different economic regions and enables risk-free demonstration, onboarding, and training for branch personnel.

**Independent Test**: Can be tested by altering the red volume threshold in settings, verifying that merchant health classifications immediately recalculate, and using the "Load Sample Data" action to populate realistic dummy merchants on the map.

**Acceptance Scenarios**:

1. **Given** the branch settings screen, **When** an administrator updates the branch location coordinates, branch name, or threshold values (e.g., changing the Red volume floor from Rp 3,000,000 to Rp 5,000,000), **Then** all active merchant classifications immediately update to reflect the new criteria.
2. **Given** an empty or demonstration environment, **When** the user clicks "Load Sample Data", **Then** the system populates a realistic set of dummy merchants (e.g., local coffee shops, cafes, and retail shops) distributed around the branch location with pre-configured statuses for immediate testing.

---

### Edge Cases

- **Merchant operates multiple terminals**: How does the system handle a merchant with both an EDC and a Livin' Merchant QRIS profile under the same business identity? The system aggregates sales volume under the parent merchant profile so that a shift from card swipes to QRIS is not falsely flagged as commercial abandonment.
- **Missing or invalid GPS coordinates in data file**: If a row contains invalid or blank coordinates, the system flags the row with a "Coordinates Required" badge, places the merchant in a pending location queue, and allows branch staff to manually search or set the pin on the map.
- **Zero transactions across all acquirers vs. competitor preference**: A merchant may have zero transactions on the bank's terminal because they exclusively route payments to a competitor's POS machine. The visit diagnosis explicitly captures "Competitor Terminal Preferred" to inform branch commercial strategy.
- **Seasonal or newly onboarded merchant**: A merchant onboarded less than 14 days ago might have low initial sales volume. The system factors in acquisition date to prevent penalizing newly deployed terminals with an underperforming alert.
- **Duplicate CIF or Terminal IDs in upload**: If an uploaded file contains duplicate terminal IDs, the system merges the entries using the latest timestamped record and alerts the administrator of the deduplication.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST represent all branch-acquired merchants on an interactive geographic map centered around the branch's defined anchor location.
- **FR-002**: System MUST assign every active merchant to one of three health classifications:
  - **Red (Underperforming)**: Active status, but zero transactions in 14+ days OR sales volume below the configured branch target.
  - **Yellow (Watchlist)**: Active status with transactions, but total sales volume dropped by more than the configured percentage threshold compared to the previous period.
  - **Green (Healthy)**: Active status with consistent or growing sales volume meeting or exceeding branch targets.
- **FR-003**: System MUST provide a distance-sorted list of merchants, displaying distance from the branch, merchant trade name, product type, current sales turnover, transaction count, and health indicator.
- **FR-004**: System MUST allow users to filter the map and list views by health classification (All, Red, Yellow, Green) and acquiring product type (EDC, Livin' Merchant, Both).
- **FR-005**: System MUST allow users to inspect complete merchant details, including Customer Information File (CIF) identifier, Merchant ID (MID), Terminal ID (TID), registered business address, contact telephone, and recent transaction history.
- **FR-006**: System MUST enable authorized users to adjust and save a merchant's geographic pin location directly on the map if the registered address coordinates are inaccurate.
- **FR-007**: System MUST provide a single-click action to launch turn-by-turn navigation to the merchant's coordinates using standard external map applications.
- **FR-008**: System MUST provide an in-app field visit logging workflow allowing branch officers to record on-site visits with visit date, officer name, structured root causes, free-text corrective actions, and notes.
- **FR-009**: The visit diagnostic workflow MUST support structured root-cause categories including: Consumable Depleted (Paper Roll Out), Hardware/Connectivity Failure (SIM Signal Dead / Offline), Operator Capability (Cashier Untrained), Commercial Competition (Competitor Preferred), Business Inactivity (Store Closed / Relocated), and Other.
- **FR-010**: System MUST maintain an append-only historical log of all field visits conducted for each merchant, displaying previous diagnoses, recorded actions, and visiting officer names.
- **FR-011**: System MUST support periodic file ingestion (spreadsheet/CSV format) allowing branch administrators to update merchant sales volumes, transaction counts, and statuses.
- **FR-012**: The ingestion engine MUST validate input schema, reject corrupted files with clear error indicators, update active merchant records, and preserve all previously logged visit records.
- **FR-013**: System MUST provide a downloadable standard data template demonstrating the required schema, headers, and expected data formats.
- **FR-014**: System MUST allow branch administrators to configure the branch anchor profile (branch name, geographic coordinates) and classification threshold values (minimum monthly sales target, percentage drop threshold).
- **FR-015**: System MUST provide an automated sample data generation tool that populates realistic mock merchants around the branch location for demonstration and testing purposes.

### Key Entities *(include if feature involves data)*

- **Branch Profile**: Represents the operating bank branch. Contains branch name, branch code, geographic coordinates (latitude and longitude), and configurable health threshold parameters (red volume threshold, yellow drop percentage threshold).
- **Merchant**: Represents an acquired commercial merchant. Contains customer identifier (CIF), merchant identifier (MID), terminal identifier (TID), merchant trade name, acquiring product type (EDC, Livin' Merchant, Both), operational status (Active, Inactive), physical business address, geographic coordinates, contact phone number, current period sales volume, previous period sales volume, current period transaction count, previous period transaction count, and computed health status.
- **Visit Log**: Represents an on-site field intervention performed by branch personnel. Contains unique visit identifier, linked merchant reference, visit timestamp, visiting officer name, selected root causes, resolution action summary, detailed notes, and completion status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Branch officers can identify the top 5 nearest underperforming merchants within 15 seconds of opening the monitoring view.
- **SC-002**: On-site visit logging (from opening the visit form to saving the completed diagnostic record) can be completed in under 60 seconds on a standard mobile or desktop device.
- **SC-003**: Ingestion of a monthly merchant dataset containing up to 1,000 merchant records parses, validates, and updates health statuses in under 10 seconds.
- **SC-004**: 100% of historical visit logs and diagnostic notes are preserved and accessible across subsequent data file uploads.
- **SC-005**: 90% of visited merchants who received consumable replenishment or operational retraining show transaction activity recovery within 30 days of the recorded visit.

## Assumptions

- The system operates within the operational purview of a single bank branch monitoring its own acquired merchant portfolio.
- Branch staff have mobile or portable web access during field visits, or can log visit results immediately upon returning to the branch.
- Ingested periodic data files provide reliable identifiers (CIF, MID, or TID) to uniquely track merchants across reporting cycles.
- Business addresses provided by enterprise analytics either contain usable coordinates or can be geocoded and manually calibrated by branch staff during initial visits.
- All monetary values are processed and displayed in standard local currency (IDR - Indonesian Rupiah).
