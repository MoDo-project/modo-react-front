/**
 * 메뉴 위치 계산 (top 또는 bottom)
 * @param anchorRect - 앵커 요소의 getBoundingClientRect() 결과
 * @param menuHeight - 메뉴의 예상 높이 (기본값: 100)
 * @returns 'top' | 'bottom'
 */
export function calcMenuPosition(
  anchorRect: DOMRect,
  menuHeight: number = 100
): 'top' | 'bottom' {
  const spaceBelow = window.innerHeight - anchorRect.bottom
  return spaceBelow < menuHeight ? 'top' : 'bottom'
}

