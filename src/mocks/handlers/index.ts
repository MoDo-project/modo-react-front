import { authHandlers } from './auth'
import { todoHandlers } from './todo'

export const handlers = [...authHandlers, ...todoHandlers]

