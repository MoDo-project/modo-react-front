import { useState, useCallback } from 'react'
import { calcMenuPosition } from '../lib'

interface UseGoalActionsMenuReturn {
  openGoalId: string | null
  position: 'top' | 'bottom'
  open: (goalId: string, anchorRect: DOMRect) => void
  close: () => void
  toggle: (goalId: string, anchorRect: DOMRect) => void
}

export function useGoalActionsMenu(): UseGoalActionsMenuReturn {
  const [openGoalId, setOpenGoalId] = useState<string | null>(null)
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom')

  const open = useCallback((goalId: string, anchorRect: DOMRect) => {
    const calculatedPosition = calcMenuPosition(anchorRect)
    setPosition(calculatedPosition)
    setOpenGoalId(goalId)
  }, [])

  const close = useCallback(() => {
    setOpenGoalId(null)
  }, [])

  const toggle = useCallback((goalId: string, anchorRect: DOMRect) => {
    if (openGoalId === goalId) {
      close()
    } else {
      open(goalId, anchorRect)
    }
  }, [openGoalId, open, close])

  return {
    openGoalId,
    position,
    open,
    close,
    toggle,
  }
}

