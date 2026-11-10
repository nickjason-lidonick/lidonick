import fs from "fs";
import path from "path";

const ROOT = path.join(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function jsonLd(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (match) => JSON.parse(match[1])
  );
  const graph = blocks.flatMap((block) => block["@graph"] || [block]);
  return graph;
}

const PAGES = [
  {
    file: "public/grok-bot-for-car-dealerships/index.html",
    path: "/grok-bot-for-car-dealerships",
    title: "Grok Bot for Car Dealerships | Lidonick",
    description:
      "A role-by-role look at Grok Bot in a car dealership, from the GM to sales, service, F&I, and the BDC. Then book a call to set it up in your store.",
    h1: "How every role in the store can use Grok Bot",
    questions: [
      "What is Grok Bot?",
      "Can Grok Bot work with my DMS or CRM?",
      "Will an AI agent text or email my customers on its own?",
      "Is it safe to give an AI agent access to dealership data?",
      "Which roles at a dealership benefit most?",
      "Does Lidonick sell Grok Bot or any AI software?",
      "How do I get started?",
    ],
  },
  {
    file: "public/grok-bot-prompts-for-car-dealerships/index.html",
    path: "/grok-bot-prompts-for-car-dealerships",
    title: "Grok Bot Prompts for Sales, Service, and F&I | Lidonick",
    description:
      "Ready-to-use Grok Bot prompts for dealership sales, service, F&I, GMs, and BDC teams, plus the formula behind a prompt that actually works.",
    h1: "Copy-ready prompts for the dealership floor",
    questions: [
      "Do these prompts only work in Grok Bot?",
      "How long should a dealership AI prompt be?",
      "How do I stop an agent from messaging customers?",
      "Can I schedule a prompt to run every morning?",
      "What data should I keep out of a prompt?",
      "Can Lidonick write prompts for my dealership?",
    ],
  },
];

const NAV_PAGES = [
  {
    file: "public/the-problem-with-dealership-software/index.html",
    path: "/the-problem-with-dealership-software",
    title: "Dealers Are Paying for Software They Could Build Themselves | Lidonick",
    description:
      "Dealerships keep adding subscriptions and long contracts for tools that only do part of the job. Today's AI can do more of that work when it's set up the right way.",
    h1: "Dealers Are Paying for Software They Could Build Themselves",
    questions: [
      "Why are dealership software costs so high?",
      "Can AI really replace some dealership software?",
      "Does Lidonick sell dealership software?",
      "Will I have to sign a contract?",
      "Where should a dealer start to reduce software spend?",
    ],
  },
  {
    file: "public/ai-consulting-for-car-dealerships/index.html",
    path: "/ai-consulting-for-car-dealerships",
    title: "AI Consulting for Car Dealerships, No Subscription | Lidonick",
    description:
      "Lidonick is AI consulting for car dealerships: a one-time fee to help your staff set up their own AI agents and workflows. No SaaS, no long-term contract.",
    h1: "Dealer experience. Prompt expertise. One-time setup.",
    questions: [
      "What does an AI consultant for car dealerships do?",
      "Do you sell AI software or an AI platform?",
      "Which AI tools do you work with?",
      "Will the AI replace my DMS or CRM?",
      "Who owns the agents after setup?",
      "How is this different from an AI BDC or other dealership AI vendors?",
    ],
  },
  {
    file: "public/how-dealership-ai-setup-works/index.html",
    path: "/how-dealership-ai-setup-works",
    title: "How Dealership AI Setup Works | Lidonick",
    description:
      "Book a call, map the work, build your dealership's AI agents with you, then hand it over. One-time fee, no subscriptions, nothing to rip out of your DMS or CRM.",
    h1: "Four steps, then it's yours",
    questions: [
      "How do I set up AI agents at my dealership?",
      "Do we need to change our DMS or CRM?",
      "Is there an ongoing fee?",
      "Will the AI contact customers on its own?",
      "What happens after setup?",
    ],
  },
  {
    file: "public/ai-for-dealership-staff/index.html",
    path: "/ai-for-dealership-staff",
    title: "AI for Every Role in the Dealership | Lidonick",
    description:
      "AI agents for dealership GMs, sales, service, F&I, and BDC teams, set up in the tools you already use. One fee, no subscription.",
    h1: "From the GM to the BDC",
    questions: [
      "Which dealership roles can use AI agents?",
      "Can a single salesperson work with Lidonick, or only the whole store?",
      "Do you work with independent and used car dealerships?",
      "How can AI help a dealership service department?",
      "Is AI safe for F&I?",
    ],
  },
];

test("sitemap, robots, and llms.txt list the public pages", () => {
  const sitemap = read("public/sitemap.xml");
  const robots = read("public/robots.txt");
  const llms = read("public/llms.txt");
  const config = JSON.parse(read("vercel.json"));

  expect(robots).toContain("Sitemap: https://www.lidonick.com/sitemap.xml");
  [
    "https://www.lidonick.com/",
    ...PAGES.map((page) => `https://www.lidonick.com${page.path}`),
    ...NAV_PAGES.map((page) => `https://www.lidonick.com${page.path}`),
  ].forEach((url) => {
    expect(sitemap).toContain(`<loc>${url}</loc>`);
    expect(llms).toContain(url);
  });
  expect(llms).toContain("Contact: book a call at https://www.lidonick.com/#book.");
  expect(llms).not.toMatch(/Nick Jason/);
  expect(llms).not.toMatch(/Founded by/);
  expect(config.cleanUrls).toBe(true);
  expect(config.trailingSlash).toBe(false);
  expect(JSON.stringify(config.rewrites || [])).not.toContain("/index.html");
});

