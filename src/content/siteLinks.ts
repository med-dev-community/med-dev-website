// The WhatsApp invite is deliberately absent here. It lives encoded in
// joinLink.ts so that it never ships as a literal; see AGENTS.md.
export const siteLinks = {
  // Shown only inside <noscript>: with scripting off the join dialog cannot
  // open, and this page carries both the rules and the invite.
  notionWelcome:
    "https://rinser.notion.site/Welcome-to-med-dev-0d12fa3fd064468ea763648c007c94c5?pvs=25",
  // Also the source of the calendar id for scripts/fetch-events.mjs.
  lumaCalendar: "https://luma.com/calendar/cal-nnnWP4EgPS4aDiE",
  lumaCalendarEmbed: "https://luma.com/embed/calendar/cal-nnnWP4EgPS4aDiE/events",
  lumaProfile: "https://luma.com/user/med_dev",
  newsletterArchive: "https://meddev.substack.com",
  linkedIn: "https://www.linkedin.com/company/med-dev/posts/?feedView=all",
  contactEmail: "med.dev.community@gmail.com",
  contactForm: "https://forms.gle/HQZsMscxW9Crd9Wk9",
};
