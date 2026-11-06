import { useEffect, useState } from "react";
import "./App.css";

const NAV = [
  { href: "#who", label: "Who it's for" },
  { href: "#brief", label: "The brief" },
  { href: "#pace", label: "Pace" },
  { href: "#setup", label: "Setup" },
];

const BRIEF_PREVIEW = [
  ["Units and pace", "This month's objective against selling days elapsed."],
  ["Salespeople", "Who is ahead of pace, and who is behind."],
  ["Service drive", "How the drive is performing this morning."],
  ["Exceptions", "What needs a manager before the day moves on."],
];

const BRIEF_PARTS = [
  {
    title: "Units and pace",
    text: "Lidonick checks where the store stands against this month's manufacturer objectives, using the selling days already used, not only the unit count.",
  },
  {
    title: "Salesperson performance",
    text: "Lidonick finds who on the floor is ahead of pace and who is behind, so the sales meeting starts with the people who need attention.",
  },
  {
    title: "Service drive",
    text: "Lidonick reads how the drive is performing and puts it in the same brief as sales, so the morning does not depend on a separate report.",
  },
  {
    title: "Exceptions",
    text: "Lidonick surfaces what does not fit the plan and needs a manager today: a pace miss, someone far off their number, or a problem on the drive.",
  },
];

const SOURCES = [
  {
    title: "CSV exports",
    text: "Files the store's systems already allow someone to download.",
  },
  {
    title: "Forwarded emails",
    text: "The messages managers already pass around when they share the numbers.",
  },
  {
    title: "Existing reports",
    text: "Reports the store already runs. Lidonick uses them to do the compiling.",
  },
];

const STEPS = [
  {
    title: "Send what you already have",
    text: "CSV exports, forwarded emails, and the reports used to run the month. The store keeps its system of record.",
  },
  {
    title: "Set the month",
    text: "Manufacturer objectives and the selling days on the calendar. Lidonick checks pace from those as the days pass.",
  },
  {
    title: "Take the morning, then ask",
    text: "The general manager and the sales manager get the morning email or brief, with the compiling already done. Through the day they can ask the assistant to take the next task.",
  },
];

const QUESTIONS = [
  "Who fell off pace over the last few selling days?",
  "Which exceptions from yesterday are still open?",
  "Is the service drive ahead or behind for the month?",
  "Which salespeople are ahead of their own pace?",
  "Did a really good or really bad review come in?",
  "Is there a complaint in the inbox that needs a manager?",
];

const WATCH = [
  {
    title: "Reviews",
    text: "Grok Bot keeps an eye on the store's reviews on Google, Yelp, and similar sites. When a review is really good or really bad, it notifies the general manager.",
  },
  {
    title: "Inbox",
    text: "It monitors inboxes for email complaints and similar issues that need a manager, and brings those forward instead of leaving them to be found later.",
  },
];

const DEMO_POINTS = [
  "How the store tracks manufacturer objectives and selling days today",
  "The compiling the general manager and the sales manager still do by hand",
  "Which reviews and inbox issues should notify a manager",
  "Which exports, emails, and reports would feed the assistant",
  "What setup takes, and which extra reporting steps that work would replace",
];