test.each(PAGES)("$path is crawlable HTML with schema", (page) => {
  const html = read(page.file);
  const flat = html.replace(/\s+/g, " ");
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1");
  const graph = jsonLd(html);
  const canonical = `https://www.lidonick.com${page.path}`;

  const encoded = (value) => value.replaceAll("&", "&amp;");
  expect(html.match(/<title>([^<]*)<\/title>/)[1]).toBe(encoded(page.title));
  expect(flat).toContain(`name="description" content="${encoded(page.description)}"`);
  expect(html).toContain(`rel="canonical" href="${canonical}"`);
  expect(html).toContain(`property="og:title" content="${encoded(page.title)}"`);
  expect(html).toContain(`property="og:url" content="${canonical}"`);
  expect(html).toContain(`name="twitter:title" content="${encoded(page.title)}"`);
  expect(html).toMatch(new RegExp(`<h1[^>]*>${page.h1}</h1>`));
  expect(html).toContain('src="/book-form.js"');
  expect(html).toContain('name="phone"');
  expect(html).toContain('name="email"');
  expect(html).not.toContain('name="notes"');
  expect(text).not.toMatch(/lorem ipsum/i);
  expect(html).toContain('href="/#book"');
  expect(html).toContain('href="/"');
  expect(html).toContain('href="/grok-bot-for-car-dealerships"');
  expect(html).toContain('href="/grok-bot-prompts-for-car-dealerships"');

  const article = graph.find((node) => node["@type"] === "Article");
  const faq = graph.find((node) => node["@type"] === "FAQPage");
  const crumbs = graph.find((node) => node["@type"] === "BreadcrumbList");

  expect(article.headline).toBe(page.h1);
  expect(article.datePublished).toBe("2026-11-10");
  expect(article.author).toBeUndefined();
  expect(article.publisher.name).toBe("Lidonick");
  expect(html).not.toMatch(/Nick Jason/);
  expect(faq.mainEntity.map((item) => item.name)).toEqual(page.questions);
  faq.mainEntity.forEach((item) => {
    expect(text).toContain(item.name);
    expect(text).toContain(item.acceptedAnswer.text);
  });
  expect(crumbs.itemListElement.map((item) => item.position)).toEqual([1, 2]);
  expect(crumbs.itemListElement[0].item).toBe("https://www.lidonick.com/");
  expect(crumbs.itemListElement[1].item).toBe(canonical);
});

test.each(NAV_PAGES)("$path is crawlable HTML with schema", (page) => {
  const html = read(page.file);
  const flat = html.replace(/\s+/g, " ");
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1");
  const graph = jsonLd(html);
  const canonical = `https://www.lidonick.com${page.path}`;

  const encoded = (value) => value.replaceAll("&", "&amp;");
  expect(html.match(/<title>([^<]*)<\/title>/)[1]).toBe(encoded(page.title));
  expect(flat).toContain(`name="description" content="${encoded(page.description)}"`);
  expect(html).toContain(`rel="canonical" href="${canonical}"`);
  expect(html).toContain(`property="og:title" content="${encoded(page.title)}"`);
  expect(html).toContain(`property="og:url" content="${canonical}"`);
  expect(html).toContain(`name="twitter:title" content="${encoded(page.title)}"`);
  expect(html).toMatch(new RegExp(`<h1[^>]*>${page.h1}</h1>`));
  expect(html).toContain('src="/book-form.js"');
  expect(html).toContain('name="phone"');
  expect(html).toContain('name="email"');
  expect(html).not.toContain('name="notes"');
  expect(text).not.toMatch(/lorem ipsum/i);
  expect(html).not.toMatch(/Nick Jason/);
  expect(html).toContain('href="/#book"');
  expect(html).toContain('href="/the-problem-with-dealership-software"');
  expect(html).toContain('href="/ai-consulting-for-car-dealerships"');
  expect(html).toContain('href="/how-dealership-ai-setup-works"');
  expect(html).toContain('href="/ai-for-dealership-staff"');

  const webPage = graph.find((node) => node["@type"] === "WebPage");
  const faq = graph.find((node) => node["@type"] === "FAQPage");
  const crumbs = graph.find((node) => node["@type"] === "BreadcrumbList");

  expect(webPage.name).toBe(page.h1);
  expect(webPage.url).toBe(canonical);
  expect(webPage.isPartOf.name).toBe("Lidonick");
  expect(JSON.stringify(graph)).not.toMatch(/"@type":"Person"|"founder"/);
  expect(faq.mainEntity.map((item) => item.name)).toEqual(page.questions);
  faq.mainEntity.forEach((item) => {
    expect(text).toContain(item.name);
    expect(text).toContain(item.acceptedAnswer.text);
  });
  expect(crumbs.itemListElement[1].item).toBe(canonical);
});
