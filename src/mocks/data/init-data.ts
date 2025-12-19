import { db } from '../db/db'
import { hashPassword } from '../db/utils'

/**
 * Initialize database with seed data
 */
export const initializeData = () => {
  // Clear existing data
  db.reset()

  // Create test users
  const user1 = db.addUser({
    username: 'testuser',
    password: hashPassword('password123'),
    nickname: '테스트유저',
    email: 'test@example.com',
    profileImgPath: null,
    role: 'USER',
  })

  const user2 = db.addUser({
    username: 'admin',
    password: hashPassword('admin123'),
    nickname: '관리자',
    email: 'admin@example.com',
    profileImgPath: null,
    role: 'ADMIN',
  })

  // Create sample todos for user1
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)

  // Root todo
  const rootTodo = db.addTodo({
    title: '프로젝트 완성하기',
    description: '리액트 프로젝트 완성',
    creatorId: user1.id,
    isCompleted: false,
    createdAt: now,
    deadline: nextWeek,
    parentId: null,
    path: '1',
    orderNumber: 1,
  })

  // Child todos
  db.addTodo({
    title: 'UI 디자인',
    description: 'UI 컴포넌트 디자인하기',
    creatorId: user1.id,
    isCompleted: true,
    createdAt: now,
    deadline: tomorrow,
    parentId: rootTodo.id,
    path: `1.${rootTodo.id}`,
    orderNumber: 1,
  })

  db.addTodo({
    title: 'API 연동',
    description: '백엔드 API 연동하기',
    creatorId: user1.id,
    isCompleted: false,
    createdAt: now,
    deadline: tomorrow,
    parentId: rootTodo.id,
    path: `1.${rootTodo.id}`,
    orderNumber: 2,
  })

  db.addTodo({
    title: '테스트 작성',
    description: '유닛 테스트 및 통합 테스트',
    creatorId: user1.id,
    isCompleted: false,
    createdAt: now,
    deadline: nextWeek,
    parentId: rootTodo.id,
    path: `1.${rootTodo.id}`,
    orderNumber: 3,
  })

  // Another root todo
  db.addTodo({
    title: '공부하기',
    description: '매일 1시간씩 공부하기',
    creatorId: user1.id,
    isCompleted: false,
    createdAt: now,
    deadline: nextWeek,
    parentId: null,
    path: '2',
    orderNumber: 2,
  })

  // Admin todos
  db.addTodo({
    title: '관리자 업무',
    description: '시스템 관리 업무',
    creatorId: user2.id,
    isCompleted: false,
    createdAt: now,
    deadline: nextWeek,
    parentId: null,
    path: '1',
    orderNumber: 1,
  })

  console.log('✅ Mock database initialized with seed data')
}
