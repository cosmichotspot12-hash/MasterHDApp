import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us – HubliDharwad.app',
  description: 'We are a verified property platform built exclusively for Hubballi-Dharwad. Less chasing, more clarity — for seekers and owners alike.',
}

const SEEKER_STEPS = [
  {
    num: '01',
    title: 'Start with verified options',
    desc: 'Browse listings with clear locality, pricing, photos, BHK, and category — without digging through chats.',
  },
  {
    num: '02',
    title: 'Shortlist before stepping out',
    desc: 'Use photos, video walkthroughs, and listing details to decide whether the property is worth your time.',
  },
  {
    num: '03',
    title: 'Send one visit request',
    desc: 'Choose the property you like and request a visit. We collect the details and coordinate the next step.',
  },
  {
    num: '04',
    title: 'Get local follow-up',
    desc: 'No match yet? Post your requirement and we match it with current and incoming listings.',
  },
]

const OWNER_STEPS = [
  {
    num: '01',
    title: 'Fill a short form',
    desc: 'Location, type, expected rent or price. Takes 3 minutes.',
  },
  {
    num: '02',
    title: 'We call you',
    desc: 'Confirm details, answer questions, and schedule our property visit.',
  },
  {
    num: '03',
    title: 'We visit & shoot',
    desc: 'We visit your property, verify every detail, and create a full video tour.',
  },
  {
    num: '04',
    title: 'Live on website & Instagram',
    desc: 'Your listing goes live on our platform and Instagram — reaching 300+ active seekers instantly.',
  },
]

