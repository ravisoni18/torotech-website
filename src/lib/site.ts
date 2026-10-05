export const SITE = {
  name: "Torotech",
  domain: "torotech.ca",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://torotech.ca",
  description:
    "Torotech is a Kitchener, Ontario software company building SAP BTP and Fiori apps, AI agents on live SAP data, websites, mobile apps, BI dashboards, test automation and n8n workflows.",
  title: "Torotech — SAP BTP, Fiori & AI software development in Kitchener, Ontario",
  legalName: "Torotech Inc.",
  founder: "Ravi Soni",
  email: "hello@torotech.ca",
  // Shown on /contact. Add more mailboxes here once they exist on the mail server.
  emails: [{ label: "New projects & general", address: "hello@torotech.ca" }],
  phone: "+1 613 716 1135",
  phoneHref: "tel:+16137161135",
  location: "Kitchener, Ontario, Canada",
  address: { locality: "Kitchener", region: "ON", country: "CA" },
  linkedin: "https://www.linkedin.com/company/torotech",
  github: "https://github.com/ravisoni18",
};

export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/work", label: "Work" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About" },
];
