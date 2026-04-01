/**
 * ============================================================
 *  MDS SHIELD — Reusable Template for All Client Portals
 * ============================================================
 *
 *  USAGE:
 *  1. Copy MdsShieldFooter and MdsShieldLogin into your portal
 *  2. Set the CLIENT_CONFIG values for the specific client
 *  3. MdsShieldFooter goes in your layout/sidebar footer
 *  4. MdsShieldLogin wraps around your login page
 *
 *  To tell Perplexity to add this, just say:
 *    "add MDS Shield"
 *    — or for new portals it's added automatically
 *
 * ============================================================
 */

// ─── CLIENT CONFIG (change these per portal) ─────────────────
export const CLIENT_CONFIG = {
  clientName: "Jason McDaniel",           // Client contact name
  companyName: "Radius Property Group",   // Client company
  projectName: "NDIS SDA Acquisition Platform", // Project/portal name
  clientEmail: "",                        // Optional — client email
};

// ─── Derived values (no need to edit) ────────────────────────
const TERMS_BASE = "https://jamesglobalac007.github.io/MDS-Enterprises/terms/";
const FORMSUBMIT_KEY = "c0d3ebccf239700f13cfdca36d05749f";
const TERMS_STORAGE_KEY = `mds_terms_accepted_${CLIENT_CONFIG.companyName.toLowerCase().replace(/\s+/g, "_")}`;

export function getTermsUrl(): string {
  const params = new URLSearchParams();
  if (CLIENT_CONFIG.clientName) params.set("name", CLIENT_CONFIG.clientName);
  if (CLIENT_CONFIG.companyName) params.set("company", CLIENT_CONFIG.companyName);
  if (CLIENT_CONFIG.projectName) params.set("project", CLIENT_CONFIG.projectName);
  if (CLIENT_CONFIG.clientEmail) params.set("email", CLIENT_CONFIG.clientEmail);
  return `${TERMS_BASE}?${params.toString()}`;
}

export function hasAcceptedTerms(): boolean {
  try {
    return localStorage.getItem(TERMS_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function storeTermsAccepted(): void {
  try {
    localStorage.setItem(TERMS_STORAGE_KEY, "true");
  } catch {
    // silent
  }
}

export async function logTermsAcceptance(): Promise<void> {
  try {
    await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _subject: `Terms Accepted — ${CLIENT_CONFIG.companyName} Portal`,
        _template: "table",
        company: CLIENT_CONFIG.companyName,
        portal: `${CLIENT_CONFIG.companyName} — ${CLIENT_CONFIG.projectName}`,
        action: "Read & accepted Terms & Disclosures",
        timestamp: new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" }) + " AEST",
        terms_url: getTermsUrl(),
      }),
    });
  } catch {
    // Don't block — acceptance is still valid
  }
}


// ─── 1. MDS SHIELD FOOTER ───────────────────────────────────
//    Add to layout, sidebar, or page footer
// ─────────────────────────────────────────────────────────────