export default function AboutPage() {
  return (
    <>
      <style>{`
        @keyframes ab-glow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(201,95,44,0.12) inset, 0 8px 32px rgba(201,95,44,0.10); }
          50%       { box-shadow: 0 0 0 1px rgba(201,95,44,0.20) inset, 0 8px 40px rgba(201,95,44,0.20); }
        }

        /* ── page shell ── */
        .ab-page {
          min-height: 100vh;
          background: #FFF4E6;
          padding-bottom: 60px;
        }

        /* ── intro hero ── */
        .ab-intro {
          padding: 60px 20px 56px;
          text-align: center;
        }
        .ab-intro-inner {
          margin: 0 auto;
          max-width: 760px;
        }
        .ab-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(201,95,44,0.25);
          border-radius: 999px;
          background: rgba(255,255,255,0.60);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 7px 16px;
          color: #7A3018;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          box-shadow: 0 2px 12px rgba(201,95,44,0.10), inset 0 1px 0 rgba(255,255,255,0.8);
        }
        .ab-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(135deg, #C95F2C, #F5A623);
          box-shadow: 0 0 5px rgba(201,95,44,0.50);
        }
        .ab-intro-title {
          margin: 22px 0 0;
          color: #1C1917;
          font-size: clamp(36px, 5.5vw, 72px);
          font-weight: 950;
          line-height: 0.97;
          letter-spacing: -0.03em;
        }
        .ab-intro-title em {
          font-style: normal;
          background: linear-gradient(135deg, #C95F2C 0%, #7A3018 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ab-intro-copy {
          margin: 20px auto 0;
          max-width: 560px;
          color: #5B6472;
          font-size: 17px;
          font-weight: 650;
          line-height: 1.65;
        }
        .ab-intro-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin: 32px auto 0;
          max-width: 480px;
          border: 1px solid #E4DED6;
          border-radius: 14px;
          background: rgba(255,255,255,0.68);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(17,24,39,0.07);
        }
        .ab-stat {
          flex: 1;
          padding: 18px 12px;
          text-align: center;
          border-right: 1px solid #E4DED6;
        }
        .ab-stat:last-child { border-right: 0; }
        .ab-stat-num {
          color: #111827;
          font-size: 26px;
          font-weight: 950;
          line-height: 1;
          letter-spacing: -0.03em;
        }
        .ab-stat-num span {
          background: linear-gradient(135deg, #C95F2C 0%, #F5A623 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ab-stat-label {
          margin-top: 5px;
          color: #7A6E68;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* ── section wrapper ── */
        .ab-section {
          padding: 0 20px;
          margin-top: 20px;
        }
        .ab-section-inner {
          margin: 0 auto;
          max-width: 1200px;
        }

        /* ── seekers panel ── */
        .ab-seekers {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 0;
          overflow: hidden;
          border: 1px solid #E4DED6;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 4px 24px rgba(17,24,39,0.06);
        }
        .ab-seekers-intro {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 32px;
          border-right: 1px solid #EDE6DE;
          background: #FFF9F1;
          padding: 36px;
        }
        .ab-seekers-tag {
          display: inline-flex;
          width: fit-content;
          border: 1px solid #D8C9BA;
          border-radius: 999px;
          background: #fff;
          padding: 6px 12px;
          color: #9F4A22;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .ab-seekers-title {
          margin: 14px 0 0;
          color: #111827;
          font-size: clamp(26px, 3vw, 42px);
          font-weight: 950;
          line-height: 1.04;
          letter-spacing: -0.02em;
        }
        .ab-seekers-copy {
          margin: 12px 0 0;
          color: #5B6472;
          font-size: 15px;
          font-weight: 650;
          line-height: 1.7;
        }
        .ab-seekers-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }
        .ab-btn-dark {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #111827 0%, #C95F2C 100%);
          padding: 11px 22px;
          color: #fff;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(201,95,44,0.32);
          transition: box-shadow 0.2s, transform 0.15s;
        }
        .ab-btn-dark:hover {
          box-shadow: 0 10px 28px rgba(201,95,44,0.44);
          transform: translateY(-1px);
        }
        .ab-btn-ghost {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(201,95,44,0.28);
          border-radius: 999px;
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(8px);
          padding: 11px 22px;
          color: #33251C;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .ab-btn-ghost:hover {
          border-color: rgba(201,95,44,0.50);
          background: #fff;
        }
        .ab-seekers-note {
          margin: 0;
          border-top: 1px solid #EDE6DE;
          padding-top: 16px;
          color: #7A6E68;
          font-size: 12.5px;
          font-weight: 750;
          line-height: 1.6;
        }
        .ab-steps-rail {
          display: grid;
          background: #fff;
        }
        .ab-step {
          display: grid;
          grid-template-columns: 64px minmax(0, 1fr);
          gap: 16px;
          align-items: start;
          border-bottom: 1px solid #F0EBE5;
          padding: 26px 30px;
        }
        .ab-step:last-child { border-bottom: 0; }
        .ab-step-num {
          color: #E2D4C8;
          font-size: 32px;
          font-weight: 950;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .ab-step h3 {
          margin: 0;
          color: #111827;
          font-size: 18px;
          font-weight: 950;
          line-height: 1.2;
        }
        .ab-step p {
          margin: 7px 0 0;
          color: #5B6472;
          font-size: 14px;
          font-weight: 650;
          line-height: 1.65;
        }

        /* ── owners panel ── */
        .ab-owners {
          margin-top: 16px;
          overflow: hidden;
          border-radius: 16px;
          background: linear-gradient(160deg, #111827 0%, #1E1008 100%);
          color: #fff;
          box-shadow: 0 8px 40px rgba(17,24,39,0.22);
        }
        .ab-owners-top {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(300px, 0.95fr);
          gap: 32px;
          align-items: end;
          padding: 36px;
        }
        .ab-owners-tag {
          display: inline-flex;
          width: fit-content;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          padding: 6px 12px;
          color: #D8C9BA;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .ab-owners-title {
          margin: 14px 0 0;
          font-size: clamp(28px, 3.5vw, 48px);
          font-weight: 950;
          line-height: 1.02;
          letter-spacing: -0.02em;
          color: #fff;
        }
        .ab-owners-copy {
          margin: 14px 0 0;
          color: #94A3B8;
          font-size: 15px;
          font-weight: 650;
          line-height: 1.75;
        }
        .ab-owners-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 22px;
        }
        .ab-btn-light {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #fff;
          border-radius: 999px;
          background: #fff;
          padding: 11px 22px;
          color: #111827;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
          transition: background 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 16px rgba(255,255,255,0.15);
        }
        .ab-btn-light:hover {
          background: #F8F8F8;
        }
        .ab-btn-outline {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.24);
          border-radius: 999px;
          background: transparent;
          padding: 11px 22px;
          color: #fff;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .ab-btn-outline:hover {
          border-color: rgba(255,255,255,0.44);
          background: rgba(255,255,255,0.06);
        }
        .ab-owners-summary {
          display: grid;
          gap: 10px;
        }
        .ab-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          padding: 13px 16px;
        }
        .ab-summary-row span:first-child {
          color: #94A3B8;
          font-size: 13px;
          font-weight: 750;
        }
        .ab-summary-row span:last-child {
          color: #fff;
          font-size: 13px;
          font-weight: 950;
          text-align: right;
        }
        .ab-owners-flow {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border-top: 1px solid rgba(255,255,255,0.10);
        }
        .ab-flow-item {
          min-height: 180px;
          border-right: 1px solid rgba(255,255,255,0.10);
          padding: 24px 22px;
          transition: background 0.15s;
        }
        .ab-flow-item:last-child { border-right: 0; }
        .ab-flow-item:hover { background: rgba(255,255,255,0.03); }
        .ab-flow-num {
          color: #475569;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.06em;
        }
        .ab-flow-title {
          margin: 16px 0 0;
          color: #fff;
          font-size: 16px;
          font-weight: 950;
          line-height: 1.2;
        }
        .ab-flow-copy {
          margin: 8px 0 0;
          color: #94A3B8;
          font-size: 13px;
          font-weight: 650;
          line-height: 1.6;
        }
        .ab-flow-payoff .ab-flow-title {
          background: linear-gradient(135deg, #C95F2C 0%, #F5A623 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── closing cta ── */
        .ab-cta {
          margin-top: 16px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .ab-cta-card {
          border: 1px solid #E4DED6;
          border-radius: 16px;
          background: rgba(255,255,255,0.68);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-shadow: 0 4px 20px rgba(17,24,39,0.06);
          animation: ab-glow 4s ease-in-out infinite;
        }
        .ab-cta-label {
          color: #7A6E68;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .ab-cta-title {
          margin: 8px 0 0;
          color: #111827;
          font-size: 22px;
          font-weight: 950;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        /* ── responsive ── */
        @media (max-width: 768px) {
          .ab-intro { padding: 44px 16px 36px; }
          .ab-intro-title { font-size: 34px; }
          .ab-intro-copy { font-size: 15px; }
          .ab-intro-stats { flex-direction: column; }
          .ab-stat { border-right: 0; border-bottom: 1px solid #E4DED6; }
          .ab-stat:last-child { border-bottom: 0; }
          .ab-section { padding: 0 12px; }
          .ab-seekers { grid-template-columns: 1fr; }
          .ab-seekers-intro { border-right: 0; border-bottom: 1px solid #EDE6DE; padding: 22px; }
          .ab-seekers-title { font-size: 26px; }
          .ab-step { grid-template-columns: 48px minmax(0,1fr); gap: 12px; padding: 20px 16px; }
          .ab-step-num { font-size: 24px; }
          .ab-step h3 { font-size: 16px; }
          .ab-owners-top { grid-template-columns: 1fr; padding: 22px; gap: 20px; }
          .ab-owners-title { font-size: 26px; }
          .ab-owners-flow { grid-template-columns: 1fr 1fr; }
          .ab-flow-item {
            min-height: 0;
            border-right: 1px solid rgba(255,255,255,0.10);
            border-bottom: 1px solid rgba(255,255,255,0.10);
          }
          .ab-flow-item:nth-child(2n) { border-right: 0; }
          .ab-flow-item:nth-child(3),
          .ab-flow-item:nth-child(4) { border-bottom: 0; }
          .ab-cta { grid-template-columns: 1fr; }
          .ab-cta-card { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 480px) {
          .ab-owners-flow { grid-template-columns: 1fr; }
          .ab-flow-item { border-right: 0; border-bottom: 1px solid rgba(255,255,255,0.10); }
          .ab-flow-item:last-child { border-bottom: 0; }
          .ab-seekers-actions { flex-direction: column; }
          .ab-btn-dark, .ab-btn-ghost { width: 100%; justify-content: center; }
        }
      `}</style>

      <main className="ab-page">

        {/* ── INTRO HERO ───────────────────────────────────────────────── */}
        <section className="ab-intro" aria-label="About HubliDharwad.app">
          <div className="ab-intro-inner">
            <span className="ab-eyebrow">
              <span className="ab-eyebrow-dot" aria-hidden />
              About us
            </span>

            <h1 className="ab-intro-title">
              Built for <em>Hubballi-Dharwad.</em>
              <br />Nothing else.
            </h1>

            <p className="ab-intro-copy">
              We are a property platform built exclusively for Hubballi-Dharwad. Every listing
              is personally visited and verified. We coordinate seekers and owners so that
              fewer calls lead to better decisions.
            </p>

            <div className="ab-intro-stats" aria-label="Platform highlights">
              <div className="ab-stat">
                <div className="ab-stat-num"><span>300+</span></div>
                <div className="ab-stat-label">Active seekers</div>
              </div>
              <div className="ab-stat">
                <div className="ab-stat-num"><span>100%</span></div>
                <div className="ab-stat-label">Personally verified</div>
              </div>
              <div className="ab-stat">
                <div className="ab-stat-num"><span>1</span></div>
                <div className="ab-stat-label">City. Done right.</div>
              </div>
            </div>
          </div>
        </section>


        {/* ── SEEKER PROCESS ───────────────────────────────────────────── */}
        <section className="ab-section" aria-label="How it works for seekers">
          <div className="ab-section-inner">
            <div className="ab-seekers">
              <div className="ab-seekers-intro">
                <div>
                  <span className="ab-seekers-tag">For property seekers</span>
                  <h2 className="ab-seekers-title">
                    Less chasing.<br />More clarity.
                  </h2>
                  <p className="ab-seekers-copy">
                    We keep the property search practical — verified details first,
                    video before travel, and one organised visit request when you are ready.
                  </p>
                </div>
                <div>
                  <div className="ab-seekers-actions">
                    <Link href="/properties" className="ab-btn-dark">Browse properties</Link>
                    <Link href="/find" className="ab-btn-ghost">Post requirement</Link>
                  </div>
                  <p className="ab-seekers-note">
                    Built for Hubballi-Dharwad seekers who want fewer random calls and better property decisions.
                  </p>
                </div>
              </div>

              <div className="ab-steps-rail">
                {SEEKER_STEPS.map(({ num, title, desc }) => (
                  <div className="ab-step" key={num}>
                    <span className="ab-step-num">{num}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ── OWNERS PANEL ─────────────────────────────────────────────── */}
        <section className="ab-section" aria-label="How it works for property owners">
          <div className="ab-section-inner">
            <div className="ab-owners">
              <div className="ab-owners-top">
                <div>
                  <span className="ab-owners-tag">For property owners</span>
                  <h2 className="ab-owners-title">
                    Share the property once.<br />
                    We turn it into a serious listing.
                  </h2>
                  <p className="ab-owners-copy">
                    Owners, brokers, builders, and local promoters can send property details to us.
                    We verify the basics, prepare the listing, and coordinate serious enquiries
                    instead of scattered calls.
                  </p>
                  <div className="ab-owners-actions">
                    <Link href="/list" className="ab-btn-light">Submit property</Link>
                    <Link href="/services" className="ab-btn-outline">Services</Link>
                  </div>
                </div>

                <div className="ab-owners-summary" aria-label="Listing summary">
                  <div className="ab-summary-row">
                    <span>Accepted listings</span>
                    <span>Rent, sale, commercial, PG, land</span>
                  </div>
                  <div className="ab-summary-row">
                    <span>Who can list</span>
                    <span>Owners, brokers, agents, promoters</span>
                  </div>
                  <div className="ab-summary-row">
                    <span>Support</span>
                    <span>Details, photos, visits, follow-up</span>
                  </div>
                </div>
              </div>

              <div className="ab-owners-flow">
                {OWNER_STEPS.map(({ num, title, desc }, i) => (
                  <div
                    key={num}
                    className={`ab-flow-item${i === OWNER_STEPS.length - 1 ? ' ab-flow-payoff' : ''}`}
                  >
                    <p className="ab-flow-num">{num}</p>
                    <h3 className="ab-flow-title">{title}</h3>
                    <p className="ab-flow-copy">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ── CLOSING CTA ──────────────────────────────────────────────── */}
        <section className="ab-section" aria-label="Get started" style={{ marginTop: '16px' }}>
          <div className="ab-section-inner">
            <div className="ab-cta">
              <div className="ab-cta-card">
                <div>
                  <p className="ab-cta-label">Looking for a property?</p>
                  <h2 className="ab-cta-title">Tell us what you need.</h2>
                </div>
                <Link href="/find" className="ab-btn-dark" style={{ whiteSpace: 'nowrap' }}>
                  Post requirement
                </Link>
              </div>
              <div className="ab-cta-card">
                <div>
                  <p className="ab-cta-label">Own a property?</p>
                  <h2 className="ab-cta-title">List it with us.</h2>
                </div>
                <Link href="/list" className="ab-btn-dark" style={{ whiteSpace: 'nowrap' }}>
                  Submit property
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
