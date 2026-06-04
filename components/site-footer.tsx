import Image from 'next/image'
import Link from 'next/link'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'

const footerLinks = [
  { href: '/rent', label: 'Rentals' },
  { href: '/sale', label: 'Buy' },
  { href: '/find', label: 'Find my home' },
  { href: '/list', label: 'List property' },
]

const WA_ICON = (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I need help with a property in Hubballi.')}`

  return (
    <>
      <style>{`
        .sf-root {
          border-top: 1px solid #EAE4DE;
          background: #FFF4E6;
          color: #7A6E68;
          font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif;
        }

        .sf-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 28px 20px;
        }

        .sf-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid #EAE4DE;
        }

        .sf-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          color: inherit;
          text-decoration: none;
        }

        .sf-brand-mark {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          overflow: hidden;
          border: 1px solid rgba(24,18,14,0.08);
          border-radius: 9px;
        }

        .sf-brand-name {
          display: block;
          color: #18120E;
          font-size: 16px;
          font-weight: 800;
          line-height: 1;
          white-space: nowrap;
        }

        .sf-brand-name span {
          color: #C2440E;
        }

        .sf-brand-sub {
          display: block;
          margin-top: 4px;
          color: #7A6E68;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }

        .sf-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          flex-wrap: wrap;
        }

        .sf-link {
          border-radius: 8px;
          padding: 8px 10px;
          color: #3A2E28;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.12s, color 0.12s;
          white-space: nowrap;
        }

        .sf-link:hover {
          background: #FFF9F1;
          color: #C2440E;
        }

        .sf-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 40px;
          border: 1.5px solid #DCEBDD;
          border-radius: 8px;
          background: #fff;
          padding: 9px 13px;
          color: #148040;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          transition: border-color 0.14s, background 0.14s;
          white-space: nowrap;
        }

        .sf-action:hover {
          border-color: #A9D5B1;
          background: #F4FBF5;
        }

        .sf-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 14px;
          color: #7A6E68;
          font-size: 12px;
        }

        .sf-admin {
          color: #7A6E68;
          font-weight: 650;
          text-decoration: none;
        }

        .sf-admin:hover {
          color: #C2440E;
        }

        @media (max-width: 860px) {
          .sf-main {
            align-items: flex-start;
            flex-direction: column;
            gap: 16px;
          }

          .sf-nav {
            justify-content: flex-start;
          }
        }

        @media (max-width: 560px) {
          .sf-inner {
            padding: 24px 12px;
          }

          .sf-nav {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
          }

          .sf-link {
            background: #FFF9F1;
          }

          .sf-action {
            width: 100%;
          }

          .sf-bottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>

      <footer className="sf-root" role="contentinfo">
        <div className="sf-inner">
          <div className="sf-main">
            <Link href="/" className="sf-brand" aria-label="Hubli Dharwad App home">
              <div className="sf-brand-mark">
                <Image src="/icons/icon-192.png" alt="" width={36} height={36} />
              </div>
              <div>
                <span className="sf-brand-name">Hubli<span>Dharwad</span>.app</span>
                <span className="sf-brand-sub">Verified homes · Zero brokerage</span>
              </div>
            </Link>

            <nav className="sf-nav" aria-label="Footer navigation">
              {footerLinks.map(({ href, label }) => (
                <Link key={href} href={href} className="sf-link">
                  {label}
                </Link>
              ))}
            </nav>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="sf-action"
              aria-label="Chat on WhatsApp"
            >
              {WA_ICON} WhatsApp
            </a>
          </div>

          <div className="sf-bottom">
            <span>&copy; {currentYear} HubliDharwad.app. All rights reserved.</span>
            <Link href="/admin/login" className="sf-admin">
              Admin login
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
