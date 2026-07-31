import { useRef } from 'react'
import styles from './Tabs.module.css'

export interface TabItem {
  id: string
  label: string
}

interface TabsProps {
  items: readonly TabItem[]
  value: string
  onChange: (id: string) => void
  /** Accessible name for the tablist, e.g. "Artwork variants". */
  label: string
  /** `underline` for the hero, `pill` for the slider rail. */
  appearance?: 'underline' | 'pill'
  /** Base for `id`/`aria-controls` wiring; panel must use `${idBase}-panel`. */
  idBase: string
  className?: string
}

/**
 * WAI-ARIA tabs with roving focus.
 *
 * Implements the manual-activation pattern: arrows move focus between tabs,
 * Enter/Space selects. Automatic activation would fire a panel change on every
 * arrow press, which is disorienting when each panel swaps a large image.
 */
export function Tabs({
  items,
  value,
  onChange,
  label,
  appearance = 'underline',
  idBase,
  className,
}: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null)

  const focusTabAt = (index: number) => {
    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    tabs?.[index]?.focus()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const currentIndex = items.findIndex((item) => item.id === value)
    if (currentIndex === -1) return

    const lastIndex = items.length - 1
    let nextIndex: number

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1
        break
      case 'ArrowLeft':
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = lastIndex
        break
      default:
        return
    }

    event.preventDefault()
    const target = items[nextIndex]
    if (!target) return
    onChange(target.id)
    focusTabAt(nextIndex)
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={[styles.list, styles[appearance], className].filter(Boolean).join(' ')}
    >
      {items.map((item) => {
        const selected = item.id === value
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${idBase}-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`${idBase}-panel`}
            // Roving tabindex: only the active tab is in the tab order.
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={styles.tab}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
