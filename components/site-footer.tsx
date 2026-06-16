import Image from 'next/image'
import Link from 'next/link'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'

const footerLinks = [
  { href: '/properties?type=rent', label: 'Rent' },
  { href: '/properties?type=sale', label: 'Buy' },
  { href: '/properties?type=lease', label: 'Lease' },
  { href: '/services', label: 'Services' },
  { href: '/find', label: 'Find' },
  { href: '/list', label: 'List' },
]

const serviceLinks = [
  { href: '/services', label: 'Agreements' },
  { href: '/list', label: 'List property' },
  { href: '/find', label: 'Post requirement' },
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
          max-width: 1520px;
          margin: 0 auto;
          padding: 22px 20px 14px;
        }

        .sf-main {
          display: grid;
          grid-template-columns: minmax(260px, 1fr) minmax(360px, 0.95fr) minmax(220px, auto);
          gap: 22px;
          align-items: start;
          padding-bottom: 16px;
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
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          overflow: hidden;
          border: 1px solid rgba(24,18,14,0.08);
          border-radius: 9px;
        }

        .sf-brand-name {
          display: block;
          color: #111827;
          font-size: 15px;
          font-weight: 800;
          line-height: 1;
          white-space: nowrap;
        }

        .sf-brand-name span {
          color: #111827;
        }

        .sf-brand-sub {
          display: block;
          margin-top: 4px;
          color: #7A6E68;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
        }

        .sf-copy {
          max-width: 430px;
          margin: 10px 0 0;
          color: #6B5F58;
          font-size: 12.5px;
          font-weight: 600;
          line-height: 1.55;
        }

        .sf-link-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .sf-col-title {
          margin: 0 0 8px;
          color: #111827;
          font-size: 12px;
          font-weight: 950;
        }

        .sf-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .sf-link {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          border: 1px solid #EFE6DC;
          border-radius: 8px;
          background: rgba(255,255,255,0.58);
          padding: 6px 10px;
          color: #1F2937;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
          transition: border-color 0.12s, background 0.12s, color 0.12s;
          white-space: nowrap;
        }

        .sf-link:hover {
          border-color: #D8C9BA;
          background: #FFF9F1;
          color: #111827;
        }

        .sf-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 36px;
          border: 1.5px solid #DCEBDD;
          border-radius: 8px;
          background: #fff;
          padding: 8px 12px;
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

        .sf-contact {
          display: grid;
          justify-items: end;
          gap: 8px;
        }

        .sf-contact-note {
          max-width: 220px;
          margin: 0;
          color: #6B5F58;
          font-size: 11.5px;
          font-weight: 650;
          line-height: 1.45;
          text-align: right;
        }

        .sf-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-top: 10px;
          color: #7A6E68;
          font-size: 11.5px;
        }

        .sf-admin {
          color: #7A6E68;
          font-weight: 650;
          text-decoration: none;
        }

        .sf-admin:hover {
          color: #111827;
        }

        @media (max-width: 860px) {
          .sf-main {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .sf-link-grid {
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }

          .sf-contact {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .sf-contact-note {
            max-width: none;
            text-align: left;
          }
        }

        @media (max-width: 560px) {
          .sf-inner {
            padding: 16px 12px 12px;
          }

          .sf-main {
            gap: 14px;
            padding-bottom: 14px;
          }

          .sf-brand-mark {
            width: 32px;
            height: 32px;
            border-radius: 8px;
          }

          .sf-copy {
            margin-top: 8px;
            font-size: 12px;
            line-height: 1.5;
          }

          .sf-link-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .sf-nav {
            gap: 6px;
          }

          .sf-link {
            min-height: 30px;
            background: rgba(255,255,255,0.7);
            padding: 6px 9px;
            font-size: 12px;
          }

          .sf-action {
            width: auto;
            min-height: 34px;
            padding: 7px 11px;
          }

          .sf-contact {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }

          .sf-bottom {
            align-items: flex-start;
            flex-direction: row;
            justify-content: space-between;
            gap: 8px;
            font-size: 11px;
          }
        }
      `}</style>

      <footer className="sf-root" role="contentinfo">
        <div className="sf-inner">
          <div className="sf-main">
            <div>
              <Link href="/" className="sf-brand" aria-label="Hubli Dharwad App home">
                <div className="sf-brand-mark">
                  <Image src="/icons/icon-192.png" alt="" width={34} height={34} />
                </div>
                <div>
                  <span className="sf-brand-name">Hubli<span>Dharwad</span>.app</span>
                  <span className="sf-brand-sub" data-i18n="footer_verified">Verified Properties</span>
                </div>
              </Link>
              <p className="sf-copy" data-i18n="footer_copy">
                Verified listings, agreement help, visit coordination, and local support for Hubballi-Dharwad.
              </p>
            </div>

            <div className="sf-link-grid">
              <div>
                <p className="sf-col-title" data-i18n="footer_browse">Browse</p>
                <nav className="sf-nav" aria-label="Footer navigation">
                  {footerLinks.map(({ href, label }) => (
                    <Link key={href} href={href} className="sf-link" data-i18n={label === 'Rent' ? 'nav_rent' : label === 'Buy' ? 'nav_buy' : label === 'Lease' ? 'nav_lease' : label === 'Services' ? 'nav_services' : label === 'Find' ? 'form_requirement_title' : 'nav_list_property'}>
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div>
                <p className="sf-col-title" data-i18n="nav_services">Services</p>
                <nav className="sf-nav" aria-label="Footer services">
                  {serviceLinks.map(({ href, label }) => (
                    <Link key={label} href={href} className="sf-link" data-i18n={label === 'Agreements' ? 'footer_agreements' : label === 'List property' ? 'nav_list_property' : 'nav_post_requirement'}>
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            <div className="sf-contact">
              <p className="sf-col-title" data-i18n="footer_contact">Contact</p>
              <p className="sf-contact-note" data-i18n="footer_contact_note">Need help with a property, agreement, listing, or visit?</p>
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
          </div>

          <div className="sf-bottom">
            <span>&copy; {currentYear} <span data-i18n="footer_rights">HubliDharwad.app. All rights reserved.</span></span>
            <Link href="/admin/login" className="sf-admin">
              Admin login
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
