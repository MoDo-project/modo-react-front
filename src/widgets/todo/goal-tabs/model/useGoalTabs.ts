import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Goal } from '@/types'
import { getTabFromSelectedGoal } from '../lib'

interface UseGoalTabsProps {
  goals: Goal[]
  selectedGoalId: string
  onSelectGoal: (id: string) => void
}

interface UseGoalTabsReturn {
  isMobile: boolean
  activeTab: 'all' | 'personal'
  handleTabChange: (tab: 'all' | 'personal' | 'group') => void
  goToGroups: () => void
}

/**
 * GoalTabs의 컨트롤러 훅
 * - isMobile 감지 (matchMedia 사용)
 * - activeTab 파생값 계산
 * - 탭 변경 핸들러
 * - 네비게이션 액션
 */
export function useGoalTabs({
  goals,
  selectedGoalId,
  onSelectGoal,
}: UseGoalTabsProps): UseGoalTabsReturn {
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(false)

  // matchMedia를 사용한 isMobile 감지 (resize 이벤트보다 안정적)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    // 초기값 설정
    setIsMobile(mq.matches)

    // 모던 브라우저는 addEventListener 지원
    if (mq.addEventListener) {
      mq.addEventListener('change', handleChange)
      return () => mq.removeEventListener('change', handleChange)
    } else {
      // 구형 브라우저 fallback
      mq.addListener(handleChange)
      return () => mq.removeListener(handleChange)
    }
  }, [])

  // selectedGoalId 기반으로 탭 상태를 파생값으로 계산
  // 탭 상태는 'all' 또는 'personal'만 존재 (group은 네비게이션 버튼)
  const activeTab = useMemo(
    () => getTabFromSelectedGoal(selectedGoalId, goals),
    [selectedGoalId, goals]
  )

  // 그룹 페이지로 이동
  const goToGroups = useCallback(() => {
    navigate('/groups')
  }, [navigate])

  // 탭 변경 핸들러
  // 정책:
  // - 'all' → onSelectGoal('all')
  // - 'group' → navigate('/groups') (return, 탭 상태는 유지)
  // - 'personal' → 탭 전환만 (실제 선택은 pill list에서)
  const handleTabChange = useCallback(
    (tab: 'all' | 'personal' | 'group') => {
      if (tab === 'all') {
        onSelectGoal('all')
      } else if (tab === 'group') {
        goToGroups()
        return // 네비게이션만 하고 탭 상태는 변경하지 않음
      }
      // 'personal' 탭은 GoalPillList에서 Goal 선택 시 자동으로 처리됨
    },
    [onSelectGoal, goToGroups]
  )

  return {
    isMobile,
    activeTab,
    handleTabChange,
    goToGroups,
  }
}

