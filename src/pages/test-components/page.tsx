import { useState } from 'react'
import { Button } from 'shared/ui/button'
import { Input } from 'shared/ui/input'
import { Modal } from 'shared/ui/modal'
import { ColorPicker } from 'shared/ui/color-picker'
import { IconPicker } from 'shared/ui/icon-picker'
import { COLORS, ICONS } from 'shared/constants'
import { cn } from 'shared/lib/styles/cn'
import { themeClasses } from 'shared/lib/styles/theme'

export default function TestComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0].value)
  const [selectedIcon, setSelectedIcon] = useState<string>(ICONS[0].value)

  return (
    <div className={cn('min-h-screen p-8', themeClasses.bg.primary)}>
      <div className="mx-auto max-w-4xl space-y-12">
        <div>
          <h1 className={cn('mb-2 text-4xl font-bold', themeClasses.text.primary)}>
            🎨 컴포넌트 테스트
          </h1>
          <p className={cn('text-lg', themeClasses.text.secondary)}>
            새로 만든 재사용 가능한 컴포넌트들을 테스트합니다
          </p>
        </div>

        {/* Buttons */}
        <section className={cn('rounded-2xl p-6', themeClasses.bg.secondary)}>
          <h2 className={cn('mb-4 text-2xl font-semibold', themeClasses.text.primary)}>
            Button 컴포넌트
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className={cn('mb-3 text-sm font-medium', themeClasses.text.secondary)}>
                Variants
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            <div>
              <h3 className={cn('mb-3 text-sm font-medium', themeClasses.text.secondary)}>Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <h3 className={cn('mb-3 text-sm font-medium', themeClasses.text.secondary)}>
                States
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button onClick={() => alert('클릭!')}>With onClick</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section className={cn('rounded-2xl p-6', themeClasses.bg.secondary)}>
          <h2 className={cn('mb-4 text-2xl font-semibold', themeClasses.text.primary)}>
            Input 컴포넌트
          </h2>
          <div className="max-w-md space-y-4">
            <Input
              label="기본 Input"
              placeholder="텍스트를 입력하세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              label="에러가 있는 Input"
              placeholder="이메일을 입력하세요"
              error="유효한 이메일 주소를 입력해주세요"
            />
            <Input variant="filled" placeholder="Filled variant" />
            <Input type="password" label="비밀번호" placeholder="••••••••" />
          </div>
        </section>

        {/* Modal */}
        <section className={cn('rounded-2xl p-6', themeClasses.bg.secondary)}>
          <h2 className={cn('mb-4 text-2xl font-semibold', themeClasses.text.primary)}>
            Modal 컴포넌트
          </h2>
          <div className="flex gap-3">
            <Button onClick={() => setIsModalOpen(true)}>Modal 열기</Button>
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="테스트 Modal">
            <div className="space-y-4">
              <p className={themeClasses.text.secondary}>
                이것은 재사용 가능한 Modal 컴포넌트입니다.
              </p>
              <Input label="이름" placeholder="이름을 입력하세요" />
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  취소
                </Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                  확인
                </Button>
              </div>
            </div>
          </Modal>
        </section>

        {/* ColorPicker */}
        <section className={cn('rounded-2xl p-6', themeClasses.bg.secondary)}>
          <h2 className={cn('mb-4 text-2xl font-semibold', themeClasses.text.primary)}>
            ColorPicker 컴포넌트
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-lg border-2 border-gray-300 dark:border-zinc-600"
                style={{ backgroundColor: selectedColor }}
              />
              <span className={themeClasses.text.secondary}>선택된 색상: {selectedColor}</span>
            </div>
            <ColorPicker colors={COLORS} selected={selectedColor} onChange={setSelectedColor} />
          </div>
        </section>

        {/* IconPicker */}
        <section className={cn('rounded-2xl p-6', themeClasses.bg.secondary)}>
          <h2 className={cn('mb-4 text-2xl font-semibold', themeClasses.text.primary)}>
            IconPicker 컴포넌트
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <i className={cn(selectedIcon, 'text-4xl')} style={{ color: selectedColor }} />
              <span className={themeClasses.text.secondary}>선택된 아이콘: {selectedIcon}</span>
            </div>
            <IconPicker
              icons={ICONS}
              selected={selectedIcon}
              onChange={setSelectedIcon}
              color={selectedColor}
            />
          </div>
        </section>

        {/* Combined Example */}
        <section className={cn('rounded-2xl p-6', themeClasses.bg.secondary)}>
          <h2 className={cn('mb-4 text-2xl font-semibold', themeClasses.text.primary)}>
            ✨ 조합 예제
          </h2>
          <p className={cn('mb-6', themeClasses.text.secondary)}>
            모든 컴포넌트를 함께 사용하는 예제입니다
          </p>
          <div className="max-w-md space-y-6">
            <Input label="목표 이름" placeholder="목표 이름을 입력하세요" />

            <div>
              <label className={cn('mb-3 block text-sm font-medium', themeClasses.text.secondary)}>
                색상 선택
              </label>
              <ColorPicker colors={COLORS} selected={selectedColor} onChange={setSelectedColor} />
            </div>

            <div>
              <label className={cn('mb-3 block text-sm font-medium', themeClasses.text.secondary)}>
                아이콘 선택
              </label>
              <IconPicker
                icons={ICONS}
                selected={selectedIcon}
                onChange={setSelectedIcon}
                color={selectedColor}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="secondary">취소</Button>
              <Button variant="primary">추가</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