export function MdsShieldFooter() {
  return (
    <div className="py-4 mt-8 border-t border-border/20 text-center">
      <p className="text-[10px] text-muted-foreground/40">
        Built by MDS Enterprises{" "}
        <span className="mx-1">|</span>{" "}
        <a
          href={getTermsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-muted-foreground/60"
        >
          Terms &amp; Disclosures
        </a>
        <span className="mx-1">|</span>{" "}
        &copy; {new Date().getFullYear()} Money Doesn't Sleep Enterprises Pty Ltd
      </p>
    </div>
  );
}


// ─── 2. MDS SHIELD LOGIN TERMS GATE ─────────────────────────
//    Shows a button + modal on the login page
//    Only appears once — stored in localStorage per client
//
//    Usage in your login page:
//
//      import { MdsShieldTermsGate } from "./mds-shield-template";
//
//      function LoginPage() {
//        const [termsOk, setTermsOk] = useState(hasAcceptedTerms());
//        return (
//          <form>
//            <MdsShieldTermsGate accepted={termsOk} onAccepted={() => setTermsOk(true)} />
//            <input ... />
//            <button disabled={!termsOk}>Sign In</button>
//          </form>
//        );
//      }
// ─────────────────────────────────────────────────────────────

import { useState } from "react";

interface TermsGateProps {
  accepted: boolean;
  onAccepted: () => void;
}

export function MdsShieldTermsGate({ accepted, onAccepted }: TermsGateProps) {
  const [showModal, setShowModal] = useState(false);

  const handleAccept = async () => {
    storeTermsAccepted();
    onAccepted();
    setShowModal(false);
    await logTermsAcceptance();
  };

  if (accepted) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06]">
        <svg className="h-5 w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-emerald-300">Terms &amp; Disclosures Accepted</p>
          <p className="text-[11px] text-emerald-300/50 mt-0.5">You may now sign in</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-amber-500/30 bg-amber-500/[0.06] hover:bg-amber-500/[0.12] transition-colors text-left group"
      >
        <svg className="h-5 w-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-300">Review Terms &amp; Disclosures</p>
          <p className="text-[11px] text-amber-300/50 mt-0.5">Required before signing in</p>
        </div>
        <svg className="h-3.5 w-3.5 text-amber-400/60 group-hover:text-amber-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </button>

      {/* Terms Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[hsl(210,40%,14%)] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[hsl(199,100%,50%)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <h2 className="text-base font-semibold text-white/90">Terms &amp; Disclosures</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-md text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <p className="text-sm text-white/70 leading-relaxed">
                Before accessing the {CLIENT_CONFIG.projectName}, please review our full Terms &amp; Disclosures.
                These cover data usage, privacy, liability, intellectual property, and your responsibilities as a platform user.
              </p>

              <a
                href={getTermsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[hsl(199,100%,50%)]/30 bg-[hsl(199,100%,50%)]/[0.06] hover:bg-[hsl(199,100%,50%)]/[0.12] transition-colors group"
              >
                <svg className="h-4 w-4 text-[hsl(199,100%,50%)] shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                <span className="text-sm text-[hsl(199,100%,60%)] group-hover:text-[hsl(199,100%,70%)]">
                  Open Terms &amp; Disclosures in new tab
                </span>
              </a>

              {/* Portal purpose & data restrictions */}
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 space-y-3">
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Portal Purpose &amp; Data Usage
                </p>
                <p className="text-xs text-white/50 leading-relaxed">
                  This portal has been created exclusively for {CLIENT_CONFIG.companyName} and
                  is intended to be used for research and filtering purposes only. All outreach
                  must be directed to the listed agent only.
                </p>
                <ul className="text-xs text-white/40 space-y-1.5 list-disc list-inside">
                  <li>This portal and the data within it must not be on-sold, redistributed, sublicensed, or transferred to any third party</li>
                  <li>Data obtained through this portal must not be sold, shared, or used for any purpose other than {CLIENT_CONFIG.companyName}'s own business activities</li>
                  <li>MDS Enterprises accepts no responsibility or liability if this portal, its data, or any information derived from it is on-sold, shared, or redistributed by the client or any third party</li>
                  <li>MDS Enterprises builds this portal as a software tool only — the client is responsible for sourcing, exporting, uploading, and managing all data within the portal</li>
                  <li>Once the portal is handed over, MDS has no involvement with, access to, or responsibility for the data loaded into it</li>
                  <li>Any breach of these data usage terms is solely the responsibility of the client</li>
                </ul>
              </div>

              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 space-y-2">
                <p className="text-xs text-white/50 leading-relaxed">
                  By clicking <strong className="text-white/70">I Accept</strong> below, you
                  confirm that you have read and understood the Terms &amp; Disclosures
                  and agree to the conditions outlined within, including:
                </p>
                <ul className="text-xs text-white/40 space-y-1 list-disc list-inside">
                  <li>Data usage, subscription responsibilities, and no-resale obligations</li>
                  <li>Portal handover and data separation responsibilities</li>
                  <li>Privacy, data security, and monitoring disclaimers</li>
                  <li>Limitation of liability and indemnity</li>
                  <li>Intellectual property and confidentiality</li>
                  <li>Scope of services and exclusions</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-sm text-white/50 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                I Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
