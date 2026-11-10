import { useEffect, useState } from "react";
import "./App.css";

// Destination for every "Book a call" control.
// Leave this empty until a real booking link is provided.
// An empty value scrolls those controls to the closing section.
export const BOOKING_URL = "";

const CLOSING_ID = "book";

export function bookingHref(url = BOOKING_URL) {
  const value = typeof url === "string" ? url.trim() : "";
  return value || `#${CLOSING_ID}`;
}

const NAV = [
  { href: "/the-problem-with-dealership-software", label: "The problem" },
  { href: "/ai-consulting-for-car-dealerships", label: "What we do" },
  { href: "/how-dealership-ai-setup-works", label: "How it works" },
  { href: "/ai-for-dealership-staff", label: "Who we help" },
];

const FOOTER_NAV = [
  ...NAV,
  { href: "#different", label: "How it's different" },
  { href: "#examples", label: "Examples" },
];

const GUIDES = [
  {
    href: "/grok-bot-for-car-dealerships",
    label: "Grok Bot for car dealerships",
  },
  {
    href: "/grok-bot-prompts-for-car-dealerships",
    label: "Grok Bot prompts for car dealerships",
  },
];

const DIFFERENCES = [
  {
    label: "One-time fee.",
    text: "You pay once for the setup, not every month.",
  },
  {
    label: "You own it.",
    text: "The agents and workflows live in your own accounts, not ours.",
  },
  {
    label: "Nothing to rip out.",
    text: "Your DMS and CRM stay right where they are.",
  },
  {
    label: "Less dependence on big software companies.",
    text: "You stop renting tools for work your own AI can do.",
  },
];

const STEPS = [
  {
    label: "Book a call.",
    text: "Tell us your role and what's eating your day.",
  },
  {
    label: "We map it out.",
    text: "We look at the reports, the inbox, the follow-ups, and the repetitive work, then pick what AI should handle first.",
  },
  {
    label: "We build it with you.",
    text: "We write the prompts and set up the agents and workflows in your own AI tools.",
  },
  {
    label: "You run it.",
    text: "We show you how it works so your team can use it and adjust it on their own.",
  },
];

const ROLES = [
  {
    label: "Salespeople",
    text: "Stay on top of follow-ups, draft texts and emails faster, prep before a customer walks in, and keep your pipeline organized.",
  },
  {
    label: "Sales managers",
    text: "See how each person is pacing against goal and get the numbers you need without building the report yourself.",
  },
  {
    label: "General managers",
    text: "Start each morning with a brief on units, pace against manufacturer objectives and selling days, salesperson performance, the service drive, and anything that needs your attention.",
  },
  {
    label: "Service directors",
    text: "Keep an eye on reviews and customer complaints, catch problems on the drive sooner, and cut down on daily reporting and email.",
  },
  {
    label: "F&I and BDC",
    text: "Speed up the prep, paperwork and follow-up that keep you from your next customer.",
  },
];

const EXAMPLES = [
  "Build a GM's morning brief from existing reports, CSVs, and forwarded emails.",
  "Watch the store's reviews on Google, Yelp, and other sites, and alert the right person when a really good or really bad one comes in.",
  "Monitor an inbox for customer complaints and flag them before they grow.",
  "Answer questions on demand about pace, people, and performance.",
];

