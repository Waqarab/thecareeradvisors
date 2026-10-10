# Page Views Migration Notes

## Migration Details
**What was migrated**: Old page-view push-ID formatted data was migrated into a compact increment-counter format. The push-ID format previously flooded the Firebase Realtime Database with individual children for each visit. The new format aggregates these into daily numbers, maintaining total visits, source breakdowns, and landing page breakdowns.
**When**: October 10, 2026

## Special Handlings
- **2026-06-01 Overlap**: Both `stats/visits` and `stats/page_views` had records for `2026-06-01`. The migration explicitly skips the `visits` version for this date, relying entirely on the richer `page_views` data.
- **May 2026 Data**: Data from May 21 to May 31 originated purely from the legacy `stats/visits` node. This legacy data only contained counts, meaning there are no `sources` or `pages` breakdowns for these dates. The Admin panel UI is aware of this and attributes these older views to "Direct / Other" gracefully.
- **Bot Traffic Anomaly**: Known bot traffic occurred in early October (e.g., HeadlessChrome instances). Due to missing or unrecognized referrers, this traffic is aggregated and counted under "Direct / Other".

## Script Usage
The migration script is idempotent and can be safely re-run. It checks if the `total` already exists for a given date before attempting to perform any processing, skipping it if so.

### How to Run
Ensure you have the required environment variables in `.env.local` to allow the Admin SDK to authenticate.
From the root of the project, run:
```bash
npx tsx scripts/migrate-pageviews.mjs
```

### Re-running the Script
If new legacy push-IDs mistakenly make their way into the database, you can simply run the script again. It will skip any dates that have already been converted to counters and process only the missing data.
