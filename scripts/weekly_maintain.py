#!/usr/bin/env python3
"""Run weekly maintenance checks and append results to the maintenance log."""

from __future__ import annotations

import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
LOG_PATH = REPO_ROOT / ".github" / "maintenance-log.md"


def run_command(label: str, command: str, cwd: Path | None = None) -> tuple[str, bool, str]:
    """Run a shell command and return (label, passed, combined output)."""
    result = subprocess.run(
        command,
        shell=True,
        cwd=cwd or REPO_ROOT,
        capture_output=True,
        text=True,
    )
    output = (result.stdout or "") + (result.stderr or "")
    output = output.strip()
    if len(output) > 4000:
        output = output[:4000] + "\n... (truncated)"
    passed = result.returncode == 0
    summary = "PASS" if passed else f"FAIL (exit {result.returncode})"
    return label, passed, summary + ("\n" + output if output else "")


def append_log_entry(results: list[tuple[str, bool, str]]) -> None:
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    overall = "PASS" if all(passed for _, passed, _ in results) else "FAIL"

    lines = [
        "",
        f"## {timestamp}",
        "",
        f"**Overall:** {overall}",
        "",
    ]
    for label, passed, detail in results:
        status = "pass" if passed else "fail"
        lines.append(f"- **{label}:** {status}")
        if detail:
            lines.append("")
            lines.append("```")
            lines.append(detail)
            lines.append("```")
        lines.append("")

    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not LOG_PATH.exists():
        LOG_PATH.write_text(
            "# Weekly Maintenance Log\n\n"
            "Updated automatically by the Weekly Maintenance GitHub Actions workflow "
            "(Fridays 14:00 UTC).\n",
            encoding="utf-8",
        )

    with LOG_PATH.open("a", encoding="utf-8") as handle:
        handle.write("\n".join(lines))


def main() -> None:
    results: list[tuple[str, bool, str]] = []

    results.append(
        run_command(
            "Backend tests (npm ci && npm test)",
            "npm ci && npm test",
            cwd=REPO_ROOT / "src" / "backend",
        )
    )

    for filename in ("content.js", "background.js", "popup.js"):
        results.append(
            run_command(
                f"Frontend syntax ({filename})",
                f"node --check src/frontend/{filename}",
            )
        )

    results.append(
        run_command(
            "manifest.json parse",
            "node -e \"JSON.parse(require('fs').readFileSync('src/frontend/manifest.json','utf8'));\"",
        )
    )

    append_log_entry(results)
    # Always exit 0 so the workflow can commit the log even when tests fail.
    sys.exit(0)


if __name__ == "__main__":
    main()
