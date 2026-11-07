import { useEffect, useRef, useState, type ReactNode } from "react";
import { inviteUrl } from "../../content/joinLink";
import { siteLinks } from "../../content/siteLinks";

// Condensed from the seven numbered rules on the Notion welcome page. Every
// rule is represented; the wording is shortened because a wall of text in a
// dialog gets dismissed unread, which would defeat the point of having one.
const rules = [
  "Keep posts relevant: med-dev is about medicine and tech improving healthcare.",
  "Share articles, tools, events and jobs, with a line of context on why they matter.",
  "No ads or spam. Memes belong in #Memes or #Random.",
  "No political debates, unless they relate to health or tech.",
  "Be respectful. No harassment, discrimination, or disrespectful language.",
  "Feedback and suggestions to the admins are always welcome.",
];

/**
 * Opens a dialog with the rules of engagement, and only then puts the invite
 * URL into the DOM. Replaces a plain link to the invite, which put the URL into
 * the prerendered HTML of every page.
 */
export function JoinButton({
  children,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Empty until a human opens the dialog, so the server-rendered markup carries
  // no href. Also keeps server and client output identical on first paint.
  const [href, setHref] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen) {
      // showModal gives focus trapping, Esc, and inertness for free. Where it
      // is missing, fall back to a plain open dialog rather than leaving the
      // visitor with a Join button that silently does nothing.
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.open = true;
      }
    } else if (dialog.open) {
      // close() releases the top layer and fires the close event; assigning
      // open = false does neither, so only use it where close() is missing.
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.open = false;
      }
    }
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        className={`button-link button-link--${variant} js-only ${className}`}
        onClick={() => {
          setHref(inviteUrl());
          setIsOpen(true);
        }}
      >
        {children}
      </button>
      <noscript>
        <a
          className={`button-link button-link--${variant} ${className}`}
          href={siteLinks.notionWelcome}
        >
          {children}
        </a>
      </noscript>
      <dialog className="join-dialog" ref={dialogRef} onClose={() => setIsOpen(false)}>
        <h2>Before you join</h2>
        <p>The med-dev WhatsApp community runs on a few ground rules.</p>
        <ul>
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <p className="join-dialog__note">Admins may remove members who do not follow these.</p>
        <div className="join-dialog__actions">
          {/* A real anchor, so open-in-new-tab, right-click and keyboard all
              behave. The href only exists once the dialog has been opened. */}
          <a
            className="button-link button-link--primary"
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsOpen(false)}
          >
            I agree, open WhatsApp
          </a>
          <button
            type="button"
            className="button-link button-link--ghost"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </dialog>
    </>
  );
}
