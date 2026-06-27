import type { Metadata } from 'next'
import Link from 'next/link'
import PropertyCard, { PropertyCardStyles } from '@/components/property-card'
import { getPublicListings } from '@/lib/listings-data'
import { getPublicDemandSummary } from '@/lib/public-demand'

const HOME_PREVIEW_COUNT = 4

export const dynamic = 'force-dynamic'

async function getHomeData() {
  const [previewListings, allListings, demand] = await Promise.all([
    getPublicListings({ sort: 'recent', limit: HOME_PREVIEW_COUNT }),
    getPublicListings({ sort: 'recent' }),
    getPublicDemandSummary(),
  ])
  return {
    previewListings,
    totalListings: allListings.length || previewListings.length,
    demand,
  }
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
  const { previewListings, totalListings, demand } = await getHomeData()

  return (
    <>
      <PropertyCardStyles />
      <style>{`
        @keyframes hd-float {
          0%, 100% { transform: perspective(900px) rotateX(5deg) rotateY(-8deg) translateY(0px); }
          50%       { transform: perspective(900px) rotateX(5deg) rotateY(-8deg) translateY(-16px); }
        }
        @keyframes hd-drift-green {
          0%, 100% { transform: translate(0,0) scale(1); }
          40%      { transform: translate(40px,-28px) scale(1.06); }
          70%      { transform: translate(-20px,16px) scale(0.96); }
        }
        @keyframes hd-drift-indigo {
          0%, 100% { transform: translate(0,0) scale(1); }
          35%      { transform: translate(-28px,22px) scale(1.04); }
          70%      { transform: translate(22px,-16px) scale(0.97); }
        }
        @keyframes hd-badge-a {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes hd-badge-b {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes hd-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hd-live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(20,128,64,0.34); }
          55% { opacity: .72; transform: scale(.86); box-shadow: 0 0 0 7px rgba(20,128,64,0); }
        }
        .hd-shine::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          background: linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%);
          opacity: 0;
          transition: opacity 0.35s;
        }
        .hd-shine:hover::before { opacity: 1; }

        @keyframes hd-chip-1 {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes hd-chip-2 {
          0%, 100% { transform: translateY(0px) rotate(1.5deg); }
          40%      { transform: translateY(-8px) rotate(-0.8deg); }
          75%      { transform: translateY(-3px) rotate(0.5deg); }
        }
        @keyframes hd-chip-3 {
          0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
          35%      { transform: translateY(-12px) rotate(1.5deg); }
          70%      { transform: translateY(-4px) rotate(-1deg); }
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
          .hd-hero-section { padding: 14px 12px 12px; }
          .hd-hero-shell { border-radius: 8px !important; box-shadow: none !important; }
          .hd-hero-content { grid-template-columns: 1fr !important; padding: 22px 18px 24px !important; gap: 0 !important; min-height: 0 !important; }
          .hd-hero-left { text-align: left; }
          .hd-hero-kicker { width: fit-content; margin-bottom: 12px !important; }
          .hd-hero-title { margin-bottom: 14px !important; font-size: 29px !important; line-height: 1.1 !important; }
          .hd-hero-trust { margin-bottom: 18px !important; display: grid; gap: 8px; text-align: left; }
          .hd-hero-trust li { font-size: 13px !important; }
          .hd-hero-actions { display: grid !important; grid-template-columns: 1fr; gap: 8px !important; }
          .hd-hero-actions a { width: 100%; border-radius: 8px !important; }
          .hd-hero-owner { text-align: left; }
          .hd-chips-col {
            display: flex !important;
            gap: 8px;
            margin-top: 18px;
            overflow-x: auto;
            padding: 2px 2px 8px;
            scrollbar-width: none;
          }
          .hd-chips-col::-webkit-scrollbar { display: none; }
          .hd-locality-chip {
            position: static !important;
            flex: 0 0 auto;
            animation: none !important;
            transform: none !important;
            box-shadow: none !important;
          }
          .hd-hero-right {
            display: flex !important;
            justify-content: stretch;
            padding: 8px 0 0 !important;
          }
          .hd-hero-right > div { width: 100%; }
          .hd-video-card {
            width: 100% !important;
            height: 168px !important;
            aspect-ratio: 16 / 9 !important;
            border-radius: 8px !important;
            animation: none !important;
            transform: none !important;
            box-shadow: none !important;
          }
          .hd-badge-outside { display: none !important; }
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

        <section className="hidden" aria-label="Legacy hero">
          <div className="mx-auto w-full max-w-[1520px]">
            <div
              className="hd-hero-shell relative overflow-hidden rounded-[20px] sm:rounded-[28px]"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #FFF9F4 55%, #FFF1DF 100%)',
                boxShadow: '0 24px 64px rgba(58,46,40,0.1)',
              }}
            >
              {/* Green orb */}
              <div aria-hidden className="pointer-events-none absolute" style={{ width: '620px', height: '620px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,158,117,0.16) 0%, transparent 70%)', bottom: '-200px', left: '-80px', animation: 'hd-drift-green 14s ease-in-out infinite' }} />
              {/* Indigo orb */}
              <div aria-hidden className="pointer-events-none absolute" style={{ width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)', top: '-120px', right: '25%', animation: 'hd-drift-indigo 18s ease-in-out infinite' }} />
              {/* Dot texture */}
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, #5a3a1a 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

              {/* Content — 3 column grid */}
              <div
                className="hd-hero-content relative z-10 items-stretch px-8 py-10 sm:px-12 sm:py-12"
                style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.4fr', gap: '0 24px', minHeight: '480px' }}
              >

                {/* Col 1 — Text */}
                <div className="hd-hero-left flex flex-col justify-center">
                  <p
                    className="hd-hero-kicker mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#C8B89A] bg-white/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B4A28] backdrop-blur-sm"
                    style={{ animation: 'hd-fade-up 0.5s ease both', width: 'fit-content' }}
                  >
                    <svg width="9" height="11" viewBox="0 0 10 12" fill="none" aria-hidden>
                      <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5zm0 6.75A1.75 1.75 0 1 1 5 3.25a1.75 1.75 0 0 1 0 3.5z" fill="currentColor" />
                    </svg>
                    Hubballi · Dharwad
                  </p>
                  <h1
                    className="hd-hero-title mb-6"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 'clamp(34px, 3.6vw, 54px)', fontWeight: 700, lineHeight: 1.07, letterSpacing: '-0.02em', color: '#0A0F1E', animation: 'hd-fade-up 0.5s 0.1s ease both' }}
                  >
                    Every home visited<br />by us.{' '}
                    <span style={{ color: '#1D9E75' }}>Before<br />you see it.</span>
                  </h1>
                  <ul className="hd-hero-trust mb-8 space-y-3" style={{ animation: 'hd-fade-up 0.5s 0.2s ease both' }}>
                    {['We visit every property before listing', 'Video tour on every listing', 'No broker — direct contact with us'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[14px] font-medium text-slate-600">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white" style={{ background: '#1D9E75' }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="hd-hero-actions flex flex-wrap items-center gap-3" style={{ animation: 'hd-fade-up 0.5s 0.3s ease both' }}>
                    <Link href="/properties" className="inline-flex h-11 items-center justify-center rounded-full px-7 text-[14px] font-bold text-white no-underline transition hover:opacity-90 active:scale-[0.97]" style={{ background: '#1D9E75', boxShadow: '0 8px 28px rgba(29,158,117,0.32)' }}>
                      Browse listings →
                    </Link>
                    <Link href="/find" className="text-[13px] font-semibold text-slate-500 no-underline underline-offset-2 hover:text-slate-800 hover:underline">
                      Post requirement →
                    </Link>
                  </div>
                  <p className="hd-hero-owner mt-3 text-[12px] text-slate-400" style={{ animation: 'hd-fade-up 0.5s 0.4s ease both' }}>
                    Own a property?{' '}
                    <Link href="/list" className="font-semibold text-slate-600 no-underline hover:underline">List it here →</Link>
                  </p>
                </div>

                {/* Col 2 — Locality chip cloud */}
                <div className="hd-chips-col relative">
                  {LOCALITY_CHIPS.map((chip) => (
                    <Link
                      key={chip.name}
                      href={`/properties?locality=${encodeURIComponent(chip.name)}`}
                      className="hd-locality-chip absolute inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold no-underline backdrop-blur-sm transition-all hover:scale-110"
                      style={{
                        ...chip.pos,
                        background: chip.city === 'Hubballi' ? 'rgba(228,246,238,0.9)' : 'rgba(237,235,255,0.9)',
                        borderColor: chip.city === 'Hubballi' ? '#A8DCC6' : '#C4BFFF',
                        color: chip.city === 'Hubballi' ? '#085041' : '#3730A3',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
                        animation: `hd-chip-${chip.anim} ${chip.dur} ease-in-out infinite ${chip.delay}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: chip.city === 'Hubballi' ? '#1D9E75' : '#4F46E5' }} />
                      {chip.name}
                    </Link>
                  ))}
                </div>

                {/* Col 3 — Phone mockup */}
                <div className="hd-hero-right flex items-center justify-center py-6">
                  <div style={{ position: 'relative' }}>
                    {/* Glow behind phone */}
                    <div aria-hidden style={{ position: 'absolute', inset: '-30px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(29,158,117,0.2) 0%, transparent 70%)', filter: 'blur(16px)', pointerEvents: 'none' }} />

                    {/* Video card */}
                    <div
                      className="hd-video-card hd-shine"
                      style={{
                        position: 'relative',
                        width: '260px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.8)',
                        boxShadow: '0 2px 6px rgba(58,46,40,0.06), 0 12px 28px rgba(58,46,40,0.12), 0 30px 60px rgba(58,46,40,0.14)',
                        animation: 'hd-float 5s ease-in-out infinite',
                        aspectRatio: '9/16',
                      }}
                    >
                      <video className="h-full w-full object-cover" src={HOME_VIDEO.src} poster="/images/home-hero-property.png" autoPlay muted loop playsInline preload="metadata" aria-label={HOME_VIDEO.label} style={{ display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)', pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center', gap: '5px', borderRadius: '20px', padding: '5px 10px', fontSize: '9px', fontWeight: 700, color: '#fff', background: 'rgba(29,158,117,0.88)', backdropFilter: 'blur(8px)', animation: 'hd-badge-a 3.5s ease-in-out infinite' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                        Personally verified
                      </div>
                      <p style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.82)', lineHeight: 1.3, margin: 0 }}>Property walkthrough</p>
                    </div>

                    {/* Floating stat badge — 300+ */}
                    <div
                      className="hd-badge-outside"
                      style={{ position: 'absolute', bottom: '-8px', right: '-48px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '14px', padding: '10px 14px', background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(220,210,200,0.7)', boxShadow: '0 8px 28px rgba(58,46,40,0.13)', backdropFilter: 'blur(12px)', animation: 'hd-badge-b 4.5s ease-in-out infinite' }}
                    >
                      <span style={{ fontSize: '22px', fontWeight: 900, lineHeight: 1, color: '#4F46E5' }}>300+</span>
                      <span style={{ fontSize: '10px', fontWeight: 500, lineHeight: 1.4, color: '#64748b' }}>Active<br />seekers</span>
                    </div>

                    {/* Floating stat badge — listings */}
                    {totalListings >= 10 && (
                      <div
                        className="hd-badge-outside"
                        style={{ position: 'absolute', top: '8px', right: '-44px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '14px', padding: '10px 14px', background: 'rgba(255,255,255,0.94)', border: '1px solid rgba(220,210,200,0.7)', boxShadow: '0 8px 28px rgba(58,46,40,0.13)', backdropFilter: 'blur(12px)', animation: 'hd-badge-b 4s ease-in-out infinite 1.2s' }}
                      >
                        <span style={{ fontSize: '22px', fontWeight: 900, lineHeight: 1, color: '#0A0F1E' }}>{totalListings}</span>
                        <span style={{ fontSize: '10px', fontWeight: 500, lineHeight: 1.4, color: '#64748b' }}>Active<br />listings</span>
                      </div>
                    )}
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

            {/* Header */}
            <div className="hidden">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1D9E75]">
                How it works
              </p>
              <h2 className="text-[36px] font-black leading-[1.06] tracking-[-0.02em] text-slate-950 sm:text-[48px]">
                Property the{' '}
                <span className="text-slate-300">right</span>{' '}
                way.<br />
                <span className="text-[#1D9E75]">Finally.</span>
              </h2>
              <p className="mt-3 max-w-[460px] text-[16px] leading-relaxed text-slate-500">
                Verified listings. Real visits. One person you can call. No brokers, no runaround.
              </p>
            </div>

            {/* ── SEEKERS ── */}
            <p className="hidden">
              For property seekers
            </p>

            {/* Bento — desktop: left tall + right 2 stacked, mobile: single col */}
            <div className="hidden">
              {/* Card 1 tall */}
              <div
                className="cursor-default border-b border-[#E7DED5] bg-white p-7 transition-colors hover:bg-[#FAFAF9] sm:border-b-0 sm:p-9"
                style={{ gridRow: '1 / 3' }}
              >
                <p className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Step 01 · You
                </p>
                <p className="text-[26px] font-black leading-[1.12] tracking-[-0.02em] text-slate-950 sm:text-[32px]">
                  Browse{' '}
                  <span className="text-[#1D9E75]">verified</span>{' '}
                  listings —{' '}not guesses.
                </p>
                <p className="mt-5 text-[14px] leading-relaxed text-slate-500">
                  Every flat on this platform has been physically visited by us before it went live. No stock photos. No ghost listings. No surprises.
                </p>
                <span
                  className="mt-5 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]"
                  style={{ background: '#E1F5EE', color: '#085041' }}
                >
                  You browse
                </span>
              </div>

              {/* Card 2 */}
              <div className="cursor-default border-b border-[#E7DED5] bg-white p-7 transition-colors hover:bg-[#FAFAF9] sm:border-l">
                <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Step 02 · You
                </p>
                <p className="mb-2 text-[18px] font-black leading-[1.2] tracking-[-0.01em] text-slate-950">
                  Watch the video tour from your phone.
                </p>
                <p className="text-[13px] leading-relaxed text-slate-500">
                  We shoot a proper walkthrough of every property. See the rooms, the view, the building — before you leave home.
                </p>
                <span
                  className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]"
                  style={{ background: '#E1F5EE', color: '#085041' }}
                >
                  You decide
                </span>
              </div>

              {/* Card 3 */}
              <div className="cursor-default bg-white p-7 transition-colors hover:bg-[#FAFAF9] sm:border-l sm:border-t sm:border-[#E7DED5]">
                <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Step 03 · Us
                </p>
                <p className="mb-2 text-[18px] font-black leading-[1.2] tracking-[-0.01em] text-slate-950">
                  Tap &ldquo;Visit.&rdquo; We confirm within the hour.
                </p>
                <p className="text-[13px] leading-relaxed text-slate-500">
                  We coordinate with the owner so you never have to make an awkward cold call to a stranger.
                </p>
                <span
                  className="mt-4 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]"
                  style={{ background: '#EEF2FF', color: '#3730A3' }}
                >
                  We coordinate
                </span>
              </div>
            </div>

            {/* Result card */}
            <div className="hidden">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    The result · You
                  </p>
                  <p className="mb-1.5 text-[20px] font-black leading-[1.2] tracking-[-0.01em] text-slate-950">
                    You walk in. It looks exactly like the video.
                  </p>
                  <p className="text-[13px] leading-relaxed text-slate-500">
                    No surprises. No negotiating with strangers. Just you and a flat that works — in Vidyanagar, Navanagar, Gokul Road, wherever you need.
                  </p>
                </div>
                <div className="shrink-0 sm:text-right">
                  <p className="text-[48px] font-black leading-none tracking-[-0.03em] text-[#1D9E75]">
                    300+
                  </p>
                  <p className="mt-0.5 text-[12px] text-slate-400">
                    found their property<br />this way already
                  </p>
                </div>
              </div>
            </div>

            {/* Seeker CTAs */}
            <div className="hidden">
              <Link
                href="/properties"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#1D9E75] px-7 text-[14px] font-bold text-white no-underline transition hover:bg-[#168662] active:scale-[0.98]"
                style={{ boxShadow: '0 6px 18px rgba(29,158,117,0.22)' }}
              >
                Browse listings →
              </Link>
              <Link
                href="/find"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#E2D5C8] bg-white px-7 text-[14px] font-bold text-slate-600 no-underline transition hover:bg-[#FFF4E6] active:scale-[0.98]"
              >
                Post my requirement
              </Link>
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

            <div className="hidden">

            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D8D4FF] bg-[#EEF2FF] px-3 py-1.5 text-[12px] font-black uppercase tracking-[0.12em] text-[#3730A3]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                  For property owners
                </p>
                <h3 className="text-[28px] font-black leading-[1.1] tracking-[-0.02em] text-slate-950 sm:text-[36px]">
                  You tell us once.<br />
                  We do everything else.
                </h3>
              </div>
              <p className="max-w-[300px] text-[14px] leading-relaxed text-slate-500 sm:text-right">
                From your first message to your first confirmed visit — here&apos;s exactly what we commit to.
              </p>
            </div>

            {/* Commitment grid */}
            <div className="mb-2 grid grid-cols-2 gap-3 md:grid-cols-4">
              {OWNER_STEPS.map(({ num, title, desc, isPayoff }, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-[18px] border p-5 sm:p-6 ${
                    isPayoff
                      ? 'border-[#C7C3FF] bg-gradient-to-br from-[#F5F4FF] to-[#EEF2FF]'
                      : 'border-[#E2D5C8] bg-white'
                  }`}
                  style={{
                    boxShadow: isPayoff
                      ? '0 8px 28px rgba(79,70,229,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
                      : '0 4px 16px rgba(58,46,40,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
                  }}
                >
                  {/* top accent bar */}
                  <div
                    className="absolute left-0 right-0 top-0 h-[3px]"
                    style={{ background: isPayoff ? '#4F46E5' : '#1D9E75' }}
                  />
                  {/* watermark number */}
                  <span
                    className="pointer-events-none absolute -right-2 -top-2 select-none text-[80px] font-black leading-none"
                    style={{ color: isPayoff ? 'rgba(79,70,229,0.08)' : 'rgba(29,158,117,0.09)' }}
                  >
                    {num}
                  </span>
                  <div className="relative z-10 mt-1">
                    <span
                      className="mb-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em]"
                      style={
                        isPayoff
                          ? { background: 'rgba(79,70,229,0.12)', color: '#4F46E5' }
                          : { background: 'rgba(29,158,117,0.12)', color: '#085041' }
                      }
                    >
                      Step {num}
                    </span>
                    <p className="mb-1.5 text-[14px] font-black leading-snug text-slate-950 sm:text-[15px]">
                      {title}
                    </p>
                    <p className="text-[12px] leading-[1.7] text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Payoff band */}
            <div
              className="overflow-hidden rounded-[18px] border border-[#D8C9BA] bg-white px-7 py-7 sm:px-9"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 18px rgba(58,46,40,0.06)' }}
            >
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div className="max-w-md">
                  <p className="mb-2 text-[22px] font-black leading-[1.2] tracking-[-0.02em] text-slate-950 sm:text-[28px]">
                    First enquiry arrives.<br />
                    <span style={{ color: '#4F46E5' }}>You just show up.</span>
                  </p>
                  <p className="text-[14px] leading-relaxed text-slate-500">
                    We screen every enquiry, coordinate all visits, and notify you when a serious buyer or tenant is ready to meet. You don&apos;t chase anyone.
                  </p>
                </div>
                <Link
                  href="/list"
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-full px-7 text-[14px] font-bold text-white no-underline transition hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: '#4F46E5',
                    boxShadow: '0 6px 18px rgba(79,70,229,0.22)',
                  }}
                >
                  List my property →
                </Link>
              </div>
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
                  <div className="hd-social-mark">IG</div>
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

        <section className="hidden" aria-label="Post requirement">
          <div className="mx-auto w-full max-w-[1520px]">
            <div
              className="relative overflow-hidden rounded-[20px] px-7 py-9 sm:px-12 sm:py-10"
              style={{
                background: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 60%, #6366F1 100%)',
                boxShadow: '0 16px 48px rgba(79,70,229,0.22)',
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="relative z-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-200">
                    Can&apos;t find what you need?
                  </p>
                  <h2 className="mt-2 text-[24px] font-black leading-tight text-white sm:text-[32px]">
                    Tell us what you&apos;re looking for.<br />
                    We&apos;ll find it for you.
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-indigo-200">
                    Share your requirement once — budget, location, type — and we&apos;ll match it against our listings and incoming properties. Join 300+ people who&apos;ve already shared their need.
                  </p>
                </div>
                <Link
                  href="/find"
                  className="inline-flex shrink-0 items-center justify-center rounded-[12px] bg-white px-7 py-3 text-[14px] font-bold text-[#4F46E5] no-underline shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition hover:bg-indigo-50 active:scale-[0.98]"
                >
                  Post my requirement →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── INSTAGRAM ─────────────────────────────────────────────── */}
        <section className="hidden" aria-label="Follow on Instagram">
          <div className="mx-auto w-full max-w-[1520px]">
            <div
              className="overflow-hidden rounded-[20px] border border-[#E2D5C8] bg-white"
              style={{ boxShadow: '0 4px 20px rgba(58,46,40,0.05)' }}
            >
              <div className="flex flex-col items-stretch sm:flex-row">

                {/* Left — text */}
                <div className="flex flex-col justify-center px-7 py-8 sm:px-10 sm:py-9 sm:flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig2)" strokeWidth="1.8"/>
                      <circle cx="12" cy="12" r="4.5" stroke="url(#ig2)" strokeWidth="1.8"/>
                      <circle cx="17.5" cy="6.5" r="1" fill="#C8541A"/>
                      <defs>
                        <linearGradient id="ig2" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#F9A825"/>
                          <stop offset="50%" stopColor="#E91E8C"/>
                          <stop offset="100%" stopColor="#9C27B0"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Instagram</span>
                  </div>
                  <h2 className="mb-2 text-[22px] font-black tracking-tight text-slate-950 sm:text-[26px]">
                    See properties before you visit.
                  </h2>
                  <p className="mb-5 text-[14px] leading-relaxed text-slate-500">
                    We shoot video tours of every property we verify. Daily walkthroughs across Hubballi-Dharwad — see the flat before you take the auto.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="https://www.instagram.com/hublidharwad.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-[10px] px-5 text-[13px] font-bold text-white no-underline transition hover:opacity-90 active:scale-[0.98]"
                      style={{
                        background: 'linear-gradient(135deg, #F9A825 0%, #E91E8C 50%, #9C27B0 100%)',
                        boxShadow: '0 5px 16px rgba(233,30,140,0.22)',
                      }}
                    >
                      Follow @hublidharwad.app
                    </a>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