function SellingDayDiagram() {
  const elapsed = 9;
  const remaining = 8;

  return (
    <figure className="pace-figure">
      <figcaption>
        A diagram of a selling-day calendar, not a store's results. The month's
        objective is spread across the days. Each morning, units delivered are
        compared with the days already used.
      </figcaption>
      <div className="day-track" aria-hidden="true">
        {Array.from({ length: elapsed }, (_, index) => (
          <span key={`elapsed-${index}`} className="day elapsed" />
        ))}
        <span className="day today" />
        {Array.from({ length: remaining }, (_, index) => (
          <span key={`remaining-${index}`} className="day remaining" />
        ))}
      </div>
      <ul className="legend">
        <li>
          <span className="swatch elapsed" aria-hidden="true" />
          Selling days elapsed
        </li>
        <li>
          <span className="swatch today" aria-hidden="true" />
          Today
        </li>
        <li>
          <span className="swatch remaining" aria-hidden="true" />
          Selling days left
        </li>
      </ul>
    </figure>
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
            <a className="button nav-cta" href="#demo" onClick={closeMenu}>
              Request a demo
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero-wrap" aria-labelledby="hero-title">
          <div className="wrap hero">
            <div className="hero-copy">
              <p className="eyebrow">Grok Bot for the dealership · Internal to the store</p>
              <h1 id="hero-title">Time back for the people who run the store.</h1>
              <p className="lead">
                Lidonick integrates Grok Bot into the dealership. It is an agentic
                assistant for general managers and sales managers: it does the work,
                rather than leaving them a dashboard to interpret. It takes on the
                tasks that consume the day without being the job. Assembling the
                numbers, chasing which salesperson is behind, piecing reports
                together, checking pace against selling days, watching reviews, and
                flagging complaints. The time goes back to running the store.
              </p>
              <p className="note">
                Each morning that work arrives as an email or brief they can act on:
                units and pace, salesperson performance, the service drive, and the
                exceptions that need attention. It is not a chatbot for shoppers. Setup
                stays light. Lidonick works from the CSV exports, forwarded emails, and
                reports the store already produces.
              </p>
              <div className="actions">
                <a className="button" href="#demo">
                  Request a demo
                </a>
                <a className="button secondary" href="#brief">
                  See the brief
                </a>
              </div>
            </div>

            <figure className="brief">
              <figcaption className="brief-top">
                <span>Morning brief</span>
                <span>Example</span>
              </figcaption>
              <p className="brief-meta">For the general manager and the sales manager</p>
              <dl>
                {BRIEF_PREVIEW.map(([title, text]) => (
                  <div key={title} className="brief-row">
                    <dt>{title}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
              <p className="brief-note">
                An example of the morning brief. Lidonick fills it in from your store's reports.
              </p>
            </figure>
          </div>
        </section>

        <section id="who" className="section" aria-labelledby="who-title">
          <div className="wrap">
            <div className="section-head">
              <p className="kicker">Who it's for</p>
              <h2 id="who-title">The general manager and the sales manager.</h2>
              <p className="intro">
                Built for the people accountable for the month. Lidonick takes the
                compiling so they can run the store. Customers never see it.
              </p>
            </div>
            <div className="cards">
              <article className="card">
                <h3>General managers</h3>
                <p>
                  You own the month. Grok Bot assembles units against the manufacturer
                  objective, checks the pace the selling days require, reads the service
                  drive, and surfaces the exceptions that cannot wait. It also tells you
                  when a review or an inbox complaint needs you. You start the day
                  running the store.
                </p>
              </article>
              <article className="card">
                <h3>Sales managers</h3>
                <p>
                  You own the floor. Lidonick finds who is ahead, who is behind, and
                  which exceptions belong in the meeting. The files are already worked,
                  so you can coach.
                </p>
              </article>
            </div>
            <aside className="callout">
              <h3>Not a shopper chatbot</h3>
              <p>
                Lidonick stays inside the store. It does not sit on the website and it
                does not talk to customers. It is a plug-and-play assistant for
                managers, set up from reports the store already has, without a long
                installation.
              </p>
            </aside>
          </div>
        </section>

        <section id="brief" className="section tone-band" aria-labelledby="brief-title">
          <div className="wrap">
            <div className="section-head">
              <p className="kicker">The brief</p>
              <h2 id="brief-title">Four things, already done, every morning.</h2>
              <p className="intro">
                The morning brief is one way Grok Bot gives that time back. It has
                already assembled the numbers, found who is behind, read the drive,
                and surfaced the exceptions. The picture is ready for the meeting.
              </p>
            </div>
            <div className="cards">
              {BRIEF_PARTS.map((part) => (
                <article key={part.title} className="card">
                  <h3>{part.title}</h3>
                  <p>{part.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pace" className="section" aria-labelledby="pace-title">
          <div className="wrap pace-layout">
            <div>
              <p className="kicker">Pace</p>
              <h2 id="pace-title">Monthly objectives, checked against selling days.</h2>
              <p>
                Manufacturer (OEM) objectives are set for the month. A unit count by
                itself does not say whether the store is on them. Checking pace against
                the selling days is usually hand work. Lidonick does that check as the
                days pass, so a gap shows up while there are still days left to act on
                it.
              </p>
              <p>
                That pace lands in the same brief as salesperson performance and the
                service drive. The morning meeting starts from one page. The reports
                were already pieced together.
              </p>
            </div>
            <SellingDayDiagram />
          </div>
        </section>

        <section id="watch" className="section tone-band" aria-labelledby="watch-title">
          <div className="wrap">
            <div className="section-head">
              <p className="kicker">Also on watch</p>
              <h2 id="watch-title">Reviews, the inbox, and work like that.</h2>
              <p className="intro">
                Grok Bot also keeps watch and tells a manager when something needs
                them. Reviews and the inbox are two of these jobs. The same
                watch-and-notify pattern covers other operational issues of that kind.
              </p>
            </div>
            <div className="cards">
              {WATCH.map((item) => (
                <article key={item.title} className="card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="setup" className="section tone-band" aria-labelledby="setup-title">
          <div className="wrap">
            <div className="section-head">
              <p className="kicker">Light setup</p>
              <h2 id="setup-title">It reads the reports you already run.</h2>
              <p className="intro">
                Lidonick is built to be put in front of a general manager without a long
                project. It does the compiling from the store's existing exports,
                emails, and reports.
              </p>
            </div>
            <div className="cards three">
              {SOURCES.map((source) => (
                <article key={source.title} className="card">
                  <h3>{source.title}</h3>
                  <p>{source.text}</p>
                </article>
              ))}
            </div>
            <ol className="steps">
              {STEPS.map((step, index) => (
                <li key={step.title}>
                  <span className="step-num">{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <aside className="callout">
              <h3>The operating systems stay</h3>
              <p>
                Lidonick does not replace the DMS or the other systems that operate the
                store. It reads what those systems already produce and does the
                compiling from them. The time saved is the morning spent assembling
                reports, chasing who is behind, and checking pace by hand, along with
                extra reporting tools used only to stitch that picture together.
              </p>
            </aside>
          </div>
        </section>

        <section id="questions" className="section" aria-labelledby="questions-title">
          <div className="wrap questions-layout">
            <div>
              <p className="kicker">On demand</p>
              <h2 id="questions-title">Ask it to take the next task.</h2>
              <p>
                The morning brief is the standing result, not the whole job. During the
                day a manager can ask Lidonick to keep going: a salesperson, a pace
                gap, or an exception. It does that from the same information, so the
                files stay put.
              </p>
            </div>
            <div>
              <p className="kicker">Examples of questions</p>
              <ul className="questions">
                {QUESTIONS.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="demo" className="section tone-demo" aria-labelledby="demo-title">
          <div className="wrap demo-layout">
            <div>
              <p className="kicker">See it on your store</p>
              <h2 id="demo-title">Request a demo</h2>
              <p className="intro">
                Bring the way your store already reports the month. A demo shows what
                Grok Bot would take on for a general manager and a sales manager:
                the morning brief, pace, reviews, and the inbox, using the exports
                and reports you have today.
              </p>
            </div>
            <div>
              <h3>What the conversation covers</h3>
              <ul className="checklist">
                {DEMO_POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <div>
            <p className="footer-brand">Lidonick</p>
            <p className="footer-note">
              Grok Bot for dealership general managers and sales managers. It takes
              on the compiling and the watch work so they can run the store. Internal
              to the store.
            </p>
          </div>
          <nav aria-label="Footer">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            <a href="#demo">Request a demo</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
