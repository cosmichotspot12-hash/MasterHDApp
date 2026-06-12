import type { Metadata } from 'next'
import { connection } from 'next/server'
import ListPropertyForm from './ListPropertyForm'
import { getPublicDemandSummary, type PublicDemandLocality } from '@/lib/public-demand'

export const metadata: Metadata = {
  title: 'List Your Property | MasterHD',
  description: 'Show your property to real tenants and buyers looking in Hubballi-Dharwad localities right now.',
}

function DemandCard({ item }: { item: PublicDemandLocality }) {
  return (
    <article className="ld-card">
      <div className="ld-card-top">
        <h3>{item.locality}</h3>
        <strong>{item.total}</strong>
      </div>
      <div className="ld-split" aria-label={`Demand split for ${item.locality}`}>
        <span>{item.rent} rent</span>
        <span>{item.sale} sale</span>
      </div>
    </article>
  )
}

export default async function ListPage() {
  await connection()
  const demand = await getPublicDemandSummary()
  const topLocalities = demand.localities.slice(0, 6)

  return (
    <div className="pf-page">
      <style>{`
        .ld-wrap {
          width: min(100% - 1.5rem, 76rem);
          margin-inline: auto;
          padding: 1.5rem 0 2.75rem;
        }

        .ld-grid {
          display: grid;
          grid-template-columns: minmax(0, .95fr) minmax(360px, .72fr);
          gap: 1rem;
          align-items: start;
        }

        .ld-proof {
          overflow: hidden;
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 20px 46px rgba(58, 46, 40, .08);
        }

        .ld-hero {
          border-bottom: 1px solid #EEE4D8;
          background: #111827;
          padding: 1.35rem;
          color: #fff;
        }

        .ld-kicker {
          display: inline-flex;
          width: fit-content;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          padding: .35rem .6rem;
          color: #D8C9BA;
          font-size: .7rem;
          font-weight: 950;
        }

        .ld-title {
          max-width: 12ch;
          margin: .8rem 0 0;
          color: #fff;
          font-size: clamp(2rem, 4vw, 4rem);
          font-weight: 950;
          line-height: .98;
        }

        .ld-copy {
          max-width: 42rem;
          margin: .9rem 0 0;
          color: #CBD5E1;
          font-size: .98rem;
          font-weight: 650;
          line-height: 1.7;
        }

        .ld-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border-bottom: 1px solid #EEE4D8;
        }

        .ld-stat {
          min-height: 104px;
          display: grid;
          align-content: center;
          gap: .35rem;
          border-right: 1px solid #EEE4D8;
          padding: 1rem;
        }

        .ld-stat:last-child {
          border-right: 0;
        }

        .ld-stat strong {
          color: #111827;
          font-size: clamp(1.45rem, 2.5vw, 2.25rem);
          font-weight: 950;
          line-height: 1;
        }

        .ld-stat span {
          color: #64748B;
          font-size: .76rem;
          font-weight: 850;
          line-height: 1.35;
        }

        .ld-body {
          display: grid;
          gap: .85rem;
          padding: 1rem;
        }

        .ld-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 1rem;
        }

        .ld-section-head h2 {
          margin: 0;
          color: #111827;
          font-size: 1.08rem;
          font-weight: 950;
        }

        .ld-section-head p {
          margin: .25rem 0 0;
          color: #64748B;
          font-size: .82rem;
          font-weight: 650;
          line-height: 1.45;
        }

        .ld-privacy {
          border: 1px solid #DCEBDD;
          border-radius: 999px;
          background: #F4FBF5;
          padding: .42rem .65rem;
          color: #14724B;
          font-size: .72rem;
          font-weight: 950;
          white-space: nowrap;
        }

        .ld-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: .75rem;
        }

        .ld-card {
          display: grid;
          gap: .7rem;
          border: 1px solid #E8ECF1;
          border-radius: 8px;
          background: #FAFBFC;
          padding: .9rem;
        }

        .ld-card-top {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: .75rem;
          align-items: start;
        }

        .ld-card h3 {
          margin: 0;
          overflow-wrap: anywhere;
          color: #111827;
          font-size: .98rem;
          font-weight: 950;
          line-height: 1.2;
        }

        .ld-card-top strong {
          min-width: 2.35rem;
          min-height: 2.35rem;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #111827;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 950;
        }

        .ld-split {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: .45rem;
        }

        .ld-split span {
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
          padding: .48rem .55rem;
          color: #334155;
          font-size: .76rem;
          font-weight: 900;
          text-align: center;
        }

        .ld-note {
          margin: 0;
          border: 1px solid #EAD8C7;
          border-left: 3px solid #A95424;
          border-radius: 8px;
          background: #FFF8EF;
          padding: .8rem .9rem;
          color: #7A3D1F;
          font-size: .8rem;
          font-weight: 750;
          line-height: 1.55;
        }

        .ld-empty {
          border: 1px dashed #D8C9BA;
          border-radius: 8px;
          background: #FFF9F1;
          padding: 1rem;
          color: #7A6E68;
          font-size: .85rem;
          font-weight: 750;
          line-height: 1.55;
        }

        .ld-form-side {
          position: sticky;
          top: 104px;
        }

        .ld-form-side .pf-success-card {
          width: 100%;
        }

        @media (max-width: 960px) {
          .ld-grid {
            grid-template-columns: 1fr;
          }

          .ld-form-side {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .ld-wrap {
            width: min(100% - 1rem, 42rem);
            padding: .55rem 0 1.35rem;
          }

          .ld-grid {
            gap: .65rem;
          }

          .ld-hero {
            padding: .75rem;
          }

          .ld-title {
            max-width: 18ch;
            margin-top: .45rem;
            font-size: 1.28rem;
            line-height: 1.08;
          }

          .ld-copy {
            margin-top: .4rem;
            font-size: .78rem;
            line-height: 1.42;
          }

          .ld-kicker {
            padding: .26rem .48rem;
            font-size: .62rem;
          }

          .ld-stats {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .ld-stat {
            min-height: 54px;
            border-right: 1px solid #EEE4D8;
            border-bottom: 0;
            padding: .55rem .35rem;
            text-align: center;
          }

          .ld-stat:last-child {
            border-right: 0;
          }

          .ld-stat strong {
            font-size: 1.18rem;
          }

          .ld-stat span {
            font-size: .6rem;
            line-height: 1.15;
          }

          .ld-section-head {
            align-items: flex-start;
            flex-direction: column;
            gap: .38rem;
          }

          .ld-section-head h2 {
            font-size: .94rem;
          }

          .ld-section-head p {
            font-size: .72rem;
            line-height: 1.35;
          }

          .ld-body {
            gap: .55rem;
            padding: .65rem;
          }

          .ld-privacy {
            padding: .3rem .48rem;
            font-size: .62rem;
          }

          .ld-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: .45rem;
          }

          .ld-card {
            gap: .45rem;
            padding: .55rem;
          }

          .ld-card-top {
            gap: .45rem;
          }

          .ld-card h3 {
            font-size: .8rem;
            line-height: 1.12;
          }

          .ld-card-top strong {
            min-width: 1.65rem;
            min-height: 1.65rem;
            border-radius: 6px;
            font-size: .85rem;
          }

          .ld-split {
            gap: .28rem;
          }

          .ld-split span {
            padding: .32rem .25rem;
            font-size: .62rem;
          }

          .ld-note {
            padding: .55rem .6rem;
            font-size: .68rem;
            line-height: 1.35;
          }

          .ld-privacy {
            white-space: normal;
          }
        }

        @media (max-width: 380px) {
          .ld-stats,
          .ld-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ld-stat:nth-child(2) {
            border-right: 0;
          }

          .ld-stat:nth-child(-n + 2) {
            border-bottom: 1px solid #EEE4D8;
          }
        }
      `}</style>

      <main className="ld-wrap">
        <div className="ld-grid">
          <section className="ld-proof" aria-labelledby="demand-proof-title">
            <div className="ld-hero">
              <span className="ld-kicker">Live buyer and tenant demand</span>
              <h1 id="demand-proof-title" className="ld-title">Owners can see where demand is real.</h1>
              <p className="ld-copy">
                These numbers come from submitted property requirements in Hubballi-Dharwad. We show only grouped market demand, never personal details.
              </p>
            </div>

            <div className="ld-stats" aria-label="Demand summary">
              <div className="ld-stat">
                <strong>{demand.totalActive}</strong>
                <span>active requirements</span>
              </div>
              <div className="ld-stat">
                <strong>{demand.localityCount}</strong>
                <span>localities with demand</span>
              </div>
              <div className="ld-stat">
                <strong>{demand.rentTotal}</strong>
                <span>rent seekers</span>
              </div>
              <div className="ld-stat">
                <strong>{demand.saleTotal}</strong>
                <span>buyer requirements</span>
              </div>
            </div>

            <div className="ld-body">
              <div className="ld-section-head">
                <div>
                  <h2>Top demand areas right now</h2>
                  <p>Aggregated from real forms: locality-wise demand and rent/sale split.</p>
                </div>
                <span className="ld-privacy">Privacy-safe public view</span>
              </div>

              {topLocalities.length > 0 ? (
                <div className="ld-cards">
                  {topLocalities.map((item) => (
                    <DemandCard key={item.locality} item={item} />
                  ))}
                </div>
              ) : (
                <div className="ld-empty">
                  Demand data will appear here after requirements are submitted. Owners can still send a property and we will check matching demand privately.
                </div>
              )}

              <p className="ld-note">
                For trust and privacy, we do not publish names, phone numbers, exact messages, or individual customer requirements. Owners who submit a property get a direct demand check from our team.
              </p>
            </div>
          </section>

          <aside className="ld-form-side" aria-label="Submit property details">
            <ListPropertyForm />
          </aside>
        </div>
      </main>
    </div>
  )
}
