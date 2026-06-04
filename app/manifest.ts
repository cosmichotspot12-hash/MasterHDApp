import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hubli Dharwad App - Properties in Hubli-Dharwad',
    short_name: 'Hubli Dharwad App',
    description: 'Find properties for rent and sale in Hubli-Dharwad',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff4e6',
    theme_color: '#E8501A',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
