import { lazy, Suspense, type ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout/RootLayout'
import { RouteError } from '@/components/layout/ErrorBoundary/RouteError'
import { RouteFallback } from '@/components/layout/RouteFallback/RouteFallback'
import { HomePage } from '@/pages/Home/HomePage'

/**
 * Route table.
 *
 * Home ships in the main bundle since it is the common entry point. Everything
 * else is code-split — the gallery in particular pulls in the lightbox, which a
 * visitor who never opens a piece should not pay for.
 *
 * There are no per-artwork routes: the lightbox is the detail view, and it is
 * addressed with `?piece=slug` on the gallery route.
 */

const lazyPage = (loader: () => Promise<{ default: ComponentType }>) => {
  const Page = lazy(loader)
  return (
    <Suspense fallback={<RouteFallback />}>
      <Page />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'illustrations',
        element: lazyPage(() => import('@/pages/Gallery/GalleryPage')),
      },
      {
        path: 'about',
        element: lazyPage(() => import('@/pages/About/AboutPage')),
      },
      {
        path: 'contact',
        element: lazyPage(() => import('@/pages/Contact/ContactPage')),
      },
      {
        path: '*',
        element: lazyPage(() => import('@/pages/NotFound/NotFoundPage')),
      },
    ],
  },
])
