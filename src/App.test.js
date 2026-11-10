import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import fs from "fs";
import path from "path";
import App, { BOOKING_URL, bookingHref } from "./App";

const TITLE = "Lidonick - Your store's AI, set up the right way";

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, relativePath), "utf8");
}

test("presents one-time setup for a store's own AI, not a product for sale", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "You're only as good as your prompt.",
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("heading", {
      name: "Dealers are paying for software they could build themselves.",
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Dealer experience plus prompt expertise." })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "No subscriptions. No contracts. No SaaS." })
  ).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "How it works" })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Help for every seat in the store." })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "What a well-prompted agent can do." })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Find out what your AI can take off your plate." })
  ).toBeInTheDocument();

  [
    "Salespeople",
    "Sales managers",
    "General managers",
    "Service directors",
    "F&I and BDC",
    "One-time fee.",
    "You own it.",
    "Nothing to rip out.",
    "Less dependence on big software companies.",
    "Book a call.",
    "We map it out.",
    "We build it with you.",
    "You run it.",
  ].forEach((label) => {
    expect(screen.getByRole("heading", { name: label })).toBeInTheDocument();
  });

  expect(document.body).toHaveTextContent("We don't sell software.");
  expect(document.body).toHaveTextContent(
    "You pay once for the setup, not every month."
  );
  expect(document.body).toHaveTextContent(
    "The agents and workflows live in your own accounts, not ours."
  );
  expect(document.body).toHaveTextContent("Your DMS and CRM stay right where they are.");
  expect(document.body).toHaveTextContent(
    "Build a GM's morning brief from existing reports, CSVs, and forwarded emails."
  );
  expect(document.body).toHaveTextContent(
    "Watch the store's reviews on Google, Yelp, and other sites, and alert the right person when a really good or really bad one comes in."
  );
  expect(document.body).toHaveTextContent(
    "Lidonick · Dealer and prompt expertise. One-time setup, no subscriptions."
  );

  expect(document.body.textContent).not.toMatch(/request a demo/i);
  [
    ["The problem", "/the-problem-with-dealership-software"],
    ["What we do", "/ai-consulting-for-car-dealerships"],
    ["How it works", "/how-dealership-ai-setup-works"],
    ["Who we help", "/ai-for-dealership-staff"],
  ].forEach(([label, href]) => {
    screen.getAllByRole("link", { name: label }).forEach((link) => {
      expect(link).toHaveAttribute("href", href);
    });
  });
  expect(screen.getByRole("link", { name: "How it's different" })).toHaveAttribute("href", "#different");
  expect(screen.getAllByRole("link", { name: "Grok Bot for car dealerships" }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole("link", { name: "Grok Bot prompts for car dealerships" }).length).toBeGreaterThan(0);
  screen.getAllByRole("link", { name: "Grok Bot for car dealerships" }).forEach((link) => {
    expect(link).toHaveAttribute("href", "/grok-bot-for-car-dealerships");
  });
  screen.getAllByRole("link", { name: "Grok Bot prompts for car dealerships" }).forEach((link) => {
    expect(link).toHaveAttribute("href", "/grok-bot-prompts-for-car-dealerships");
  });
  expect(document.getElementById("book")).toBeInTheDocument();
  expect(document.body.textContent).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  expect(document.body.textContent).not.toMatch(/\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/);

  expect(BOOKING_URL).toBe("");
  const bookLinks = screen.getAllByRole("link", { name: /^book a call$/i });
  expect(bookLinks.length).toBeGreaterThan(2);
  bookLinks.forEach((link) => {
    expect(link).toHaveAttribute("href", "#book");
    expect(link).not.toHaveAttribute("target");
  });
});

