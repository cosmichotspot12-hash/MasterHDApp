import type { Metadata } from 'next'
import Link from 'next/link'
import PropertyCard, { PropertyCardStyles } from '@/components/property-card'
import { getPublicListings } from '@/lib/listings-data'
import { getPublicDemandSummary } from '@/lib/public-demand'

const HOME_PREVIEW_COUNT = 4

export const dynamic = 'force-dynamic'

async function getHomeData() {
  const [previewListings, demand] = await Promise.all([
    getPublicListings({ sort: 'recent', limit: HOME_PREVIEW_COUNT }),
    getPublicDemandSummary(),
  ])
  return { previewListings, demand }
}

function PreviewSkeleton() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#E7DED5] bg-white">
      <div className="h-[130px] animate-pulse bg-[#E7DED5] sm:h-[160px]" />
      <div className="grid gap-2 p-3">
        <span className="h-3 w-4/5 rounded bg-[#E7DED5]" />
        <span className="h-5 w-1/2 rounded bg-[#E7DED5]" />
        <span className="mt-1 h-8 rounded bg-[#E7DED5]" />
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'MasterHD – Verified Properties in Hubballi-Dharwad',
  description: 'Find verified flats, houses and plots in Hubballi-Dharwad. Browse listings, post your requirement, or list your property — personally verified, locally trusted.',
  keywords: 'properties in hubli, flats for rent in hubli, house for sale in dharwad, hubli dharwad real estate',
  openGraph: {
    title: 'MasterHD – Verified Properties in Hubballi-Dharwad',
    description: 'Personally verified property listings for Hubballi-Dharwad.',
    url: 'https://www.masterhdapp.in',
    siteName: 'MasterHD',
    locale: 'en_IN',
    type: 'website',
  },
}

const OWNER_STEPS = [
  {
    num: '01',
    title: 'Fill a short form',
    desc: 'Location, type, expected rent or price. Takes 3 minutes.',
    isPayoff: false,
  },
  {
    num: '02',
    title: 'We call you',
    desc: 'Confirm details, answer questions, and schedule our property visit.',
    isPayoff: false,
  },
  {
    num: '03',
    title: 'We visit & shoot',
    desc: 'We visit your property, verify every detail, and create a full video tour.',
    isPayoff: false,
  },
  {
    num: '04',
    title: 'Live on website & Instagram',
    desc: 'Your listing goes live on our platform and Instagram — reaching 300+ active seekers instantly.',
    isPayoff: true,
  },
]

const HOME_VIDEO = {
  src: '/videos/property-preview-2.mp4',
  label: 'Property walkthrough',
}

const LOCALITY_CHIPS = [
  { name: 'Navanagar',       city: 'Hubballi', pos: { top: '5%',  left: '4%'  }, anim: 1, delay: '0s',    dur: '4s'   },
  { name: 'Saptapur',        city: 'Dharwad',  pos: { top: '6%',  left: '54%' }, anim: 2, delay: '0.8s',  dur: '4.5s' },
  { name: 'Vidyanagar',      city: 'Hubballi', pos: { top: '22%', left: '14%' }, anim: 3, delay: '0.4s',  dur: '3.8s' },
  { name: 'Kalyan Nagar',    city: 'Dharwad',  pos: { top: '24%', left: '60%' }, anim: 1, delay: '1.3s',  dur: '5s'   },
  { name: 'Gokul Road',      city: 'Hubballi', pos: { top: '40%', left: '2%'  }, anim: 2, delay: '0.6s',  dur: '4.2s' },
  { name: 'Shivaji Nagar',   city: 'Dharwad',  pos: { top: '38%', left: '54%' }, anim: 3, delay: '1.7s',  dur: '3.6s' },
  { name: 'Deshpande Nagar', city: 'Hubballi', pos: { top: '55%', left: '18%' }, anim: 1, delay: '1.0s',  dur: '4.8s' },
  { name: 'PB Road',         city: 'Dharwad',  pos: { top: '58%', left: '60%' }, anim: 2, delay: '0.2s',  dur: '4s'   },
  { name: 'Keshwapur',       city: 'Hubballi', pos: { top: '73%', left: '4%'  }, anim: 3, delay: '1.5s',  dur: '4.4s' },
  { name: 'Hosur',           city: 'Hubballi', pos: { top: '71%', left: '46%' }, anim: 1, delay: '0.9s',  dur: '3.9s' },
  { name: 'Unkal',           city: 'Hubballi', pos: { top: '86%', left: '12%' }, anim: 2, delay: '0.3s',  dur: '4.6s' },
  { name: 'Anjaneya Nagar',  city: 'Dharwad',  pos: { top: '83%', left: '55%' }, anim: 3, delay: '1.2s',  dur: '4.1s' },
]

