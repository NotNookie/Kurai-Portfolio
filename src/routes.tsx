import { lazy, Suspense, type ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout/RootLayout'
import { RouteError } from '@/components/layout/ErrorBoundary/RouteError'
import { RouteFallback } from '@/components/layout/RouteFallback/RouteFallback'
import { RedirectWithQuery } from '@/components/layout/RedirectWithQuery/RedirectWithQuery'
import { HomePage } from '@/pages/Home/HomePage'

/**
 * Route table.
 *
 * Home ships in the main bundle since it is the common entry point. Everything
 * else is code-split — the gallery in particular pulls in the fullscreen viewer,
 * which a visitor who never opens a piece should not pay for.
 *
 * There are no per-artwork routes: the viewer is the detail view, addressed
 * with `?piece=slug` on the works route.
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
        path: 'works',
        element: lazyPage(() => import('@/pages/Works/WorksPage')),
      },
      // The gallery used to live here; keep `?piece=` links already shared alive.
      { path: 'illustrations', element: <RedirectWithQuery to="/works" /> },
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
