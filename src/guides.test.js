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
  const image = fs.readFileSync(path.join(ROOT, "public/og-image.png"));
  expect(image.subarray(0, 8).toString("latin1")).toBe("\u0089PNG\r\n\u001a\n");
  expect(image.readUInt32BE(16)).toBe(1200);
  expect(image.readUInt32BE(20)).toBe(630);

  const pages = [
    "public/index.html",
    ...PAGES.map((page) => page.file),
    ...NAV_PAGES.map((page) => page.file),
    "public/ai-for-bdc-follow-up/index.html",
    "public/cut-dealership-software-costs/index.html",
    "public/ai-for-service-advisors/index.html",
    "public/ai-for-f-and-i-managers/index.html",
  ];
  const alt = "Lidonick - Your store's AI, set up the right way";
  pages.forEach((file) => {
    const html = read(file);
    expect(html).toContain('property="og:image" content="https://www.lidonick.com/og-image.png"');
    expect(html).toContain('property="og:image:width" content="1200"');
    expect(html).toContain('property="og:image:height" content="630"');
    expect(html).toContain(`property="og:image:alt" content="${alt}"`);
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain('name="twitter:image" content="https://www.lidonick.com/og-image.png"');
    expect(html).not.toContain('content="summary"');
    const title = html.match(/<title>([^<]*)<\/title>/)[1].replaceAll("&amp;", "&");
    expect(title).not.toMatch(/Your store$/);
    expect(html).toContain('property="og:title"');
    expect(html).toContain('property="og:description"');
    expect(html).toContain('property="og:url"');
    expect(html).toContain('name="twitter:title"');
    expect(html).toContain('name="twitter:description"');
  });

  const retired = [
    "#f3f0e8",
    "#fffcf7",
    "#f6f3ec",
    "#e8e1d4",
    "#ddd4c4",
    "#d9d3c8",
    "#1e3d34",
    "#16312a",
    "#7a2e24",
    "#e4ece8",
    "#1c1915",
    "#4a453e",
  ];
  const styled = [
    "src/index.css",
    "src/App.css",
    "public/guide.css",
    "public/manifest.json",
    "public/favicon.svg",
    ...pages,
  ].map((file) => read(file).toLowerCase());
  retired.forEach((color) => {
    styled.forEach((source) => {
      expect(source).not.toContain(color);
    });
  });
  styled.forEach((source) => {
    expect(source).not.toMatch(/--green\b|--cream\b/);
  });

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

test("the four new guide pages are listed and keep the booking form markup", () => {
  const pages = [
    ["public/ai-for-bdc-follow-up/index.html", "/ai-for-bdc-follow-up", "AI for BDC Follow-Up at Car Dealerships | Lidonick", "AI for Dealership BDC Follow-Up"],
    ["public/cut-dealership-software-costs/index.html", "/cut-dealership-software-costs", "How Car Dealerships Can Cut Software Costs with AI | Lidonick", "How to Cut Dealership Software Costs"],
    ["public/ai-for-service-advisors/index.html", "/ai-for-service-advisors", "AI for Dealership Service Advisors | Lidonick", "AI for Service Advisors"],
    ["public/ai-for-f-and-i-managers/index.html", "/ai-for-f-and-i-managers", "AI for Dealership F&I Managers | Lidonick", "AI for F&I Managers"],
  ];
  const sitemap = read("public/sitemap.xml");
  const llms = read("public/llms.txt");
  expect(read("public/book-form.js")).toContain("https://formspree.io/f/mpqbobry");
  pages.forEach(([file, pathName, title, h1]) => {
    const html = read(file);
    const description = html.match(/name="description" content="([^"]*)"/)[1].replaceAll("&amp;", "&");
    expect(html.match(/<title>([^<]*)<\/title>/)[1].replaceAll("&amp;", "&")).toBe(title);
    expect(html).toContain(`<h1>${h1.replaceAll("&", "&amp;")}</h1>`);
    expect(description.length).toBeLessThan(160);
    expect(html).toContain(`rel="canonical" href="https://www.lidonick.com${pathName}"`);
    expect(html).toContain('src="/book-form.js"');
    expect(html).toContain('name="name"');
    expect(html).toContain('name="phone"');
    expect(html).toContain('name="email"');
    expect(html).not.toContain('name="notes"');
    expect(html).not.toMatch(/Nick Jason/);
    expect(sitemap).toContain(`<loc>https://www.lidonick.com${pathName}</loc>\n    <lastmod>2026-11-17</lastmod>`);
    expect(llms).toContain(`https://www.lidonick.com${pathName}`);
  });
});

test("the four new guide pages are listed and keep the booking form markup", () => {
  const pages = [
    ["public/ai-for-bdc-follow-up/index.html", "/ai-for-bdc-follow-up", "AI for BDC Follow-Up at Car Dealerships | Lidonick", "AI for Dealership BDC Follow-Up"],
    ["public/cut-dealership-software-costs/index.html", "/cut-dealership-software-costs", "How Car Dealerships Can Cut Software Costs with AI | Lidonick", "How to Cut Dealership Software Costs"],
    ["public/ai-for-service-advisors/index.html", "/ai-for-service-advisors", "AI for Dealership Service Advisors | Lidonick", "AI for Service Advisors"],
    ["public/ai-for-f-and-i-managers/index.html", "/ai-for-f-and-i-managers", "AI for Dealership F&I Managers | Lidonick", "AI for F&I Managers"],
  ];
  const sitemap = read("public/sitemap.xml");
  const llms = read("public/llms.txt");
  expect(read("public/book-form.js")).toContain("https://formspree.io/f/mpqbobry");
  pages.forEach(([file, pathName, title, h1]) => {
    const html = read(file);
    const description = html.match(/name="description" content="([^"]*)"/)[1].replaceAll("&amp;", "&");
    expect(html.match(/<title>([^<]*)<\/title>/)[1].replaceAll("&amp;", "&")).toBe(title);
    expect(html).toContain(`<h1>${h1.replaceAll("&", "&amp;")}</h1>`);
    expect(description.length).toBeLessThan(160);
    expect(html).toContain(`rel="canonical" href="https://www.lidonick.com${pathName}"`);
    expect(html).toContain('src="/book-form.js"');
    expect(html).toContain('name="name"');
    expect(html).toContain('name="phone"');
    expect(html).toContain('name="email"');
    expect(html).not.toContain('name="notes"');
    expect(html).not.toMatch(/Nick Jason/);
    expect(sitemap).toContain(`<loc>https://www.lidonick.com${pathName}</loc>\n    <lastmod>2026-11-17</lastmod>`);
    expect(llms).toContain(`https://www.lidonick.com${pathName}`);
  });
});
