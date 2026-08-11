import { computed, Injectable, signal } from '@angular/core';
import { formatISO, setHours, setMinutes, subDays } from 'date-fns';
import {
  Mail,
  MailFolder,
  MailLabel,
} from '@/app/domains/admin/modules/apps/mailbox/data/model';

const at = (daysAgo: number, hours: number, minutes = 0): string =>
  formatISO(setMinutes(setHours(subDays(new Date(), daysAgo), hours), minutes));

export const LABELS: MailLabel[] = [
  { id: 'work', label: 'Work', color: 'bg-indigo-500' },
  { id: 'personal', label: 'Personal', color: 'bg-emerald-500' },
  { id: 'invoices', label: 'Invoices', color: 'bg-amber-500' },
  { id: 'urgent', label: 'Urgent', color: 'bg-red-500' },
  { id: 'travel', label: 'Travel', color: 'bg-cyan-500' },
  { id: 'events', label: 'Events', color: 'bg-purple-500' },
];

const mails: Mail[] = [
  {
    id: 'MAIL-1001',
    from: {
      name: 'Josefina Lloyd',
      email: 'josefina.lloyd@company.com',
      avatar: 'images/photos/female-05.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Design review notes from this morning',
    body: [
      'Hey Brian,',
      'I wrote up the notes from the design review. The main takeaway is that the onboarding flow needs one less step — we agreed to merge the profile and preferences screens into a single form.',
      'Could you take a look at the attached summary before tomorrow’s standup? I’d like to close this out by the end of the week.',
      'Thanks!',
    ],
    date: at(0, 9, 24),
    read: false,
    starred: true,
    folder: 'inbox',
    labels: ['work'],
    attachments: [{ name: 'design-review-notes.pdf', size: '248 KB' }],
    thread: [
      {
        from: {
          name: 'Josefina Lloyd',
          email: 'josefina.lloyd@company.com',
          avatar: 'images/photos/female-05.jpg',
        },
        date: at(1, 15, 42),
        body: [
          'Hey Brian,',
          'Quick heads up — the design review is tomorrow at nine. I moved it earlier so the whole team can join before the standup.',
          'Agenda is the onboarding flow, nothing else.',
        ],
      },
      {
        from: {
          name: 'Brian Hughes',
          email: 'hughes.brian@company.com',
          avatar: 'images/photos/male-02.jpg',
        },
        date: at(1, 16, 20),
        body: [
          'Works for me. I’ll bring the drop-off numbers from the current flow so we’re arguing with data instead of taste.',
        ],
      },
    ],
  },
  {
    id: 'MAIL-1002',
    from: {
      name: 'Dejesus Michael',
      email: 'dejesus.michael@company.com',
      avatar: 'images/photos/male-01.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Auth module migration is ready for review',
    body: [
      'Brian,',
      'The standalone migration for the auth module is done and the PR is up. All guards are functional now and the lazy routes are wired through the new structure.',
      'It touches quite a few files, so grab a coffee before you start. I split the commits by feature to make it easier to follow.',
    ],
    date: at(0, 8, 2),
    read: false,
    starred: false,
    folder: 'inbox',
    labels: ['work', 'urgent'],
    attachments: [],
    thread: [
      {
        from: {
          name: 'Dejesus Michael',
          email: 'dejesus.michael@company.com',
          avatar: 'images/photos/male-01.jpg',
        },
        date: at(3, 10, 15),
        body: [
          'Brian,',
          'Starting the standalone migration for the auth module today. Plan is guards first, then the components, then the lazy routes.',
        ],
      },
      {
        from: {
          name: 'Brian Hughes',
          email: 'hughes.brian@company.com',
          avatar: 'images/photos/male-02.jpg',
        },
        date: at(3, 11, 2),
        body: [
          'Sounds right. Keep the commits split by feature if you can — last migration was a nightmare to review as one blob.',
        ],
      },
      {
        from: {
          name: 'Dejesus Michael',
          email: 'dejesus.michael@company.com',
          avatar: 'images/photos/male-01.jpg',
        },
        date: at(1, 14, 48),
        body: [
          'Guards and components are done. Routes are trickier than expected — the redirect logic was leaning on the module injector. Should still make it by tomorrow.',
        ],
      },
    ],
  },
  {
    id: 'MAIL-1003',
    from: {
      name: 'Aurora Cloud',
      email: 'billing@auroracloud.io',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'Your invoice for July is available',
    body: [
      'Hello,',
      'Your invoice for July 2026 is now available. The total amount of $184.00 will be charged to your card on file within the next three business days.',
      'You can view the full breakdown of usage in your billing dashboard.',
    ],
    date: at(0, 6, 41),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['invoices'],
    attachments: [{ name: 'invoice-2026-07.pdf', size: '96 KB' }],
  },
  {
    id: 'MAIL-1004',
    from: {
      name: 'Carver Fuentes',
      email: 'carver.fuentes@company.com',
      avatar: 'images/photos/male-03.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Re: Conference booth schedule',
    body: [
      'Sounds good. I’ll take the morning slot then, you take the afternoon.',
      'By the way, the new demo laptop arrived — I’ll set it up with the latest build before we leave. Let me know if you want anything specific preloaded.',
    ],
    date: at(1, 17, 12),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work'],
    attachments: [],
  },
  {
    id: 'MAIL-1005',
    from: {
      name: 'Sarah',
      email: 'sarah.mail@gmail.com',
      avatar: 'images/photos/female-01.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Lunch on Friday?',
    body: [
      'Hey!',
      'Are we still on for lunch on Friday? The place we talked about has a table free at one. I can book it if you’re in.',
      'Also — I found that book you mentioned, it’s great so far.',
    ],
    date: at(1, 12, 55),
    read: false,
    starred: true,
    folder: 'inbox',
    labels: ['personal'],
    attachments: [],
    thread: [
      {
        from: {
          name: 'Brian Hughes',
          email: 'hughes.brian@company.com',
          avatar: 'images/photos/male-02.jpg',
        },
        date: at(3, 20, 31),
        body: [
          'Hey, feels like we haven’t caught up in ages. Free at some point this week?',
        ],
      },
    ],
  },
  {
    id: 'MAIL-1006',
    from: {
      name: 'Nordic Furniture',
      email: 'orders@nordicfurniture.com',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'Your order has shipped',
    body: [
      'Good news — your order #48213 has shipped!',
      'Estimated delivery is Thursday. You can track the package using the link in your account.',
    ],
    date: at(1, 9, 30),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['personal'],
    attachments: [],
  },
  {
    id: 'MAIL-1007',
    from: {
      name: 'Barrera Bradford',
      email: 'barrera.bradford@company.com',
      avatar: 'images/photos/male-06.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Q3 roadmap draft',
    body: [
      'Hi Brian,',
      'First draft of the Q3 roadmap is attached. The dashboard rework and the reporting module are the two big rocks; everything else is negotiable.',
      'Comments welcome until Wednesday, then I’ll circulate the final version to the wider team.',
    ],
    date: at(2, 15, 8),
    read: true,
    starred: true,
    folder: 'inbox',
    labels: ['work'],
    attachments: [{ name: 'q3-roadmap-draft.pptx', size: '1.2 MB' }],
  },
  {
    id: 'MAIL-1008',
    from: {
      name: 'Adeline Snider',
      email: 'adeline.snider@company.com',
      avatar: 'images/photos/female-04.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Reminder: performance reviews due next week',
    body: [
      'Hi all,',
      'A friendly reminder that self-assessments are due by the end of next week. The form takes about twenty minutes — please don’t leave it to the last day like last cycle.',
      'Ping me if you have trouble accessing the tool.',
    ],
    date: at(2, 10, 4),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work'],
    attachments: [],
  },
  {
    id: 'MAIL-1009',
    from: {
      name: 'City Fitness',
      email: 'members@cityfitness.com',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'Your membership renews soon',
    body: [
      'Hi Brian,',
      'Your annual membership renews on the 28th. No action is needed — this is just a heads up before we charge the card on file.',
      'See you at the gym!',
    ],
    date: at(3, 8, 17),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['personal'],
    attachments: [],
  },
  {
    id: 'MAIL-1010',
    from: {
      name: 'Wilder Gonzales',
      email: 'wilder.gonzales@company.com',
      avatar: 'images/photos/male-04.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Flaky e2e tests on the orders suite',
    body: [
      'Brian,',
      'The orders e2e suite failed three times on main this week, always on the checkout spec. Looks like a race between the cart update and the summary assertion.',
      'I can pick it up on Thursday unless you get to it first. Logs are attached.',
    ],
    date: at(3, 16, 44),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work'],
    attachments: [{ name: 'ci-logs.zip', size: '3.4 MB' }],
  },
  {
    id: 'MAIL-1011',
    from: {
      name: 'Louella Wise',
      email: 'louella.wise@company.com',
      avatar: 'images/photos/female-03.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Welcome pack for the new starters',
    body: [
      'Hi Brian,',
      'Two new engineers join your team on Monday. Their laptops are ready — could you make sure the repo access and onboarding docs are sorted before then?',
      'The welcome pack template is attached if you want to personalize it.',
    ],
    date: at(4, 11, 21),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work'],
    attachments: [{ name: 'welcome-pack.docx', size: '412 KB' }],
  },
  {
    id: 'MAIL-1012',
    from: {
      name: 'Dad',
      email: 'r.hughes@oldmail.com',
      avatar: 'images/photos/male-09.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Sunday dinner',
    body: [
      'Hi son,',
      'Your mother is making the roast on Sunday. Come around five if you can, and bring that fancy coffee you had last time.',
      'Dad',
    ],
    date: at(4, 19, 3),
    read: true,
    starred: true,
    folder: 'inbox',
    labels: ['personal'],
    attachments: [],
  },
  {
    id: 'MAIL-1013',
    from: {
      name: 'DevConf Europe',
      email: 'hello@devconf.eu',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'Your speaker proposal was accepted!',
    body: [
      'Dear Brian,',
      'Great news — your talk "Signals all the way down" has been accepted for DevConf Europe. The session is scheduled for the second day, right after the keynote.',
      'Please confirm your attendance by the end of the month so we can finalize the program.',
    ],
    date: at(5, 14, 37),
    read: true,
    starred: true,
    folder: 'inbox',
    labels: ['work'],
    attachments: [],
  },
  {
    id: 'MAIL-1014',
    from: {
      name: 'Josefina Lloyd',
      email: 'josefina.lloyd@company.com',
      avatar: 'images/photos/female-05.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Component library versioning proposal',
    body: [
      'Brian,',
      'Following up on our chat — I put together a short proposal for versioning the component library independently from the main app. It would let the design system move faster without blocking releases.',
      'It’s a one-pager, promise.',
    ],
    date: at(6, 10, 50),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work'],
    attachments: [{ name: 'versioning-proposal.pdf', size: '182 KB' }],
  },
  {
    id: 'MAIL-1015',
    from: {
      name: 'Streamly',
      email: 'no-reply@streamly.tv',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'New episodes you might like',
    body: [
      'Hi Brian,',
      'Three new shows landed this week that match your taste. Continue watching where you left off, or start something new tonight.',
    ],
    date: at(6, 20, 15),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: [],
    attachments: [],
  },

  {
    id: 'MAIL-1016',
    from: {
      name: 'Alvarado Turner',
      email: 'alvarado.turner@company.com',
      avatar: 'images/photos/male-05.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'API rate limiting rollout plan',
    body: [
      'Hi Brian,',
      'The rate limiting middleware is ready to go behind a feature flag. I’d like to roll it out to ten percent of traffic on Monday and watch the dashboards for a day before going wider.',
      'Shout if you see a problem with that timeline.',
    ],
    date: at(7, 9, 42),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work'],
    attachments: [],
  },
  {
    id: 'MAIL-1017',
    from: {
      name: 'Estelle Bass',
      email: 'estelle.bass@company.com',
      avatar: 'images/photos/female-02.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Customer feedback digest — week 32',
    body: [
      'Hi team,',
      'This week’s digest is attached. Standout theme: users love the new dashboard but keep asking for CSV export on the reports page.',
      'Full transcripts are in the research folder as usual.',
    ],
    date: at(7, 16, 18),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work'],
    attachments: [{ name: 'feedback-digest-w32.pdf', size: '524 KB' }],
  },
  {
    id: 'MAIL-1018',
    from: {
      name: 'Skyline Airways',
      email: 'bookings@skylineair.com',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'Your flight confirmation — BCN',
    body: [
      'Dear Brian Hughes,',
      'Your booking is confirmed. Outbound flight SA2214 departs at 07:40; please arrive at the airport at least two hours early.',
      'Your e-ticket and receipt are attached.',
    ],
    date: at(8, 6, 2),
    read: true,
    starred: true,
    folder: 'inbox',
    labels: ['travel'],
    attachments: [{ name: 'e-ticket.pdf', size: '138 KB' }],
  },
  {
    id: 'MAIL-1019',
    from: {
      name: 'Hotel Miramar',
      email: 'reservations@hotelmiramar.com',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'Reservation confirmed: 3 nights',
    body: [
      'Hello Brian,',
      'We confirm your reservation for three nights, sea-view room with breakfast included. Check-in from 14:00.',
      'We look forward to welcoming you!',
    ],
    date: at(8, 6, 25),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['travel'],
    attachments: [],
  },
  {
    id: 'MAIL-1020',
    from: {
      name: 'Josefina Lloyd',
      email: 'josefina.lloyd@company.com',
      avatar: 'images/photos/female-05.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Icon set license renewal',
    body: [
      'Brian,',
      'The icon set license expires at the end of the month. Renewal is $99 for the year — same as last time. OK to put it on the team card?',
    ],
    date: at(9, 11, 33),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work', 'invoices'],
    attachments: [],
  },
  {
    id: 'MAIL-1021',
    from: {
      name: 'Angular Weekly',
      email: 'newsletter@angularweekly.dev',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'Issue #412: Signal forms deep dive',
    body: [
      'This week: a deep dive into signal forms, a case study on zoneless change detection in production, and five libraries worth watching.',
    ],
    date: at(9, 7, 0),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: [],
    attachments: [],
  },
  {
    id: 'MAIL-1022',
    from: {
      name: 'Barrera Bradford',
      email: 'barrera.bradford@company.com',
      avatar: 'images/photos/male-06.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Team offsite: save the date',
    body: [
      'Hi all,',
      'The autumn offsite is booked for the third week of October — two days, same venue as last year. Agenda to follow, but expect a mix of planning sessions and actual fun.',
      'Save the date!',
    ],
    date: at(10, 14, 20),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work', 'events'],
    attachments: [],
  },
  {
    id: 'MAIL-1023',
    from: {
      name: 'Marjorie Poole',
      email: 'marjorie.poole@company.com',
      avatar: 'images/photos/female-06.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Accessibility audit results',
    body: [
      'Hi Brian,',
      'The audit came back better than expected — 14 issues total, only two of them serious. Both are contrast problems on the dashboard cards in dark mode.',
      'Full report attached with suggested fixes.',
    ],
    date: at(11, 10, 8),
    read: true,
    starred: true,
    folder: 'inbox',
    labels: ['work'],
    attachments: [{ name: 'a11y-audit.pdf', size: '867 KB' }],
  },
  {
    id: 'MAIL-1024',
    from: {
      name: 'Pixel & Pine Studio',
      email: 'studio@pixelandpine.co',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'Invoice #2214 — brand illustrations',
    body: [
      'Hi Brian,',
      'Please find attached the invoice for the second batch of brand illustrations. Payment terms are 14 days as agreed.',
      'It was a pleasure working with the team again.',
    ],
    date: at(12, 15, 40),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['invoices'],
    attachments: [{ name: 'invoice-2214.pdf', size: '112 KB' }],
  },
  {
    id: 'MAIL-1025',
    from: {
      name: 'Sarah',
      email: 'sarah.mail@gmail.com',
      avatar: 'images/photos/female-01.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Photos from the weekend',
    body: [
      'Finally went through the photos — some of them turned out really nice. The one from the viewpoint is definitely frame-worthy.',
      'Sending the full album link separately.',
    ],
    date: at(13, 19, 55),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['personal'],
    attachments: [
      { name: 'IMG_2041.jpg', size: '2.1 MB' },
      { name: 'IMG_2043.jpg', size: '1.8 MB' },
    ],
  },
  {
    id: 'MAIL-1026',
    from: {
      name: 'Wilder Gonzales',
      email: 'wilder.gonzales@company.com',
      avatar: 'images/photos/male-04.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'Re: Flaky e2e tests on the orders suite',
    body: [
      'Update: found it. The cart update fires a debounced request and the assertion ran before it settled. Fixed by waiting on the network idle signal instead of a timeout.',
      'Suite has been green for twelve runs straight.',
    ],
    date: at(13, 9, 14),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work'],
    attachments: [],
  },
  {
    id: 'MAIL-1027',
    from: {
      name: 'DevConf Europe',
      email: 'hello@devconf.eu',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'Speaker logistics and AV check',
    body: [
      'Dear Brian,',
      'A few logistics ahead of the conference: your AV check is scheduled thirty minutes before your slot, and slides are due to the organizers two days in advance.',
      'The speaker dinner is on the first evening — plus ones welcome.',
    ],
    date: at(14, 12, 26),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work', 'events', 'travel'],
    attachments: [],
  },
  {
    id: 'MAIL-1028',
    from: {
      name: 'Adeline Snider',
      email: 'adeline.snider@company.com',
      avatar: 'images/photos/female-04.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'New expense policy — short version',
    body: [
      'Hi all,',
      'The expense policy got a refresh. Short version: receipts required above $25, travel booked through the portal, and software subscriptions need a one-time approval instead of monthly ones.',
      'The full policy is on the intranet.',
    ],
    date: at(15, 9, 51),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work'],
    attachments: [],
  },
  {
    id: 'MAIL-1029',
    from: {
      name: 'Dad',
      email: 'r.hughes@oldmail.com',
      avatar: 'images/photos/male-09.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'The printer again',
    body: [
      'Brian,',
      'The printer is doing the thing again where it says offline but it is clearly on. Your mother says hello.',
      'No rush. Dad',
    ],
    date: at(16, 18, 5),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['personal'],
    attachments: [],
  },
  {
    id: 'MAIL-1030',
    from: {
      name: 'Estelle Bass',
      email: 'estelle.bass@company.com',
      avatar: 'images/photos/female-02.jpg',
    },
    to: 'hughes.brian@company.com',
    subject: 'User interview recordings ready',
    body: [
      'Hi Brian,',
      'All eight interview recordings from last week are uploaded and transcribed. The mailbox redesign feedback starts around minute twelve in most sessions.',
      'Highlights doc coming tomorrow.',
    ],
    date: at(17, 13, 47),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work'],
    attachments: [],
  },

  // Sent
  {
    id: 'MAIL-2001',
    from: {
      name: 'Brian Hughes',
      email: 'hughes.brian@company.com',
      avatar: 'images/photos/male-02.jpg',
    },
    to: 'dejesus.michael@company.com',
    subject: 'Re: Auth module migration is ready for review',
    body: [
      'Michael,',
      'Started the review — the functional guards look great. I left a couple of comments on the route structure, nothing blocking.',
      'Should be able to approve tomorrow morning.',
    ],
    date: at(0, 15, 22),
    read: true,
    starred: false,
    folder: 'sent',
    labels: ['work'],
    attachments: [],
  },
  {
    id: 'MAIL-2002',
    from: {
      name: 'Brian Hughes',
      email: 'hughes.brian@company.com',
      avatar: 'images/photos/male-02.jpg',
    },
    to: 'sarah.mail@gmail.com',
    subject: 'Re: Lunch on Friday?',
    body: [
      'Definitely in — book it!',
      'And glad you like the book. Wait until you get to the middle part.',
    ],
    date: at(1, 13, 30),
    read: true,
    starred: false,
    folder: 'sent',
    labels: ['personal'],
    attachments: [],
  },
  {
    id: 'MAIL-2003',
    from: {
      name: 'Brian Hughes',
      email: 'hughes.brian@company.com',
      avatar: 'images/photos/male-02.jpg',
    },
    to: 'hello@devconf.eu',
    subject: 'Re: Your speaker proposal was accepted!',
    body: [
      'Hello,',
      'Thrilled to hear it — I confirm my attendance. Looking forward to the slot after the keynote.',
      'Best,\nBrian',
    ],
    date: at(5, 9, 5),
    read: true,
    starred: false,
    folder: 'sent',
    labels: ['work'],
    attachments: [],
  },

  // Drafts
  {
    id: 'MAIL-3001',
    from: {
      name: 'Brian Hughes',
      email: 'hughes.brian@company.com',
      avatar: 'images/photos/male-02.jpg',
    },
    to: 'barrera.bradford@company.com',
    subject: 'Thoughts on the Q3 roadmap',
    body: [
      'Hi Bradford,',
      'A few thoughts on the draft — I think the reporting module is underscoped. If we include the export pipeline it’s closer to six weeks than four…',
    ],
    date: at(1, 18, 47),
    read: true,
    starred: false,
    folder: 'drafts',
    labels: ['work'],
    attachments: [],
  },
  {
    id: 'MAIL-3002',
    from: {
      name: 'Brian Hughes',
      email: 'hughes.brian@company.com',
      avatar: 'images/photos/male-02.jpg',
    },
    to: 'members@cityfitness.com',
    subject: 'Freeze request',
    body: [
      'Hi,',
      'I’d like to freeze my membership for two weeks in September while I’m traveling…',
    ],
    date: at(3, 21, 12),
    read: true,
    starred: false,
    folder: 'drafts',
    labels: ['personal'],
    attachments: [],
  },

  // Spam
  {
    id: 'MAIL-4001',
    from: {
      name: 'Prize Department',
      email: 'winner@luckydraw.example',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'You have been selected!!!',
    body: [
      'Congratulations! You have been selected to receive a brand new smartphone. Click the link below to claim your prize before it expires.',
    ],
    date: at(2, 4, 51),
    read: false,
    starred: false,
    folder: 'spam',
    labels: [],
    attachments: [],
  },
  {
    id: 'MAIL-4002',
    from: {
      name: 'Crypto Alerts',
      email: 'alerts@moonshot.example',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'This coin will 100x next week',
    body: [
      'Insiders are already buying. Don’t miss the opportunity of a lifetime — our analysts predict a 100x return within days.',
    ],
    date: at(5, 3, 33),
    read: true,
    starred: false,
    folder: 'spam',
    labels: [],
    attachments: [],
  },

  // Trash
  {
    id: 'MAIL-5001',
    from: {
      name: 'Streamly',
      email: 'no-reply@streamly.tv',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'We miss you! Here is 20% off',
    body: [
      'Come back and enjoy 20% off your first month. Your watchlist is waiting for you.',
    ],
    date: at(7, 12, 9),
    read: true,
    starred: false,
    folder: 'trash',
    labels: [],
    attachments: [],
  },
  {
    id: 'MAIL-5002',
    from: {
      name: 'Nordic Furniture',
      email: 'news@nordicfurniture.com',
      avatar: null,
    },
    to: 'hughes.brian@company.com',
    subject: 'Summer sale ends tonight',
    body: [
      'Last chance — up to 40% off selected items. The sale ends at midnight.',
    ],
    date: at(9, 8, 26),
    read: true,
    starred: false,
    folder: 'trash',
    labels: [],
    attachments: [],
  },
];

@Injectable({ providedIn: 'root' })
export class MailboxService {
  // State
  readonly mails = signal<Mail[]>(mails);
  readonly labels = LABELS;

  // Computed state
  readonly unreadCount = computed(
    () =>
      this.mails().filter((mail) => mail.folder === 'inbox' && !mail.read)
        .length
  );

  folderCount(folder: MailFolder): number {
    return this.mails().filter((mail) => mail.folder === folder).length;
  }

  label(id: string): MailLabel | undefined {
    return this.labels.find((label) => label.id === id);
  }

  toggleStar(id: string): void {
    this.mails.update((mails) =>
      mails.map((mail) =>
        mail.id === id ? { ...mail, starred: !mail.starred } : mail
      )
    );
  }

  markAsRead(id: string, read = true): void {
    this.mails.update((mails) =>
      mails.map((mail) => (mail.id === id ? { ...mail, read } : mail))
    );
  }

  moveToFolder(id: string, folder: MailFolder): void {
    this.mails.update((mails) =>
      mails.map((mail) => (mail.id === id ? { ...mail, folder } : mail))
    );
  }

  deleteMail(id: string): void {
    const mail = this.mails().find((mail) => mail.id === id);

    // Delete permanently if the mail is already in the trash,
    // otherwise move it to the trash
    if (mail?.folder === 'trash') {
      this.mails.update((mails) => mails.filter((mail) => mail.id !== id));
    } else {
      this.moveToFolder(id, 'trash');
    }
  }
}
