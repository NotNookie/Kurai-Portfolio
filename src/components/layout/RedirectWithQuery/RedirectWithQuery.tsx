import { Navigate, useLocation } from 'react-router-dom'

interface RedirectWithQueryProps {
  to: string
}

/**
 * Permanent redirect that preserves the query string.
 *
 * A bare `<Navigate to="/works" replace />` discards `?piece=slug`, which would
 * break every deep link shared before a route was renamed. Lives in its own
 * file so `routes.tsx` keeps exporting only the router — mixing a component
 * export in there disables fast refresh for the whole route table.
 */
export function RedirectWithQuery({ to }: RedirectWithQueryProps) {
  const { search } = useLocation()
  return <Navigate to={{ pathname: to, search }} replace />
}
