# PostHog post-wizard report

The wizard has completed a PostHog integration for this Next.js 16 App Router project (DevEvent). The setup includes:

- **PostHog initialization** via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with client-side exception tracking enabled.
- **Reverse proxy rewrites** in `next.config.ts` routing PostHog ingestion and static asset requests through `/ingest/*`, keeping analytics traffic first-party.
- **Environment variables** written to `.env.local` (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`).
- **Two client-side events** captured at the project's key interaction points.

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the 'Explore Events' call-to-action button on the home page. | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on a featured event card to view its detail page. Properties: `event_title`, `event_slug`, `event_location`, `event_date`. | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/485539/dashboard/1759213)
- [Explore Events button clicks](https://us.posthog.com/project/485539/insights/dAbKcnc5)
- [Event card clicks over time](https://us.posthog.com/project/485539/insights/MvBUcbnN)
- [Engagement overview](https://us.posthog.com/project/485539/insights/AGGdvtWL)
- [Unique users exploring events](https://us.posthog.com/project/485539/insights/lU0vPYMS)
- [Most clicked events by title](https://us.posthog.com/project/485539/insights/gbKV8MrK)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
