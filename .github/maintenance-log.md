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

## 2026-06-05 00:20 UTC

**Overall:** PASS

- **Backend tests (npm ci && npm test):** pass

```
PASS
added 143 packages, and audited 144 packages in 1s

25 packages are looking for funding
  run `npm fund` for details

7 vulnerabilities (3 moderate, 4 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

> study-assistant-overlay-backend@1.0.0 test
> node --test tests/*.test.js

TAP version 13
# Subtest: API endpoints
    # Subtest: GET /api/health returns OK
    ok 1 - GET /api/health returns OK
      ---
      duration_ms: 23.251074
      ...
    # Subtest: GET /api/ready returns 503 when OpenAI key is missing
    ok 2 - GET /api/ready returns 503 when OpenAI key is missing
      ---
      duration_ms: 3.677355
      ...
    # Subtest: GET /api/ready returns 200 when OpenAI key is configured
    ok 3 - GET /api/ready returns 200 when OpenAI key is configured
      ---
      duration_ms: 2.951472
      ...
    # Subtest: POST /api/classify rejects invalid payloads
    ok 4 - POST /api/classify rejects invalid payloads
      ---
      duration_ms: 8.597447
      ...
    # Subtest: POST /api/classify rejects missing stem for multiple choice
    ok 5 - POST /api/classify rejects missing stem for multiple choice
      ---
      duration_ms: 3.065314
      ...
    # Subtest: echoes X-Request-Id when provided
    ok 6 - echoes X-Request-Id when provided
      ---
      duration_ms: 2.677892
      ...
    1..6
ok 1 - API endpoints
  ---
  duration_ms: 45.601869
  type: 'suite'
  ...
# Subtest: server startup
    # Subtest: listen only when executed directly
    ok 1 - listen only when executed directly
      ---
      duration_ms: 0.141865
      ...
    1..1
ok 2 - server startup
  ---
  duration_ms: 0.32696
  type: 'suite'
  ...
1..2
# tests 7
# suites 2
# pass 7
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 249.987267
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

## 2026-06-05 00:28 UTC

**Overall:** PASS

- **Backend tests (npm ci && npm test):** pass

```
PASS
added 143 packages, and audited 144 packages in 1s

25 packages are looking for funding
  run `npm fund` for details

