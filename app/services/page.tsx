import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917026270171'

const services = [
  {
    title: 'Verified property listings',
    text: 'We help owners and partners present rental, sale, commercial, PG, and land listings with clear details, photos, and local context.',
  },
  {
    title: 'Rental agreements',
    text: 'We support tenants and owners with rental agreement coordination, basic document guidance, and a smoother handover process.',
  },
  {
    title: 'Tenant and buyer requirements',
    text: 'People can share what they need, and our team uses locality, budget, BHK, and timeline to match them with suitable properties.',
  },
  {
    title: 'Visit coordination',
    text: 'We coordinate property visits between interested tenants or buyers and the listing side so the process stays organized.',
  },
  {
    title: 'Owner and broker support',
    text: 'Owners, brokers, agents, builders, and Instagram property promoters can list with us and reach active local demand.',
  },
  {
    title: 'Documentation guidance',
    text: 'We help both sides understand the next steps for property details, agreement flow, and contact coordination.',
  },
]

const workflow = [
  'Share property or requirement details',
  'Our team checks the information',
  'We list, match, or prepare the next action',
  'Interested people are contacted or visits are coordinated',
  'Status is tracked until closure or follow-up',
]

const partners = [
  'Property owners',
  'Brokers and local agents',
  'Instagram and Facebook property promoters',
  'Builders and developers',
  'PG, hostel, and commercial space providers',
]

export const metadata: Metadata = {
  title: 'Property Services in Hubli-Dharwad | HubliDharwad.app',
  description: 'Property listing support, rental agreements, visit coordination, tenant and buyer requirements, and partner listing support in Hubli-Dharwad.',
  alternates: { canonical: '/services' },
}

function whatsappHref(message: string) {
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message)
}

