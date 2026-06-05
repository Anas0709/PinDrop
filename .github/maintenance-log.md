# Weekly Maintenance Log

Updated automatically by the [Weekly Maintenance](.github/workflows/weekly-maintenance.yml) GitHub Actions workflow (every Friday at 14:00 UTC).

Manual runs are available via **Actions → Weekly Maintenance → Run workflow**.

## 2026-06-05 00:19 UTC

**Overall:** PASS

- **Backend tests (npm ci && npm test):** pass

```
PASS
added 144 packages, and audited 145 packages in 748ms

25 packages are looking for funding
  run `npm fund` for details

7 vulnerabilities (3 moderate, 4 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

> study-assistant-overlay-backend@1.0.0 test
> node --test tests/*.test.js

▶ API endpoints
  ✔ GET /api/health returns OK (13.326583ms)
  ✔ GET /api/ready returns 503 when OpenAI key is missing (2.569709ms)
  ✔ GET /api/ready returns 200 when OpenAI key is configured (2.193083ms)
  ✔ POST /api/classify rejects invalid payloads (4.9045ms)
  ✔ POST /api/classify rejects missing stem for multiple choice (2.876042ms)
  ✔ echoes X-Request-Id when provided (1.158541ms)
✔ API endpoints (27.614459ms)
▶ server startup
  ✔ listen only when executed directly (0.050542ms)
✔ server startup (0.10375ms)
ℹ tests 7
ℹ suites 2
ℹ pass 7
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 177.22075
npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
```

- **Frontend syntax (content.js):** pass

```
PASS
```

- **Frontend syntax (background.js):** pass

```
PASS
```

- **Frontend syntax (popup.js):** pass

```
PASS
```

- **manifest.json parse:** pass

```
PASS
```
