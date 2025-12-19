import { useQuery } from '@tanstack/react-query'
import { todoApi } from '../api/todo-api'
import { handleApiError } from '@/shared/api'
import { todoKeys } from './keys'

/**
 * 사용자의 모든 todos를 조회하는 hook
 *
 * @returns {Object} Query 결과 객체
 * @returns {Todo[]|undefined} data - todos 목록
 * @returns {boolean} isLoading - 로딩 상태
 * @returns {Error|null} error - 에러 객체
 */
export function useTodos() {
  return useQuery({
    queryKey: todoKeys.list(),
    queryFn: async () => {
      try {
        const data = await todoApi.getTodos()
        return data || []
      } catch (error) {
        handleApiError(error)
        throw error
      }
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  })
}