export default function ServicesPage() {
  const serviceMessage = 'Hi, I want to know about property services from HubliDharwad.app.'
  const partnerMessage = 'Hi, I want to list properties or partner with HubliDharwad.app.'

  return (
    <>
      <style>{`
        .svc-page {
          background: #FFF4E6;
          color: #111827;
        }

        .svc-wrap {
          width: min(100% - 32px, 1180px);
          margin: 0 auto;
        }

        .svc-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
          gap: 34px;
          align-items: center;
          padding: 44px 0 34px;
        }

        .svc-kicker {
          display: inline-flex;
          width: fit-content;
          border: 1px solid #DCEBDD;
          border-radius: 999px;
          background: #F4FBF5;
          padding: 7px 12px;
          color: #14724B;
          font-size: 12px;
          font-weight: 900;
        }

        .svc-title {
          max-width: 760px;
          margin: 16px 0 0;
          color: #111827;
          font-size: clamp(34px, 5vw, 62px);
          font-weight: 950;
          line-height: 1.02;
          letter-spacing: 0;
        }

        .svc-lede {
          max-width: 680px;
          margin: 18px 0 0;
          color: #5B6472;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.65;
        }

        .svc-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
        }

        .svc-btn,
        .svc-btn-light {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
        }

        .svc-btn {
          border: 1px solid var(--brand);
          background: var(--brand);
          color: #fff;
        }

        .svc-btn:hover {
          border-color: var(--brand-dark);
          background: var(--brand-dark);
        }

        .svc-btn-light {
          border: 1px solid #D7DDE5;
          background: #fff;
          color: #111827;
        }

        .svc-hero-media {
          overflow: hidden;
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
        }

        .svc-hero-media img {
          display: block;
          width: 100%;
          height: auto;
        }

        .svc-strip {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin: 10px 0 34px;
        }

        .svc-strip-item {
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
          padding: 16px;
        }

        .svc-strip-label {
          color: #7A6E68;
          font-size: 12px;
          font-weight: 850;
        }

        .svc-strip-value {
          margin-top: 5px;
          color: #111827;
          font-size: 18px;
          font-weight: 950;
        }

        .svc-section {
          padding: 28px 0;
        }

        .svc-section-head {
          max-width: 760px;
          margin-bottom: 18px;
        }

        .svc-section h2 {
          margin: 0;
          color: #111827;
          font-size: 28px;
          font-weight: 950;
          line-height: 1.15;
        }

        .svc-section p {
          margin: 8px 0 0;
          color: #5B6472;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.65;
        }

        .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .svc-card {
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
          padding: 18px;
        }

        .svc-card h3 {
          margin: 0;
          color: #111827;
          font-size: 17px;
          font-weight: 950;
        }

        .svc-card p {
          margin-top: 9px;
          font-size: 14px;
        }

        .svc-flow {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }

        .svc-step {
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
          padding: 16px;
        }

        .svc-step-num {
          width: 30px;
          height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #111827;
          color: #fff;
          font-size: 12px;
          font-weight: 950;
        }

        .svc-step p {
          margin-top: 12px;
          color: #111827;
          font-size: 14px;
          font-weight: 850;
          line-height: 1.45;
        }

        .svc-partner {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 0.75fr);
          gap: 16px;
          align-items: stretch;
          border: 1px solid #D6E6D9;
          border-radius: 8px;
          background: #F4FBF5;
          padding: 22px;
        }

        .svc-list {
          display: grid;
          gap: 8px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .svc-list li {
          border: 1px solid #DCEBDD;
          border-radius: 8px;
          background: #fff;
          padding: 10px 12px;
          color: #16513D;
          font-size: 14px;
          font-weight: 850;
        }

        .svc-contact {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          align-items: center;
          margin: 28px 0 54px;
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
          padding: 22px;
        }

        .svc-contact h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 950;
        }

        .svc-contact p {
          margin: 7px 0 0;
          color: #5B6472;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.6;
        }

        @media (max-width: 980px) {
          .svc-hero,
          .svc-partner,
          .svc-contact {
            grid-template-columns: 1fr;
          }

          .svc-grid,
          .svc-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .svc-flow {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .svc-wrap {
            width: min(100% - 24px, 1180px);
          }

          .svc-hero {
            padding-top: 30px;
          }

          .svc-title {
            font-size: 36px;
          }

          .svc-lede {
            font-size: 16px;
          }

          .svc-grid,
          .svc-strip,
          .svc-flow {
            grid-template-columns: 1fr;
          }

          .svc-actions {
            display: grid;
          }

          .svc-contact {
            margin-bottom: 86px;
          }
        }
      `}</style>

      <main className="svc-page">
        <div className="svc-wrap">
          <section className="svc-hero">
            <div>
              <span className="svc-kicker">Hubballi-Dharwad property services</span>
              <h1 className="svc-title">Listings, agreements, visits, and local property support.</h1>
              <p className="svc-lede">
                HubliDharwad.app helps tenants, buyers, owners, brokers, and local property promoters move from enquiry to next step with verified property information and direct coordination.
              </p>
              <div className="svc-actions">
                <a className="svc-btn" href={whatsappHref(serviceMessage)} target="_blank" rel="noopener noreferrer">
                  WhatsApp us
                </a>
                <Link className="svc-btn-light" href="/list">
                  List property
                </Link>
                <Link className="svc-btn-light" href="/find">
                  Post requirement
                </Link>
              </div>
            </div>

            <div className="svc-hero-media">
              <Image src="/images/home-hero-property.png" alt="Verified Hubballi-Dharwad property listing preview" width={820} height={620} priority />
            </div>
          </section>

          <div className="svc-strip" aria-label="Service highlights">
            <div className="svc-strip-item">
              <div className="svc-strip-label">For seekers</div>
              <div className="svc-strip-value">Rent, buy, and visits</div>
            </div>
            <div className="svc-strip-item">
              <div className="svc-strip-label">For owners</div>
              <div className="svc-strip-value">List and find demand</div>
            </div>
            <div className="svc-strip-item">
              <div className="svc-strip-label">For partners</div>
              <div className="svc-strip-value">Brokers and promoters welcome</div>
            </div>
          </div>

          <section className="svc-section">
            <div className="svc-section-head">
              <h2>Services we help with</h2>
              <p>One local team for property discovery, listing support, rental agreement coordination, and follow-up.</p>
            </div>
            <div className="svc-grid">
              {services.map((service) => (
                <article className="svc-card" key={service.title}>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="svc-section">
            <div className="svc-section-head">
              <h2>How the workflow works</h2>
              <p>We keep the process simple so owners, seekers, and partners know what happens after they contact us.</p>
            </div>
            <div className="svc-flow">
              {workflow.map((step, index) => (
                <div className="svc-step" key={step}>
                  <span className="svc-step-num">{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="svc-section">
            <div className="svc-partner">
              <div>
                <h2>List or partner with us</h2>
                <p>
                  Owners, brokers, Instagram property promoters, and local agents are welcome to share verified properties with us. If you have rental, sale, commercial, PG, or land listings in Hubballi-Dharwad, we can help you reach active local tenants and buyers.
                </p>
                <div className="svc-actions">
                  <a className="svc-btn" href={whatsappHref(partnerMessage)} target="_blank" rel="noopener noreferrer">
                    Partner on WhatsApp
                  </a>
                  <Link className="svc-btn-light" href="/list">
                    Submit property
                  </Link>
                </div>
              </div>
              <ul className="svc-list" aria-label="Partner types">
                {partners.map((partner) => (
                  <li key={partner}>{partner}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="svc-contact">
            <div>
              <h2>Need property help in Hubballi-Dharwad?</h2>
              <p>
                Contact us for listings, rental agreements, requirements, visit coordination, or partner/property listing support.
              </p>
            </div>
            <div className="svc-actions">
              <a className="svc-btn" href={whatsappHref(serviceMessage)} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
              <a className="svc-btn-light" href={'tel:+' + WHATSAPP_NUMBER}>
                Call us
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