export default async function HomePage() {
  const { previewListings, demand } = await getHomeData()

  return (
    <>
      <PropertyCardStyles />
      <style>{`
        @keyframes hd-live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(20,128,64,0.34); }
          55% { opacity: .72; transform: scale(.86); box-shadow: 0 0 0 7px rgba(20,128,64,0); }
        }
        .hd-home-section {
          padding-left: 20px;
          padding-right: 20px;
        }

        .hd-section-panel {
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
          padding: 18px;
        }

        .hd-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 14px;
        }

        .hd-section-kicker {
          display: inline-flex;
          width: fit-content;
          border: 1px solid #DCEBDD;
          border-radius: 999px;
          background: #F4FBF5;
          padding: 6px 10px;
          color: #14724B;
          font-size: 11px;
          font-weight: 900;
        }

        .hd-section-title {
          margin: 9px 0 0;
          color: #111827;
          font-size: 28px;
          font-weight: 950;
          line-height: 1.1;
        }

        .hd-section-copy {
          margin: 6px 0 0;
          max-width: 620px;
          color: #5B6472;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.55;
        }

        .hd-section-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .hd-section-btn,
        .hd-section-btn-light {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 9px 14px;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
        }

        .hd-section-btn {
          border: 1px solid #111827;
          background: #111827;
          color: #fff;
        }

        .hd-section-btn-light {
          border: 1px solid #E4DED6;
          background: #FFF9F1;
          color: #111827;
        }

        .hd-process {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: 0;
          overflow: hidden;
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
        }

        .hd-process-intro {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 28px;
          border-right: 1px solid #EDE6DE;
          background: #FFF9F1;
          padding: 28px;
        }

        .hd-process-eyebrow {
          display: inline-flex;
          width: fit-content;
          border: 1px solid #D8C9BA;
          border-radius: 999px;
          background: #fff;
          padding: 6px 10px;
          color: #9F4A22;
          font-size: 11px;
          font-weight: 950;
        }

        .hd-process-title {
          margin: 12px 0 0;
          color: #111827;
          font-size: clamp(28px, 3.2vw, 44px);
          font-weight: 950;
          line-height: 1.04;
        }

        .hd-process-copy {
          margin: 12px 0 0;
          max-width: 520px;
          color: #5B6472;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.7;
        }

        .hd-process-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .hd-process-primary,
        .hd-process-secondary {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
        }

        .hd-process-primary {
          border: 1px solid #111827;
          background: #111827;
          color: #fff;
        }

        .hd-process-secondary {
          border: 1px solid #D8C9BA;
          background: #fff;
          color: #111827;
        }

        .hd-process-rail {
          display: grid;
          background: #fff;
        }

        .hd-process-step {
          display: grid;
          grid-template-columns: 72px minmax(0, 1fr);
          gap: 18px;
          align-items: start;
          border-bottom: 1px solid #F0EBE5;
          padding: 24px 28px;
        }

        .hd-process-step:last-child {
          border-bottom: 0;
        }

        .hd-process-num {
          color: #CBD5E1;
          font-size: 34px;
          font-weight: 950;
          line-height: 1;
        }

        .hd-process-step h3 {
          margin: 0;
          color: #111827;
          font-size: 20px;
          font-weight: 950;
          line-height: 1.2;
        }

        .hd-process-step p {
          margin: 7px 0 0;
          color: #5B6472;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.65;
        }

        .hd-process-note {
          margin: 0;
          border-top: 1px solid #EDE6DE;
          padding-top: 16px;
          color: #7A6E68;
          font-size: 13px;
          font-weight: 750;
          line-height: 1.6;
        }

        .hd-owner-desk {
          overflow: hidden;
          border-radius: 8px;
          background: #111827;
          color: #fff;
        }

        .hd-owner-top {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
          gap: 28px;
          align-items: end;
          padding: 30px;
        }

        .hd-owner-eyebrow {
          display: inline-flex;
          width: fit-content;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          padding: 6px 10px;
          color: #D8C9BA;
          font-size: 11px;
          font-weight: 950;
        }

        .hd-owner-title {
          margin: 12px 0 0;
          max-width: 700px;
          font-size: clamp(30px, 4vw, 54px);
          font-weight: 950;
          line-height: 1.02;
          color: #fff;
        }

        .hd-owner-copy {
          margin: 14px 0 0;
          max-width: 620px;
          color: #CBD5E1;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.75;
        }

        .hd-owner-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 22px;
        }

        .hd-owner-primary,
        .hd-owner-secondary {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
        }

        .hd-owner-primary {
          border: 1px solid #fff;
          background: #fff;
          color: #111827;
        }

        .hd-owner-secondary {
          border: 1px solid rgba(255,255,255,0.24);
          background: transparent;
          color: #fff;
        }

        .hd-owner-summary {
          display: grid;
          gap: 10px;
        }

        .hd-owner-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          padding: 13px 14px;
        }

        .hd-owner-summary-row span:first-child {
          color: #CBD5E1;
          font-size: 13px;
          font-weight: 750;
        }

        .hd-owner-summary-row span:last-child {
          color: #fff;
          font-size: 13px;
          font-weight: 950;
          text-align: right;
        }

        .hd-owner-flow {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border-top: 1px solid rgba(255,255,255,0.12);
        }

        .hd-owner-flow-item {
          min-height: 172px;
          border-right: 1px solid rgba(255,255,255,0.12);
          padding: 20px;
        }

        .hd-owner-flow-item:last-child {
          border-right: 0;
        }

        .hd-owner-flow-num {
          color: #94A3B8;
          font-size: 12px;
          font-weight: 950;
        }

        .hd-owner-flow-title {
          margin: 18px 0 0;
          color: #fff;
          font-size: 17px;
          font-weight: 950;
          line-height: 1.2;
        }

        .hd-owner-flow-copy {
          margin: 8px 0 0;
          color: #CBD5E1;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.6;
        }

        .hd-close-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 0.62fr);
          gap: 14px;
        }

        .hd-need-band,
        .hd-social-band {
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
          padding: 24px;
        }

        .hd-need-band {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
        }

        .hd-band-eyebrow {
          color: #7A6E68;
          font-size: 11px;
          font-weight: 950;
        }

        .hd-band-title {
          margin: 8px 0 0;
          color: #111827;
          font-size: 28px;
          font-weight: 950;
          line-height: 1.1;
        }

        .hd-band-copy {
          margin: 8px 0 0;
          max-width: 620px;
          color: #5B6472;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.65;
        }

        .hd-band-btn,
        .hd-band-btn-light {
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 950;
          text-decoration: none;
          white-space: nowrap;
        }

        .hd-band-btn {
          border: 1px solid #111827;
          background: #111827;
          color: #fff;
        }

        .hd-band-btn-light {
          border: 1px solid #E4DED6;
          background: #FFF9F1;
          color: #111827;
        }

        .hd-premium-hero {
          padding: 18px 20px 18px;
        }

        .hd-premium-hero-shell {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(390px, 0.72fr);
          gap: 16px;
          align-items: stretch;
          overflow: hidden;
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #fff;
          padding: 20px;
        }

        .hd-premium-copy {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 22px;
          border-radius: 8px;
          background: #FFF9F1;
          padding: 26px;
        }

        .hd-premium-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          border: 1px solid #CDB49C;
          border-radius: 999px;
          background: linear-gradient(135deg, #111827 0%, #33251C 100%);
          padding: 6px 12px 6px 7px;
          color: #FFF7ED;
          font-size: 11px;
          font-weight: 950;
          box-shadow: 0 10px 24px rgba(17,24,39,0.12);
        }

        .hd-premium-eyebrow strong {
          border-radius: 999px;
          background: #FFF7ED;
          padding: 4px 8px;
          color: #9F4A22;
          font-weight: 950;
        }

        .hd-premium-eyebrow span {
          color: #F8E6D5;
        }

        .hd-premium-title {
          margin: 14px 0 0;
          max-width: 760px;
          color: #111827;
          font-size: clamp(38px, 5vw, 66px);
          font-weight: 950;
          line-height: 0.98;
        }

        .hd-premium-copy-text {
          margin: 16px 0 0;
          max-width: 620px;
          color: #5B6472;
          font-size: 16px;
          font-weight: 650;
          line-height: 1.75;
        }

        .hd-premium-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
        }

        .hd-premium-btn,
        .hd-premium-btn-light {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          padding: 11px 16px;
          font-size: 14px;
          font-weight: 950;
          text-decoration: none;
        }

        .hd-premium-btn {
          border: 1px solid #111827;
          background: #111827;
          color: #fff;
          box-shadow: 0 12px 24px rgba(17,24,39,0.16);
        }

        .hd-premium-btn-light {
          border: 1px solid #D8C9BA;
          background: rgba(255,255,255,0.7);
          color: #33251C;
        }

        .hd-premium-btn-light:hover {
          border-color: #BFA58B;
          background: #fff;
        }

        .hd-premium-demand {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 10px;
          align-items: center;
          overflow: hidden;
          border: 1px solid #E4DED6;
          border-left: 3px solid #A95424;
          border-radius: 8px;
          background:
            linear-gradient(135deg, #FFFFFF 0%, #FFF9F1 100%),
            radial-gradient(circle at 94% 8%, rgba(169,84,36,.12), transparent 32%);
          padding: 12px;
          color: #111827;
          text-decoration: none;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.78);
        }

        .hd-premium-demand:hover {
          border-color: #D8C9BA;
          background:
            linear-gradient(135deg, #FFFFFF 0%, #FFF4E6 100%),
            radial-gradient(circle at 94% 8%, rgba(169,84,36,.16), transparent 32%);
        }

        .hd-demand-live {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #9F4A22;
          font-size: 10.5px;
          font-weight: 950;
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        .hd-demand-dot {
          width: 8px;
          height: 8px;
          flex: 0 0 auto;
          border-radius: 999px;
          background: #C95F2C;
          animation: hd-live-pulse 1.35s ease-in-out infinite;
        }

        .hd-demand-main {
          margin-top: 5px;
          color: #111827;
          font-size: 16px;
          font-weight: 950;
          line-height: 1.12;
        }

        .hd-demand-sub {
          margin-top: 4px;
          color: #64748B;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.35;
        }

        .hd-demand-action {
          display: inline-flex;
          min-height: 34px;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #111827;
          padding: 8px 10px;
          color: #fff;
          font-size: 11px;
          font-weight: 950;
          white-space: nowrap;
        }

        .hd-premium-stage {
          display: grid;
          grid-template-rows: auto auto;
          gap: 12px;
          min-width: 0;
        }

        .hd-premium-feature {
          display: grid;
          gap: 12px;
        }

        .hd-premium-console {
          display: grid;
          gap: 12px;
          height: 100%;
          border: 1px solid #D8C9BA;
          border-radius: 8px;
          background: linear-gradient(180deg, #FFF9F1 0%, #FFFFFF 100%);
          padding: 14px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 18px 36px rgba(58,46,40,0.08);
        }

        .hd-premium-video-card {
          position: relative;
          overflow: hidden;
          border: 1px solid #E4DED6;
          border-radius: 8px;
          background: #F3E8DC;
        }

        .hd-premium-video-card video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hd-premium-video-card::after {
          position: absolute;
          inset: 0;
          content: '';
          background: linear-gradient(180deg, rgba(17,24,39,0.04) 30%, rgba(17,24,39,0.72) 100%);
          pointer-events: none;
        }

        .hd-premium-video-card {
          height: clamp(300px, 32vw, 430px);
          min-height: 0;
        }

        .hd-premium-video-label {
          position: absolute;
          right: 12px;
          bottom: 12px;
          left: 12px;
          z-index: 1;
          color: #fff;
          font-size: 13px;
          font-weight: 950;
          line-height: 1.35;
        }

        .hd-premium-localities {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 0;
          scrollbar-width: none;
        }

        .hd-premium-localities::-webkit-scrollbar {
          display: none;
        }

        .hd-premium-chip {
          flex: 0 0 auto;
          border: 1px solid #E4DED6;
          border-radius: 999px;
          background: #fff;
          padding: 9px 12px;
          color: #334155;
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
        }

        .hd-premium-chip:nth-child(3n + 1) {
          background: #111827;
          border-color: #111827;
          color: #fff;
        }

        .hd-premium-chip:nth-child(3n + 2) {
          background: #FFF4E6;
          color: #9F4A22;
        }

        .hd-premium-chip:hover {
          border-color: #D8C9BA;
          background: #FFF9F1;
          color: #111827;
        }

        .hd-social-band {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
        }

        .hd-social-mark {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: linear-gradient(135deg, #F9A825 0%, #E91E8C 52%, #9C27B0 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 950;
        }

        @media (max-width: 640px) {
          .hd-home-section { padding-left: 12px; padding-right: 12px; }
          .hd-section-panel { padding: 12px; }
          .hd-section-head { align-items: stretch; flex-direction: column; gap: 12px; }
          .hd-section-title { font-size: 24px; }
          .hd-section-copy { font-size: 13px; }
          .hd-section-actions { display: grid; grid-template-columns: 1fr 1fr; }
          .hd-section-btn,
          .hd-section-btn-light { width: 100%; }
          .hd-process { grid-template-columns: 1fr; }
          .hd-process-intro { border-right: 0; border-bottom: 1px solid #EDE6DE; padding: 18px; }
          .hd-process-title { font-size: 28px; }
          .hd-process-copy { font-size: 14px; }
          .hd-process-actions { display: grid; grid-template-columns: 1fr 1fr; }
          .hd-process-primary,
          .hd-process-secondary { width: 100%; }
          .hd-process-step {
            grid-template-columns: 44px minmax(0, 1fr);
            gap: 12px;
            padding: 18px;
          }
          .hd-process-num { font-size: 25px; }
          .hd-process-step h3 { font-size: 17px; }
          .hd-process-step p { font-size: 13px; }
          .hd-owner-top { grid-template-columns: 1fr; padding: 20px; }
          .hd-owner-title { font-size: 30px; }
          .hd-owner-copy { font-size: 14px; }
          .hd-owner-actions { display: grid; grid-template-columns: 1fr 1fr; }
          .hd-owner-primary,
          .hd-owner-secondary { width: 100%; }
          .hd-owner-flow { grid-template-columns: 1fr; }
          .hd-owner-flow-item {
            min-height: 0;
            border-right: 0;
            border-bottom: 1px solid rgba(255,255,255,0.12);
            padding: 18px 20px;
          }
          .hd-owner-flow-item:last-child { border-bottom: 0; }
          .hd-close-grid { grid-template-columns: 1fr; }
          .hd-need-band { align-items: stretch; flex-direction: column; padding: 18px; }
          .hd-social-band { padding: 18px; }
          .hd-band-title { font-size: 24px; }
          .hd-band-btn,
          .hd-band-btn-light { width: 100%; }
          .hd-premium-hero { padding: 12px; }
          .hd-premium-hero-shell {
            grid-template-columns: 1fr;
            gap: 10px;
            padding: 12px;
          }
          .hd-premium-copy {
            gap: 13px;
            padding: 16px;
          }
          .hd-premium-eyebrow {
            padding: 5px 10px 5px 6px;
            font-size: 10px;
          }
          .hd-premium-eyebrow strong {
            padding: 3px 7px;
          }
          .hd-premium-title {
            margin-top: 12px;
            font-size: 31px;
            line-height: 1.03;
          }
          .hd-premium-copy-text {
            margin-top: 12px;
            font-size: 14px;
            line-height: 1.55;
          }
          .hd-premium-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 14px;
          }
          .hd-premium-actions a:nth-child(3) {
            display: none;
          }
          .hd-premium-btn,
          .hd-premium-btn-light {
            width: 100%;
            min-height: 42px;
            padding: 10px 12px;
            font-size: 13px;
          }
          .hd-premium-demand {
            gap: 8px;
            padding: 10px;
          }
          .hd-demand-main {
            font-size: 14px;
          }
          .hd-demand-sub {
            font-size: 10.5px;
          }
          .hd-demand-action {
            min-height: 30px;
            padding: 7px 8px;
            font-size: 10px;
          }
          .hd-premium-feature {
            grid-template-columns: 1fr;
            min-height: 0;
          }
          .hd-premium-console {
            gap: 9px;
            padding: 10px;
          }
          .hd-premium-video-card {
            height: 178px;
          }
          .hd-premium-video-label {
            right: 10px;
            bottom: 10px;
            left: 10px;
            font-size: 11.5px;
            line-height: 1.3;
          }
          .hd-premium-localities {
            gap: 6px;
            padding-bottom: 1px;
          }
          .hd-premium-chip {
            padding: 7px 9px;
            font-size: 11px;
          }
        }

        /* Very small phones: a 2-up grid gets too cramped — fall back to 1 column */
        @media (max-width: 359px) {
          .hd-listings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <main className="min-h-screen bg-[#FFF4E6] text-slate-950">

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="hd-premium-hero" aria-label="Hero">
          <div className="mx-auto w-full max-w-[1520px]">
            <div className="hd-premium-hero-shell">
              <div className="hd-premium-copy">
                <div>
                  <span className="hd-premium-eyebrow">
                    <strong data-i18n="hero_area">Hubballi-Dharwad</strong>
                    <span data-i18n="hero_support">verified local support</span>
                  </span>
                  <h1 className="hd-premium-title" data-i18n="hero_title">
                    Hubballi-Dharwad&apos;s property marketplace.
                  </h1>
                  <p className="hd-premium-copy-text" data-i18n="hero_copy">
                    Browse rent and sale listings, post your requirement, or list your property with local verification, video walkthroughs, and organised visit support.
                  </p>
                  <div className="hd-premium-actions">
                    <Link href="/properties" className="hd-premium-btn" data-i18n="action_browse_properties">
                      Browse properties
                    </Link>
                    <Link href="/find" className="hd-premium-btn-light" data-i18n="nav_post_requirement">
                      Post requirement
                    </Link>
                    <Link href="/list" className="hd-premium-btn-light" data-i18n="nav_list_property">
                      List property
                    </Link>
                  </div>
                </div>

                <Link href="/list" className="hd-premium-demand" aria-label="Live local demand. List your property">
                  <div>
                    <div className="hd-demand-live">
                      <span className="hd-demand-dot" aria-hidden />
                      Live local demand
                    </div>
                    <div className="hd-demand-main">
                      {demand.totalActive} active property requirements
                    </div>
                    <div className="hd-demand-sub">
                      {[
                        demand.rentTotal > 0 ? `${demand.rentTotal} rent seekers` : '',
                        demand.saleTotal > 0 ? `${demand.saleTotal} buyers` : '',
                        demand.leaseTotal > 0 ? `${demand.leaseTotal} lease seekers` : '',
                      ]
                        .filter(Boolean)
                        .join(' · ') || 'Verified seekers across Hubballi-Dharwad'}
                    </div>
                  </div>
                  <span className="hd-demand-action">List property</span>
                </Link>
              </div>

              <div className="hd-premium-stage">
                <div className="hd-premium-console">
                  <div className="hd-premium-video-card">
                    <video src={HOME_VIDEO.src} poster="/images/home-hero-property.png" autoPlay muted loop playsInline preload="metadata" aria-label={HOME_VIDEO.label} />
                    <div className="hd-premium-video-label" data-i18n="hero_video_label">Video walkthroughs before visits.</div>
                  </div>

                  <div className="hd-premium-localities" aria-label="Popular localities">
                    {LOCALITY_CHIPS.slice(0, 8).map((chip) => (
                      <Link key={chip.name} href={`/properties?locality=${encodeURIComponent(chip.name)}`} className="hd-premium-chip">
                        {chip.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ── LISTINGS GRID ─────────────────────────────────────────── */}
        <section className="hd-home-section pb-5 sm:pb-7" aria-label="Recent listings">
          <div className="mx-auto w-full max-w-[1520px]">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
              <p className="hd-section-kicker">
                Recently verified
              </p>
              <h2 className="hd-section-title">Fresh properties you can visit.</h2>
              <p className="hd-section-copy">
                New rent and sale listings with photos, locality, price, and visit requests in one place.
              </p>
              </div>
              <Link href="/properties" className="hd-section-btn">
                View all →
              </Link>
            </div>
            <div className="hd-listings-grid grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
              {previewListings.length > 0
                ? previewListings.map((listing) => (
                    <PropertyCard key={listing.id} listing={listing} />
                  ))
                : Array.from({ length: HOME_PREVIEW_COUNT }).map((_, i) => (
                    <PreviewSkeleton key={i} />
                  ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
        <section className="hd-home-section py-8 sm:py-12" aria-label="How it works">
          <div className="mx-auto w-full max-w-[1520px]">
            <div className="mb-10">
              <div className="hd-process">
                <div className="hd-process-intro">
                  <div>
                    <span className="hd-process-eyebrow">How it works</span>
                    <h2 className="hd-process-title">
                      Less chasing. More clarity.
                    </h2>
                    <p className="hd-process-copy">
                      We keep the property search practical: verified details first, video before travel, and one organised visit request when you are ready.
                    </p>
                  </div>
                  <div>
                    <div className="hd-process-actions">
                      <Link href="/properties" className="hd-process-primary">
                        Browse properties
                      </Link>
                      <Link href="/find" className="hd-process-secondary">
                        Post requirement
                      </Link>
                    </div>
                    <p className="hd-process-note">
                      Built for Hubballi-Dharwad seekers who want fewer random calls and better property decisions.
                    </p>
                  </div>
                </div>

                <div className="hd-process-rail">
                  <div className="hd-process-step">
                    <span className="hd-process-num">01</span>
                    <div>
                      <h3>Start with verified options</h3>
                      <p>Browse listings with clear locality, pricing, photos, BHK, category, and visit action without digging through chats.</p>
                    </div>
                  </div>
                  <div className="hd-process-step">
                    <span className="hd-process-num">02</span>
                    <div>
                      <h3>Shortlist before stepping out</h3>
                      <p>Use photos, video walkthroughs, and listing details to decide whether the property is worth your time.</p>
                    </div>
                  </div>
                  <div className="hd-process-step">
                    <span className="hd-process-num">03</span>
                    <div>
                      <h3>Send one visit request</h3>
                      <p>Choose the property you like and request a visit. We collect the details and coordinate the next step.</p>
                    </div>
                  </div>
                  <div className="hd-process-step">
                    <span className="hd-process-num">04</span>
                    <div>
                      <h3>Get local follow-up</h3>
                      <p>If you do not find the right property, post your requirement and we match it with current and incoming listings.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* ── OWNERS ── */}
            <div className="hd-owner-desk">
              <div className="hd-owner-top">
                <div>
                  <span className="hd-owner-eyebrow">For property owners</span>
                  <h3 className="hd-owner-title">
                    Share the property once. We turn it into a serious listing.
                  </h3>
                  <p className="hd-owner-copy">
                    Owners, brokers, builders, and local promoters can send property details to us. We verify the basics, prepare the listing, and help coordinate serious enquiries instead of scattered calls.
                  </p>
                  <div className="hd-owner-actions">
                    <Link href="/list" className="hd-owner-primary">
                      Submit property
                    </Link>
                    <Link href="/services" className="hd-owner-secondary">
                      Services
                    </Link>
                  </div>
                </div>
                <div className="hd-owner-summary" aria-label="Owner support summary">
                  <div className="hd-owner-summary-row">
                    <span>Accepted listings</span>
                    <span>Rent, sale, commercial, PG, land</span>
                  </div>
                  <div className="hd-owner-summary-row">
                    <span>Who can list</span>
                    <span>Owners, brokers, agents, promoters</span>
                  </div>
                  <div className="hd-owner-summary-row">
                    <span>Support</span>
                    <span>Details, photos, visits, follow-up</span>
                  </div>
                </div>
              </div>
              <div className="hd-owner-flow">
                {OWNER_STEPS.map(({ num, title, desc }) => (
                  <div className="hd-owner-flow-item" key={num}>
                    <p className="hd-owner-flow-num">{num}</p>
                    <h4 className="hd-owner-flow-title">{title}</h4>
                    <p className="hd-owner-flow-copy">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── POST YOUR REQUIREMENT — CTA BAND ─────────────────────── */}
        <section className="hd-home-section pb-5 sm:pb-7" aria-label="Next steps">
          <div className="mx-auto w-full max-w-[1520px]">
            <div className="hd-close-grid">
              <div className="hd-need-band">
                <div>
                  <p className="hd-band-eyebrow">Can&apos;t find what you need?</p>
                  <h2 className="hd-band-title">Tell us the exact property you want.</h2>
                  <p className="hd-band-copy">
                    Share your locality, budget, BHK, and timeline. We will match your need with available and incoming properties.
                  </p>
                </div>
                <Link href="/find" className="hd-band-btn">
                  Post requirement
                </Link>
              </div>

              <div className="hd-social-band">
                <div>
                  <div className="hd-social-mark" aria-label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="1.8"/>
                      <circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="1.8"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="#fff"/>
                    </svg>
                  </div>
                  <h2 className="hd-band-title">Watch before you visit.</h2>
                  <p className="hd-band-copy">
                    Follow local walkthroughs, updates, and new property previews across Hubballi-Dharwad.
                  </p>
                </div>
                <a
                  href="https://www.instagram.com/hublidharwad.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hd-band-btn-light"
                >
                  Follow Instagram
                </a>
              </div>
            </div>
          </div>
        </section>


      </main>
    </>
  )
}