function BookCall({ className, onClick }) {
  const href = bookingHref();
  const external = /^https?:\/\//i.test(href);

  return (
    <a
      className={className}
      href={href}
      onClick={onClick}
      {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
    >
      Book a call
    </a>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) {
        return;
      }
      document.getElementById(id)?.scrollIntoView();
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site" id="top">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="header">
        <div className="header-inner">
          <a className="logo" href="#top" onClick={closeMenu}>
            <img src={`${process.env.PUBLIC_URL}/favicon.svg`} alt="" width="28" height="28" />
            Lidonick
          </a>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          <nav id="site-nav" className={menuOpen ? "nav open" : "nav"} aria-label="Primary">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
            <details className="guides-menu">
              <summary>Guides</summary>
              <div className="guides-panel">
                {GUIDES.map((guide) => (
                  <a key={guide.href} href={guide.href} onClick={closeMenu}>
                    {guide.label}
                  </a>
                ))}
              </div>
            </details>
            <BookCall className="button nav-cta" onClick={closeMenu} />
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero-wrap" aria-labelledby="hero-title">
          <div className="wrap hero">
            <div className="hero-copy">
              <h1 id="hero-title">You're only as good as your prompt.</h1>
              <p className="lead">
                Lidonick helps dealership teams set up their own AI agents and workflows, the
                right way, one time. We don't sell software. We bring the dealer knowledge and
                the prompt expertise so the AI you already have access to actually works for your
                store.
              </p>
              <div className="actions">
                <BookCall className="button" />
              </div>
            </div>

            <figure className="brief">
              <figcaption className="brief-top">
                <span>What a well-prompted agent can do.</span>
              </figcaption>
              <ul className="preview-list">
                {EXAMPLES.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </figure>
          </div>
        </section>

        <section id="problem" className="section" aria-labelledby="problem-title">
          <div className="wrap split">
            <div>
              <p className="kicker">The problem</p>
              <h2 id="problem-title">Dealers are paying for software they could build themselves.</h2>
            </div>
            <p>
              Every year brings another subscription, another long-term contract, and another
              tool that only does part of the job. Meanwhile, today's AI assistants can already
              handle much of that work, as long as they're set up with the right instructions.
              Most stores just don't have the time or the know-how to do it.
            </p>
          </div>
        </section>

        <section id="what" className="section tone-band" aria-labelledby="what-title">
          <div className="wrap split">
            <div>
              <p className="kicker">What we do</p>
              <h2 id="what-title">Dealer experience plus prompt expertise.</h2>
            </div>
            <p>
              We know how a dealership runs, and we know how to talk to AI. We sit down with your
              people, learn where their time goes, and build agents and agentic workflows in your
              own AI tools to take that work off their plate. When we're done, everything belongs
              to you.
            </p>
          </div>
        </section>

        <section id="different" className="section" aria-labelledby="different-title">
          <div className="wrap">
            <div className="section-head">
              <p className="kicker">How it's different</p>
              <h2 id="different-title">No subscriptions. No contracts. No SaaS.</h2>
            </div>
            <div className="cards">
              {DIFFERENCES.map((item, index) => (
                <article key={item.label} className="card">
                  <span className="card-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{item.label}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="section tone-band" aria-labelledby="how-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="how-title">How it works</h2>
            </div>
            <ol className="steps">
              {STEPS.map((step, index) => (
                <li key={step.label}>
                  <span className="step-num">{index + 1}</span>
                  <div>
                    <h3>{step.label}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="who" className="section" aria-labelledby="who-title">
          <div className="wrap">
            <div className="section-head">
              <p className="kicker">Who we help</p>
              <h2 id="who-title">Help for every seat in the store.</h2>
            </div>
            <div className="role-sheet">
              {ROLES.map((role) => (
                <article key={role.label} className="role">
                  <h3>{role.label}</h3>
                  <p>{role.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="examples" className="section tone-band" aria-labelledby="examples-title">
          <div className="wrap">
            <div className="section-head">
              <p className="kicker">Examples</p>
              <h2 id="examples-title">What a well-prompted agent can do.</h2>
            </div>
            <ul className="statements">
              {EXAMPLES.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id={CLOSING_ID} className="section tone-demo" aria-labelledby="closing-title">
          <div className="wrap closing">
            <div>
              <h2 id="closing-title">Find out what your AI can take off your plate.</h2>
              <p>
                Book a call. Tell us about your role, and we'll show you what's possible with
                tools you already have.
              </p>
            </div>
            <BookCall className="button" />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <p className="footer-line">
            Lidonick · Dealer and prompt expertise. One-time setup, no subscriptions.
          </p>
          <nav aria-label="Footer">
            {FOOTER_NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <BookCall />
          </nav>
          <nav aria-label="Guides">
            <p className="footer-label">Guides</p>
            {GUIDES.map((guide) => (
              <a key={guide.href} href={guide.href}>
                {guide.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
