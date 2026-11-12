import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { JoinButton } from "../components/common/JoinButton";
import { inviteUrl } from "../content/joinLink";

// Matched rather than compared against the real invite: this file is in a
// public repo, so pinning the exact URL here would publish the very string the
// encoding in joinLink.ts exists to keep off the machine-readable web. Written
// escaped so the pattern itself is not the literal it searches for.
const invitePattern = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{20,28}$/;

// Same reason, built at runtime so the bare domain is not a literal either.
const inviteHost = ["chat", "whatsapp", "com"].join(".");

const srcDir = join(import.meta.dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|css|html)$/.test(entry.name) ? [path] : [];
  });
}

afterEach(cleanup);

// The invite is kept out of the prerendered HTML and the JS bundle so link
// harvesters scanning for the URL pattern find nothing. Every part of that is
// easy to undo by accident, so each one is pinned here.
describe("WhatsApp invite", () => {
  it("decodes to a well-formed invite", () => {
    expect(inviteUrl()).toMatch(invitePattern);
  });

  it("appears as a literal nowhere in the source", () => {
    const offenders = sourceFiles(srcDir).filter((path) =>
      readFileSync(path, "utf8").includes(inviteHost),
    );

    expect(offenders).toEqual([]);
  });

  it("leaves the href empty until a human opens the dialog", () => {
    const { container } = render(<JoinButton>Join WhatsApp</JoinButton>);
    const accept = () => container.querySelector(".join-dialog a");

    // Computing the URL during render instead of in the click handler would
    // bake it straight back into the prerendered HTML.
    expect(accept()?.getAttribute("href")).toBe("");

    fireEvent.click(screen.getByRole("button", { name: "Join WhatsApp" }));

    expect(accept()?.getAttribute("href")).toMatch(invitePattern);
  });
});