test("submits the booking form and shows success or an inline error", async () => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ ok: true }),
  });
  global.fetch = fetchMock;

  render(<App />);
  const section = document.getElementById("book");
  expect(section).toContainElement(screen.getByLabelText(/^name$/i));

  fireEvent.click(screen.getByRole("button", { name: /^book a call$/i }));
  expect(screen.getByRole("alert")).toHaveTextContent(/add your name, and a phone or email/i);
  expect(fetchMock).not.toHaveBeenCalled();

  fireEvent.change(screen.getByLabelText(/^name$/i), {
    target: { value: "TEST - Lidonick site" },
  });
  fireEvent.click(screen.getByRole("button", { name: /^book a call$/i }));
  expect(screen.getByRole("alert")).toHaveTextContent(/add a phone or email/i);
  expect(fetchMock).not.toHaveBeenCalled();

  expect(screen.getByLabelText(/^phone$/i)).toHaveAttribute("type", "tel");
  expect(screen.getByLabelText(/^phone$/i)).toHaveAttribute("name", "phone");
  expect(screen.getByLabelText(/^email$/i)).toHaveAttribute("type", "email");
  expect(screen.getByLabelText(/^email$/i)).toHaveAttribute("name", "email");
  fireEvent.change(screen.getByLabelText(/^phone$/i), {
    target: { value: "555-010-0199" },
  });
  fireEvent.click(screen.getByRole("button", { name: /^book a call$/i }));
  expect(screen.getByRole("button", { name: /^book a call$/i })).toBeDisabled();

  expect(await screen.findByRole("status")).toHaveTextContent("Thanks, we'll be in touch soon.");
  expect(fetchMock).toHaveBeenCalledWith(
    "https://formspree.io/f/mpqbobry",
    expect.objectContaining({
      method: "POST",
      headers: expect.objectContaining({ Accept: "application/json" }),
    })
  );
  const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
  expect(payload._subject).toBe("New Lidonick call request");
  expect(payload._gotcha).toBe("");
  expect(payload.name).toBe("TEST - Lidonick site");
  expect(payload.phone).toBe("555-010-0199");
  expect(payload.email).toBeUndefined();

  cleanup();
  fetchMock.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
  render(<App />);
  fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: "Ada" } });
  fireEvent.change(screen.getByLabelText(/^email$/i), {
    target: { value: "ada@example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: /^book a call$/i }));
  expect(await screen.findByRole("alert")).toHaveTextContent(/something went wrong/i);

  delete global.fetch;
});

test("booking href stays empty-safe and uses a provided url", () => {
  expect(bookingHref("")).toBe("#book");
  expect(bookingHref("   ")).toBe("#book");
  expect(bookingHref("https://example.com/book")).toBe("https://example.com/book");
});

test("opens and closes the section menu", () => {
  render(<App />);
  const menu = screen.getByRole("button", { name: /menu/i });
  expect(menu).toHaveAttribute("aria-expanded", "false");

  fireEvent.click(menu);
  expect(menu).toHaveAttribute("aria-expanded", "true");

  const primary = screen.getByRole("navigation", { name: /primary/i });
  fireEvent.click(within(primary).getByRole("link", { name: /^what we do$/i }));
  expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("document title and descriptions use the approved line", () => {
  const html = read("../public/index.html");
  const manifest = JSON.parse(read("../public/manifest.json"));
  const appSource = read("App.js");

  expect(html.match(/<title>([^<]*)<\/title>/)[1]).toBe(TITLE);
  [
    'name="description"',
    'property="og:title"',
    'property="og:description"',
    'name="twitter:title"',
    'name="twitter:description"',
  ].forEach((attribute) => {
    expect(html).toContain(`<meta ${attribute} content="${TITLE}" />`);
  });

  expect(manifest.description).toBe(TITLE);
  expect(manifest.name).toBe("Lidonick");
  expect(appSource.match(/BOOKING_URL\s*=/g)).toHaveLength(1);

  const shipped = [
    html,
    JSON.stringify(manifest),
    appSource
      .replaceAll("/grok-bot-for-car-dealerships", "")
      .replaceAll("/grok-bot-prompts-for-car-dealerships", "")
      .replaceAll("Grok Bot for car dealerships", "")
      .replaceAll("Grok Bot prompts for car dealerships", ""),
    read("App.css"),
    read("index.js"),
    read("index.css"),
  ].join("\n");
  expect(shipped).not.toMatch(/grok/i);
  expect(html).toContain('rel="canonical" href="https://www.lidonick.com/"');
  expect(html).toContain('"@type": "Organization"');
  expect(shipped).not.toMatch(/request a demo/i);
  expect(shipped).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  expect(shipped).not.toMatch(/type="password"|password\s*[:=]/i);
});