7 vulnerabilities (3 moderate, 4 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

> study-assistant-overlay-backend@1.0.0 test
> node --test tests/*.test.js

TAP version 13
# Subtest: API endpoints
    # Subtest: GET /api/health returns OK
    ok 1 - GET /api/health returns OK
      ---
      duration_ms: 22.573845
      ...
    # Subtest: GET /api/ready returns 503 when OpenAI key is missing
    ok 2 - GET /api/ready returns 503 when OpenAI key is missing
      ---
      duration_ms: 3.841732
      ...
    # Subtest: GET /api/ready returns 200 when OpenAI key is configured
    ok 3 - GET /api/ready returns 200 when OpenAI key is configured
      ---
      duration_ms: 2.941482
      ...
    # Subtest: POST /api/classify rejects invalid payloads
    ok 4 - POST /api/classify rejects invalid payloads
      ---
      duration_ms: 8.783213
      ...
    # Subtest: POST /api/classify rejects missing stem for multiple choice
    ok 5 - POST /api/classify rejects missing stem for multiple choice
      ---
      duration_ms: 3.087861
      ...
    # Subtest: echoes X-Request-Id when provided
    ok 6 - echoes X-Request-Id when provided
      ---
      duration_ms: 2.564976
      ...
    1..6
ok 1 - API endpoints
  ---
  duration_ms: 45.223454
  type: 'suite'
  ...
# Subtest: server startup
    # Subtest: listen only when executed directly
    ok 1 - listen only when executed directly
      ---
      duration_ms: 0.131647
      ...
    1..1
ok 2 - server startup
  ---
  duration_ms: 0.314842
  type: 'suite'
  ...
1..2
# tests 7
# suites 2
# pass 7
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 259.069097
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

## 2026-06-05 16:29 UTC

**Overall:** PASS

- **Backend tests (npm ci && npm test):** pass

```
PASS
added 143 packages, and audited 144 packages in 1s

25 packages are looking for funding
  run `npm fund` for details

7 vulnerabilities (3 moderate, 4 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

> study-assistant-overlay-backend@1.0.0 test
> node --test tests/*.test.js

TAP version 13
# Subtest: API endpoints
    # Subtest: GET /api/health returns OK
    ok 1 - GET /api/health returns OK
      ---
      duration_ms: 21.746622
      ...
    # Subtest: GET /api/ready returns 503 when OpenAI key is missing
    ok 2 - GET /api/ready returns 503 when OpenAI key is missing
      ---
      duration_ms: 3.454691
      ...
    # Subtest: GET /api/ready returns 200 when OpenAI key is configured
    ok 3 - GET /api/ready returns 200 when OpenAI key is configured
      ---
      duration_ms: 2.672327
      ...
    # Subtest: POST /api/classify rejects invalid payloads
    ok 4 - POST /api/classify rejects invalid payloads
      ---
      duration_ms: 7.880213
      ...
    # Subtest: POST /api/classify rejects missing stem for multiple choice
    ok 5 - POST /api/classify rejects missing stem for multiple choice
      ---
      duration_ms: 2.813701
      ...
    # Subtest: echoes X-Request-Id when provided
    ok 6 - echoes X-Request-Id when provided
      ---
      duration_ms: 2.4359
      ...
    1..6
ok 1 - API endpoints
  ---
  duration_ms: 42.267206
  type: 'suite'
  ...
# Subtest: server startup
    # Subtest: listen only when executed directly
    ok 1 - listen only when executed directly
      ---
      duration_ms: 0.124224
      ...
    1..1
ok 2 - server startup
  ---
  duration_ms: 0.292059
  type: 'suite'
  ...
1..2
# tests 7
# suites 2
# pass 7
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 218.998005
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

## 2026-06-12 16:42 UTC

**Overall:** PASS

- **Backend tests (npm ci && npm test):** pass

```
PASS
added 143 packages, and audited 144 packages in 1s

25 packages are looking for funding
  run `npm fund` for details

7 vulnerabilities (3 moderate, 4 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

> study-assistant-overlay-backend@1.0.0 test
> node --test tests/*.test.js

TAP version 13
# Subtest: API endpoints
    # Subtest: GET /api/health returns OK
    ok 1 - GET /api/health returns OK
      ---
      duration_ms: 24.503844
      ...
    # Subtest: GET /api/ready returns 503 when OpenAI key is missing
    ok 2 - GET /api/ready returns 503 when OpenAI key is missing
      ---
      duration_ms: 4.642428
      ...
    # Subtest: GET /api/ready returns 200 when OpenAI key is configured
    ok 3 - GET /api/ready returns 200 when OpenAI key is configured
      ---
      duration_ms: 3.37003
      ...
    # Subtest: POST /api/classify rejects invalid payloads
    ok 4 - POST /api/classify rejects invalid payloads
      ---
      duration_ms: 10.748432
      ...
    # Subtest: POST /api/classify rejects missing stem for multiple choice
    ok 5 - POST /api/classify rejects missing stem for multiple choice
      ---
      duration_ms: 3.405024
      ...
    # Subtest: echoes X-Request-Id when provided
    ok 6 - echoes X-Request-Id when provided
      ---
      duration_ms: 3.075619
      ...
    1..6
ok 1 - API endpoints
  ---
  duration_ms: 51.236052
  type: 'suite'
  ...
# Subtest: server startup
    # Subtest: listen only when executed directly
    ok 1 - listen only when executed directly
      ---
      duration_ms: 0.145131
      ...
    1..1
ok 2 - server startup
  ---
  duration_ms: 0.332562
  type: 'suite'
  ...
1..2
# tests 7
# suites 2
# pass 7
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 259.156305
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

## 2026-06-19 16:31 UTC

**Overall:** PASS

- **Backend tests (npm ci && npm test):** pass

```
PASS
added 143 packages, and audited 144 packages in 1s

25 packages are looking for funding
  run `npm fund` for details

8 vulnerabilities (3 moderate, 5 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

> study-assistant-overlay-backend@1.0.0 test
> node --test tests/*.test.js

TAP version 13
# Subtest: API endpoints
    # Subtest: GET /api/health returns OK
    ok 1 - GET /api/health returns OK
      ---
      duration_ms: 23.965326
      ...
    # Subtest: GET /api/ready returns 503 when OpenAI key is missing
    ok 2 - GET /api/ready returns 503 when OpenAI key is missing
      ---
      duration_ms: 4.035638
      ...
    # Subtest: GET /api/ready returns 200 when OpenAI key is configured
    ok 3 - GET /api/ready returns 200 when OpenAI key is configured
      ---
      duration_ms: 3.11251
      ...
    # Subtest: POST /api/classify rejects invalid payloads
    ok 4 - POST /api/classify rejects invalid payloads
      ---
      duration_ms: 9.028614
      ...
    # Subtest: POST /api/classify rejects missing stem for multiple choice
    ok 5 - POST /api/classify rejects missing stem for multiple choice
      ---
      duration_ms: 3.334085
      ...
    # Subtest: echoes X-Request-Id when provided
    ok 6 - echoes X-Request-Id when provided
      ---
      duration_ms: 2.819222
      ...
    1..6
ok 1 - API endpoints
  ---
  duration_ms: 47.786443
  type: 'suite'
  ...
# Subtest: server startup
    # Subtest: listen only when executed directly
    ok 1 - listen only when executed directly
      ---
      duration_ms: 0.148818
      ...
    1..1
ok 2 - server startup
  ---
  duration_ms: 0.397143
  type: 'suite'
  ...
1..2
# tests 7
# suites 2
# pass 7
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 261.305755
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

## 2026-06-26 16:13 UTC

**Overall:** PASS

- **Backend tests (npm ci && npm test):** pass

```
PASS
added 143 packages, and audited 144 packages in 1s

25 packages are looking for funding
  run `npm fund` for details

8 vulnerabilities (3 moderate, 5 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

> study-assistant-overlay-backend@1.0.0 test
> node --test tests/*.test.js

TAP version 13
# Subtest: API endpoints
    # Subtest: GET /api/health returns OK
    ok 1 - GET /api/health returns OK
      ---
      duration_ms: 24.143084
      ...
    # Subtest: GET /api/ready returns 503 when OpenAI key is missing
    ok 2 - GET /api/ready returns 503 when OpenAI key is missing
      ---
      duration_ms: 3.989924
      ...
    # Subtest: GET /api/ready returns 200 when OpenAI key is configured
    ok 3 - GET /api/ready returns 200 when OpenAI key is configured
      ---
      duration_ms: 3.050293
      ...
    # Subtest: POST /api/classify rejects invalid payloads
    ok 4 - POST /api/classify rejects invalid payloads
      ---
      duration_ms: 9.284228
      ...
    # Subtest: POST /api/classify rejects missing stem for multiple choice
    ok 5 - POST /api/classify rejects missing stem for multiple choice
      ---
      duration_ms: 3.314496
      ...
    # Subtest: echoes X-Request-Id when provided
    ok 6 - echoes X-Request-Id when provided
      ---
      duration_ms: 2.816147
      ...
    1..6
ok 1 - API endpoints
  ---
  duration_ms: 48.033768
  type: 'suite'
  ...
# Subtest: server startup
    # Subtest: listen only when executed directly
    ok 1 - listen only when executed directly
      ---
      duration_ms: 0.222726
      ...
    1..1
ok 2 - server startup
  ---
  duration_ms: 0.533153
  type: 'suite'
  ...
1..2
# tests 7
# suites 2
# pass 7
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 257.028742
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
