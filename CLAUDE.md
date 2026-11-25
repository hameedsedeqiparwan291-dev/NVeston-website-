# Development instructions (NVeston)

These instructions apply to anyone, human or AI assistant, developing or testing this project.

## Permanent API expenditure and testing policy (adopted 2026-11-24 by the Founder & Managing Member)

1. Internal testing defaults to offline tests, mocked AI responses, existing regression datasets and non-billable verification (health checks, protected-endpoint checks, routes answered without an AI call).
2. No paid AI API calls for internal testing, demonstrations, routine monitoring, repeated evaluations or post-deployment verification without the Founder's explicit authorization for that specific activity and amount.
3. An unused portion of a previously authorized testing budget is never spent automatically; each new test run needs its own authorization.
4. HAMI keeps its full intelligence and responsiveness for genuine customers; this policy restricts internal testing only.
5. The existing $10 monthly Anthropic API spending limit stays unchanged unless the Founder changes it.
6. Genuine customer interactions are monitored only through the secured, founder-exclusive analytics system.
7. Internal verification conversations are excluded from genuine customer engagement metrics without deleting historical records. Internal sessions are identifiable by the session-ID prefixes `nveston_verify_` (production verification) and `nveston_eval_` (local evaluations, which use a separate local database). Since the Final Targeted Maintenance (authorized 2026-11-24), dashboard totals, engagement metrics and conversion statistics exclude `nveston_verify_` sessions automatically; the founder can include them with `include_internal=1`. The `nveston_verify_` prefix is accepted only on founder-authenticated requests, so internal verification must send founder authentication; a visitor-supplied prefix is discarded.
8. No automated monitoring that generates paid AI conversations.

## Other standing rules
- Do not push, deploy or publish without the Founder's explicit authorization.
- Preserve Cross-NEX and NEX Triangle confidentiality, founder-exclusive analytics and knowledge access, authentication, rate limits, visitor data and backups.
- Never display, log or transmit credentials or visitor conversation contents.
