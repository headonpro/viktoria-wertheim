import React from 'react'
import { IconRobot } from '@tabler/icons-react'

export default function VereinsAssistent() {
  return (
    <div className="bg-white dark:bg-viktoria-dark-light rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-viktoria-blue to-viktoria-blue-light dark:from-viktoria-yellow dark:to-yellow-600 px-4 py-3 flex-shrink-0">
        <h3 className="text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wider text-center">Vereins Assistent</h3>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-viktoria-yellow dark:bg-viktoria-yellow rounded-full flex items-center justify-center">
            <IconRobot size={32} className="text-gray-900" />
          </div>
        </div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Assistent kommt bald!
        </h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Der Vereins-Assistent befindet sich noch in der Entwicklung.
          Bald könnt ihr hier Fragen über den Verein stellen!
        </p>
      </div>
    </div>
  )
}