# Security operations and recovery

Reviewed: 18 October 2026. This document contains no credentials.

## Rollback

The baseline before this hardening is commit cd0b184e33d6aa25cfa7e387f6f553187c173f98.
The corresponding production deployment is E9tevEYUwqakRCnhQnKifGQBMyCF.
The owner also has a local Git bundle named security-before-2026-10-18.bundle.
Git bundles contain code and history, not private tracker records or CMS backups.

For a code regression, use Vercel's deployment rollback to the last verified deployment,
or revert the relevant security commit and deploy the revert. Never force push.
Reverting the framework patch restores known vulnerable dependencies: prefer a forward
fix, and treat an emergency rollback as temporary with a mitigation decision.
Fetch origin/main and reconcile changes before any push. Commits for this project must
use author email Joansonltd@gmail.com. Main pushes automatically deploy production.

## Data and configuration inventory

| Asset | Current location | Backup and restore status |
| --- | --- | --- |
| Website code | GitHub repository and Vercel deployments | Git history and local bundle available; production rollback not exercised |
| Activity records | Private Vercel Blob, dashboard/records.json | Independent backup schedule and restore drill unverified |
| Login attempt buckets | Private Vercel Blob | Retention and cleanup unverified; do not delete as part of this change |
| CMS content and assets | Sanity | Dataset exports, retention, recovery roles and restore drill unverified |
| Submitted enquiries | Destination configured by LEAD_WEBHOOK_URL | Owner must identify destination owner, backups and retention without sharing the URL |
| Credentials | Vercel environment variables and owner-controlled local files | Do not commit, print, copy into reports or rotate without approval |
| Domain and DNS | Owner's Squarespace account | Record configuration privately before any separately approved change |

Do not copy customer data into Git, preview deployments, issue trackers or reports.
Choose backup destination, encryption/access, retention, cost and recovery targets with
the owner before creating jobs or testing a restore. Use isolated storage for a restore
drill; never overwrite production as a test.

## Verified provider baseline

On 18 October the Vercel UI showed system firewall/DDoS mitigations active, no custom
rules, Bot Protection Off and AI Bots Allow. The Past Day overview showed 193 allowed,
808 denied and 19 challenged requests, with no active alerts. This is a snapshot, not a
traffic baseline or proof that all attacks are blocked.
Deployment Protection showed Vercel Authentication enabled with Standard Protection,
no listed protection exceptions, and protected source maps enabled.
BotID's Basic UI selection alone does not mean BotID is installed in the application.
No provider setting was changed. Sanity's management page required login in this session;
roles, dataset visibility, CORS and MFA remain unverified. Search-console controls remain
unverified.

## Monitoring and incident response

Review lead forwarding failures, login failures, 429/5xx responses, firewall challenges
and false positives, function/Blob costs, crawl errors and dependency advisories.
Keep names, phone numbers, dates of birth, messages, passwords, cookies, webhook URLs
and tokens out of logs and alerts. A configured webhook failure must never interrupt
the WhatsApp handoff.

If an incident is suspected, preserve timestamps, deployment IDs and redacted event
metadata. Contact the site owner through the owner's established private channel and
the relevant provider support. Account ownership and recovery contacts must be recorded
privately by the owner. Do not publish an incident allegation or customer information.
Obtain approval before credential rotation, access changes, DNS/firewall enforcement,
data restoration or deletion. No scheduled monitoring or notification integration has
been created by this work.

## Monthly review

- Review dependency advisories; handle urgent patches promptly rather than waiting a month.
- Review provider members, MFA, least-privilege roles and recovery access.
- Check lead delivery, booking, mobile WhatsApp, dashboard access and library exports.
- Review bot-rule false positives and search indexing without blocking verified search crawlers.
- Verify approved backups and perform an isolated restore drill on the agreed schedule.
- Review enquiry retention and privacy wording against actual data handling.

## Regression and rollout gate

Run TypeScript, a production build and the security test suite. Use synthetic fixtures
and a mock webhook so tests do not create real enquiries. Verify the protected preview,
including optimized photos, booking, forms, analytics, Studio and private routes before
promotion. Do not submit a real lead, appointment or production tracker record as a test
without an agreed disposable fixture and destination.
The changes do not add MFA, revoke copied sessions, enforce a CSP, enable edge rate limits,
or make the already-public research index confidential. Those remain separate decisions.
