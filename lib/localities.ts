// Canonical Hubli-Dharwad localities.
//
// Single source of truth for locality suggestions across the site
// (find, list, admin new/edit, properties filter). Users can pick from
// this list OR type their own — this is a suggestion set, not a hard
// constraint. Keeping the common areas here reduces fragmentation in the
// admin matching/grouping logic (matchRequirements does a substring match,
// and requirements are grouped by locality string).
//
// Starter list — edit freely as coverage grows. Keep entries in the exact
// casing/spelling you want to appear in the admin grouping.

export const LOCALITIES: readonly string[] = [
  // — Hubballi —
  'Vidyanagar',
  'Gokul Road',
  'Keshwapur',
  'Deshpande Nagar',
  'Old Hubli',
  'Unkal',
  'Navanagar',
  'Rajnagar',
  'Shirur Park',
  'Akshay Colony',
  'Bhavani Nagar',
  'Gandhi Nagar',
  'Vinobanagar',
  'Sattur',
  'Vishweshwar Nagar',
  'Tarihal',
  'Gabbur',
  'Kusugal Road',
  'Airport Road',
  'Rayapur',

  // — Dharwad —
  'Saptapur',
  'Malmaddi',
  'Kalyan Nagar',
  'Vidyagiri',
  'Sadhankeri',
  'Narayanpur',
  'Toll Naka',
  'Jubilee Circle',
  'Court Circle',
  'Hosayellapur',
  'Kelageri',
  'Lakamanahalli',
  'Shivagiri',
  'Someshwar',
  'Tejaswi Nagar',
  'PB Road',
  'University Campus',
  'Yalakki Shettar Colony',
];
