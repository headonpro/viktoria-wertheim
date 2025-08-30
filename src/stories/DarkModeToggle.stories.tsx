import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from 'next-themes'
import { DarkModeToggle } from '@/components/DarkModeToggle'

const meta = {
  title: 'Components/DarkModeToggle',
  component: DarkModeToggle,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light">
        <div className="p-8">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof DarkModeToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const InHeader: Story = {
  decorators: [
    (Story) => (
      <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Header Example</h2>
          <Story />
        </div>
      </div>
    ),
  ],
}