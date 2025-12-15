import { useState, useEffect, FormEvent } from 'react'
import { Modal } from 'shared/ui/modal'
import { Button } from 'shared/ui/button'
import { Input } from 'shared/ui/input'
import { ColorPicker } from 'shared/ui/color-picker'
import { IconPicker } from 'shared/ui/icon-picker'
import { COLORS, ICONS } from 'shared/constants'
import { Goal } from '@/types'

interface AddGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (title: string, color: string, icon: string) => void
  editingGoal?: Goal | null
}

/**
 * 리팩토링된 AddGoalModal
 * 공통 컴포넌트를 조합해서 만듦 (190줄 → 80줄)
 */
export const AddGoalModal = ({ isOpen, onClose, onAdd, editingGoal }: AddGoalModalProps) => {
  const [title, setTitle] = useState('')
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0].value)
  const [selectedIcon, setSelectedIcon] = useState<string>(ICONS[0].value)

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title)
      setSelectedColor(editingGoal.color)
      setSelectedIcon(editingGoal.icon)
    } else {
      // 초기화
      setTitle('')
      setSelectedColor(COLORS[0].value)
      setSelectedIcon(ICONS[0].value)
    }
  }, [editingGoal, isOpen])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim(), selectedColor, selectedIcon)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingGoal ? '목표 편집' : '새 목표'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="목표 이름"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="목표 이름을 입력하세요"
          autoFocus
        />

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
            색상
          </label>
          <ColorPicker colors={COLORS} selected={selectedColor} onChange={setSelectedColor} />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
            아이콘
          </label>
          <IconPicker
            icons={ICONS}
            selected={selectedIcon}
            onChange={setSelectedIcon}
            color={selectedColor}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} type="button">
            취소
          </Button>
          <Button variant="primary" type="submit" disabled={!title.trim()}>
            {editingGoal ? '저장' : '추가'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

