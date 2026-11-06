import { fireEvent, render, screen, within } from "@testing-library/react";
import fs from "fs";
import path from "path";
import App from "./App";

function read(relativePath) {
  return fs.readFileSync(path.join(__dirname, relativePath), "utf8");
}

test("presents Lidonick as an internal executive assistant for dealership managers", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: /morning brief for the people who run the store/i,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("heading", { name: /general manager and the sales manager/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /four things, every morning, in one place/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /monthly objectives, checked against selling days/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /reports you already run/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /request a demo/i })).toBeInTheDocument();

  expect(document.body).toHaveTextContent(/not a chatbot for shoppers/i);
  expect(document.body).toHaveTextContent(/does not replace the dms/i);
  expect(document.body).toHaveTextContent(/csv exports/i);
  expect(document.body).toHaveTextContent(/forwarded emails/i);
  expect(document.body).toHaveTextContent(/service drive/i);
  expect(document.body).toHaveTextContent(/exceptions/i);
  expect(document.body.textContent).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

  const demoLinks = screen.getAllByRole("link", { name: /request a demo/i });
  expect(demoLinks.length).toBeGreaterThan(1);
  demoLinks.forEach((link) => expect(link).toHaveAttribute("href", "#demo"));
});

test("opens and closes the section menu", () => {
  render(<App />);
  const menu = screen.getByRole("button", { name: /menu/i });
  expect(menu).toHaveAttribute("aria-expanded", "false");

  fireEvent.click(menu);
  expect(menu).toHaveAttribute("aria-expanded", "true");

  const primary = screen.getByRole("navigation", { name: /primary/i });
  fireEvent.click(within(primary).getByRole("link", { name: /^pace$/i }));
  expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("public metadata describes the executive assistant", () => {
  const html = read("../public/index.html");
  const manifest = read("../public/manifest.json");

  expect(html).toMatch(
    /<title>Lidonick — AI executive assistant for dealership managers<\/title>/
  );
  expect(html).toMatch(/general managers and sales managers/i);
  expect(html).toMatch(/name="description"/);
  expect(manifest).toMatch(/executive assistant/i);

  const source = [html, manifest, read("App.js"), read("App.css")].join("\n");
  expect(source).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  expect(source).not.toMatch(/type="password"|password\s*[:=]/i);
});
