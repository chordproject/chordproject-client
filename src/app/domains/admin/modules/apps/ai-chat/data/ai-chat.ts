import { Injectable } from '@angular/core';
import { Conversation } from '@/app/domains/admin/modules/apps/ai-chat/data/model';

@Injectable({ providedIn: 'root' })
export class AiChatService {
  private conversations: Conversation[] = [
    {
      id: 'a1f4c9e2',
      title: 'Zoneless change detection migration',
      createdAt: '2026-08-03T09:12:00.000Z',
      messages: [
        {
          id: 'a1f4c9e2-1',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'We are about to flip our Angular app to zoneless. What breaks first in practice?',
            },
          ],
          createdAt: '2026-08-03T09:12:00.000Z',
        },
        {
          id: 'a1f4c9e2-2',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'In practice the first casualties are the places where you mutate state outside of a signal and quietly rely on Zone.js to notice. The three most common ones are: values updated from a setTimeout or a raw addEventListener callback, third-party widgets that write to component fields directly, and anything driven by a plain class property that a template reads.',
            },
            {
              type: 'text',
              value:
                'The fix is almost always mechanical rather than architectural. Move the property to a signal and the template re-renders on write, no matter which context produced it.',
            },
            {
              type: 'code',
              language: 'typescript',
              value: `export class Ticker {\n  readonly elapsed = signal(0);\n\n  constructor() {\n    const id = setInterval(() => this.elapsed.update((v) => v + 1), 1000);\n    inject(DestroyRef).onDestroy(() => clearInterval(id));\n  }\n}`,
            },
            {
              type: 'text',
              value:
                'Once that pass is done, turn on the zoneless provider in a single feature route first rather than the whole app. It keeps the blast radius small and the failures easy to attribute.',
            },
          ],
          createdAt: '2026-08-03T09:13:00.000Z',
        },
        {
          id: 'a1f4c9e2-3',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'Our test suite uses fakeAsync heavily. Does that survive the switch?',
            },
          ],
          createdAt: '2026-08-03T09:15:00.000Z',
        },
        {
          id: 'a1f4c9e2-4',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'Mostly, yes. fakeAsync still patches timers and microtasks, so tests that tick through a debounce keep working. What changes is the implicit re-render: after advancing time you now need an explicit fixture.detectChanges() where the zone used to do it for you.',
            },
            {
              type: 'text',
              value:
                'A practical migration order is to start with the specs that already call detectChanges explicitly, since those need no edits at all, then work through the ones that assert on the DOM',
            },
          ],
          createdAt: '2026-08-03T09:16:00.000Z',
          streaming: true,
        },
      ],
    },
    {
      id: 'b7d0e3a5',
      title: 'Pricing page copy for the Team plan',
      createdAt: '2026-08-03T07:40:00.000Z',
      messages: [
        {
          id: 'b7d0e3a5-1',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'Draft three headline options for our Team plan. Audience is 10-50 person product companies.',
            },
          ],
          createdAt: '2026-08-03T07:40:00.000Z',
        },
        {
          id: 'b7d0e3a5-2',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'Here are three angles rather than three rewordings, so you can test which promise resonates instead of which adjective does.',
            },
            {
              type: 'text',
              value:
                'One, the coordination angle: "Everyone on the same page, without another meeting." Two, the speed angle: "Ship the week, not the quarter." Three, the trust angle: "One workspace your whole team can actually audit."',
            },
            {
              type: 'text',
              value:
                'If you only have budget for one test, I would run the coordination angle first. It is the pain a 30-person company feels daily, while speed is what they say they want in surveys.',
            },
          ],
          createdAt: '2026-08-03T07:41:00.000Z',
        },
        {
          id: 'b7d0e3a5-3',
          role: 'user',
          content: [
            {
              type: 'text',
              value: 'Good. Now a subhead for the coordination one.',
            },
          ],
          createdAt: '2026-08-03T07:44:00.000Z',
        },
        {
          id: 'b7d0e3a5-4',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                '"Shared boards, shared context, and a single place decisions get written down. Set it up in an afternoon and keep it for years."',
            },
            {
              type: 'text',
              value:
                'It earns the headline by naming the mechanism, and the second sentence quietly answers the two objections buyers raise at this size: migration cost and lock-in.',
            },
          ],
          createdAt: '2026-08-03T07:45:00.000Z',
        },
      ],
    },
    {
      id: 'c2b8f610',
      title: 'Postgres index not being used',
      createdAt: '2026-08-02T16:25:00.000Z',
      messages: [
        {
          id: 'c2b8f610-1',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'I added a btree index on orders(customer_id, created_at) but the planner still does a seq scan. Why?',
            },
          ],
          createdAt: '2026-08-02T16:25:00.000Z',
        },
        {
          id: 'c2b8f610-2',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'A seq scan on a table that fits comfortably in cache is often the correct plan, so the first question is whether the planner is wrong at all. Run the query with timing and buffers before assuming it is.',
            },
            {
              type: 'code',
              language: 'sql',
              value: `EXPLAIN (ANALYZE, BUFFERS)\nSELECT id, total\nFROM orders\nWHERE customer_id = 4821\n  AND created_at >= now() - interval '30 days';`,
            },
            {
              type: 'text',
              value:
                'If the estimated row count is wildly off from the actual, the statistics are stale and ANALYZE orders will fix more than any index will. If the estimate is accurate and the planner still declines the index, it usually means the predicate is not sargable, most often because created_at is wrapped in a cast or a function on the left-hand side.',
            },
          ],
          createdAt: '2026-08-02T16:27:00.000Z',
        },
        {
          id: 'c2b8f610-3',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'Estimates look fine and there is no cast. Table is about 40 million rows.',
            },
          ],
          createdAt: '2026-08-02T16:33:00.000Z',
        },
        {
          id: 'c2b8f610-4',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'At that size the likely culprit is the cost of the heap fetches. The index gives you the rows, but the planner still expects a random read per row to get total, and past roughly 5 to 10 percent selectivity a sequential scan wins that arithmetic.',
            },
            {
              type: 'text',
              value:
                'Adding the selected columns to the index turns it into an index-only scan and removes the heap trips entirely.',
            },
            {
              type: 'code',
              language: 'sql',
              value: `CREATE INDEX CONCURRENTLY orders_customer_recent_idx\n  ON orders (customer_id, created_at)\n  INCLUDE (id, total);`,
            },
            {
              type: 'text',
              value:
                'Use CONCURRENTLY so the build does not take a write lock, and be aware it is slower and can leave an invalid index behind if it fails. Check indisvalid afterwards.',
            },
          ],
          createdAt: '2026-08-02T16:36:00.000Z',
        },
      ],
    },
    {
      id: 'd9a15c77',
      title: 'Q3 board update outline',
      createdAt: '2026-08-02T11:05:00.000Z',
      messages: [
        {
          id: 'd9a15c77-1',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'Help me outline a board update. We missed the revenue target but retention is way up.',
            },
          ],
          createdAt: '2026-08-02T11:05:00.000Z',
        },
        {
          id: 'd9a15c77-2',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'Lead with the miss. Boards discount good news that arrives before bad news, so put the number in the first line, name the gap, and then spend the rest of the deck on what you learned.',
            },
            {
              type: 'text',
              value:
                'A structure that works: the headline number and variance, the two or three drivers behind it, what retention is telling you about product-market fit, the revised plan for Q4, and finally the asks. Keep the asks to three at most.',
            },
          ],
          createdAt: '2026-08-02T11:07:00.000Z',
        },
        {
          id: 'd9a15c77-3',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'How do I frame retention without it sounding like a hedge?',
            },
          ],
          createdAt: '2026-08-02T11:12:00.000Z',
        },
        {
          id: 'd9a15c77-4',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'Tie it to a forward number rather than presenting it as consolation. Net revenue retention above 110 percent means the revenue you already booked compounds, so the Q4 target needs less new logo volume than the same target did last quarter.',
            },
            {
              type: 'text',
              value:
                'Stated that way it is not a hedge, it is a change in the shape of the plan, and it invites the board to argue about acquisition spend instead of about your credibility.',
            },
          ],
          createdAt: '2026-08-02T11:14:00.000Z',
        },
      ],
    },
    {
      id: 'e4c73b28',
      title: 'Dockerfile build cache is thrashing',
      createdAt: '2026-08-01T14:50:00.000Z',
      messages: [
        {
          id: 'e4c73b28-1',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'Every CI build reinstalls all node modules even when only source files changed. What am I doing wrong?',
            },
          ],
          createdAt: '2026-08-01T14:50:00.000Z',
        },
        {
          id: 'e4c73b28-2',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'Almost certainly you are copying the whole working tree before installing. That makes the install layer depend on every file in the repo, so any source edit invalidates it.',
            },
            {
              type: 'text',
              value:
                'Copy only the manifest and lockfile first, install, then copy the rest.',
            },
            {
              type: 'code',
              language: 'dockerfile',
              value: `FROM node:22-alpine\nWORKDIR /app\n\nCOPY package.json package-lock.json ./\nRUN npm ci\n\nCOPY . .\nRUN npm run build`,
            },
            {
              type: 'text',
              value:
                'With that ordering a source-only change reuses the install layer and the build drops to whatever your bundler costs. If CI still misses the cache, the runner is probably starting from an empty layer store, and you need to enable a registry-backed cache explicitly.',
            },
            {
              type: 'code',
              language: 'bash',
              value: `docker buildx build \\\n  --cache-from type=registry,ref=ghcr.io/acme/app:cache \\\n  --cache-to type=registry,ref=ghcr.io/acme/app:cache,mode=max \\\n  -t ghcr.io/acme/app:latest .`,
            },
          ],
          createdAt: '2026-08-01T14:53:00.000Z',
        },
        {
          id: 'e4c73b28-3',
          role: 'user',
          content: [
            {
              type: 'text',
              value: 'What does mode=max buy me over the default?',
            },
          ],
          createdAt: '2026-08-01T14:58:00.000Z',
        },
        {
          id: 'e4c73b28-4',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'The default only exports the layers of the final image. mode=max also exports intermediate layers, which is exactly what you need for a multi-stage build where the expensive work happens in a stage that gets discarded.',
            },
            {
              type: 'text',
              value:
                'The trade-off is cache size and push time. On a small image it is free, on a large monorepo image it can add a minute to every build, so measure before you keep it.',
            },
          ],
          createdAt: '2026-08-01T15:00:00.000Z',
        },
      ],
    },
    {
      id: 'f80d2e44',
      title: 'Rewriting the onboarding email sequence',
      createdAt: '2026-07-31T10:20:00.000Z',
      messages: [
        {
          id: 'f80d2e44-1',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'Our five-email onboarding sequence has a 12 percent open rate by email three. Where do I start?',
            },
          ],
          createdAt: '2026-07-31T10:20:00.000Z',
        },
        {
          id: 'f80d2e44-2',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'Start by deleting an email. A five-step sequence sent on a fixed schedule usually contains at least one message that exists because the calendar demanded it rather than because the user needed it, and that is the one training people to stop opening.',
            },
            {
              type: 'text',
              value:
                'Then switch the remaining sends from time-based to behaviour-based. An email that arrives because someone just created their first project reads as helpful. The same email on day three reads as marketing.',
            },
          ],
          createdAt: '2026-07-31T10:22:00.000Z',
        },
        {
          id: 'f80d2e44-3',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'We only have one meaningful activation event right now. Is that enough to trigger on?',
            },
          ],
          createdAt: '2026-07-31T10:29:00.000Z',
        },
        {
          id: 'f80d2e44-4',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'It is enough for a two-branch sequence, which is a large improvement over none. Users who hit the event get a short path toward the second habit, users who do not get a single message about the obstacle you most often see, and then the sequence stops.',
            },
            {
              type: 'text',
              value:
                'Stopping matters more than people expect. A sequence that ends cleanly leaves you permission to email again later, and that is worth more than the marginal open on email five.',
            },
          ],
          createdAt: '2026-07-31T10:31:00.000Z',
        },
      ],
    },
    {
      id: '05eab913',
      title: 'Explaining OAuth PKCE to the team',
      createdAt: '2026-07-30T13:15:00.000Z',
      messages: [
        {
          id: '05eab913-1',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'I need a plain-English explanation of PKCE for a team that knows OAuth but not the details.',
            },
          ],
          createdAt: '2026-07-30T13:15:00.000Z',
        },
        {
          id: '05eab913-2',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'The problem PKCE solves is narrow: in a public client there is no secret, so if an attacker intercepts the authorization code, nothing stops them from redeeming it. PKCE gives the client a way to prove it is the same party that started the flow.',
            },
            {
              type: 'text',
              value:
                'The client invents a random string, keeps it, and sends only its hash when it asks for the code. When it later exchanges the code it sends the original string. The server hashes it and compares. An attacker holding the code alone cannot produce the string, so the exchange fails.',
            },
            {
              type: 'text',
              value:
                'The useful framing for the team is that it turns a bearer secret into a proof of possession, without ever needing to ship a secret to the browser.',
            },
          ],
          createdAt: '2026-07-30T13:17:00.000Z',
        },
        {
          id: '05eab913-3',
          role: 'user',
          content: [
            {
              type: 'text',
              value: 'Do we still need it if we use the state parameter?',
            },
          ],
          createdAt: '2026-07-30T13:24:00.000Z',
        },
        {
          id: '05eab913-4',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'Yes, they defend against different attacks. state protects against cross-site request forgery on the redirect, meaning someone tricking your app into completing a flow it did not start. PKCE protects the code itself once it has been issued.',
            },
            {
              type: 'text',
              value:
                'Use both. The current guidance treats PKCE as mandatory for every client type, including confidential ones, because it costs almost nothing and closes a class of proxy and redirect leaks.',
            },
          ],
          createdAt: '2026-07-30T13:26:00.000Z',
        },
      ],
    },
    {
      id: '1c6f7d90',
      title: 'Hiring plan for the platform team',
      createdAt: '2026-07-28T09:05:00.000Z',
      messages: [
        {
          id: '1c6f7d90-1',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'Two open headcount on a five-person platform team. Two senior engineers, or one senior and one SRE?',
            },
          ],
          createdAt: '2026-07-28T09:05:00.000Z',
        },
        {
          id: '1c6f7d90-2',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'The deciding question is what wakes the team up at night. If the pages are about capacity, deploys, and recovery time, an SRE pays for itself in the first quarter and gives the other four people their focus back. If the pages are rare and the backlog is the real constraint, two senior engineers is the better trade.',
            },
            {
              type: 'text',
              value:
                'One caution on the split hire: a single SRE on a team with no existing reliability practice tends to become a one-person on-call rotation rather than a force multiplier. If you go that route, budget explicitly for the practice, not just the person.',
            },
          ],
          createdAt: '2026-07-28T09:08:00.000Z',
        },
        {
          id: '1c6f7d90-3',
          role: 'user',
          content: [
            {
              type: 'text',
              value:
                'Pages are frequent but mostly noise. Does that change it?',
            },
          ],
          createdAt: '2026-07-28T09:14:00.000Z',
        },
        {
          id: '1c6f7d90-4',
          role: 'assistant',
          content: [
            {
              type: 'text',
              value:
                'It changes the job description more than the headcount. Frequent noisy pages are an alerting problem, and the first six months of that role is deleting and rewriting alerts rather than building infrastructure.',
            },
            {
              type: 'text',
              value:
                'Hire for someone who is energised by that cleanup work and say so in the posting. The candidates who want to build a platform from scratch will self-select out, which is exactly what you want here.',
            },
          ],
          createdAt: '2026-07-28T09:17:00.000Z',
        },
      ],
    },
  ];

  data = {
    conversations: this.conversations,
  };
}
