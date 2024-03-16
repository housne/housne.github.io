import clsx from 'clsx'
import { useState } from 'preact/hooks'

export function Spotlight() {

  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={clsx('fixed top-0 left-0 w-screen h-screen z-20', isOpen ? '' : ' opacity-0 invisible')}>
      <div className="absolute top-0 left-0 w-screen h-screen bg-white/80 dark:bg-black/80 backdrop-blur-sm" onClick={handleOpen} aria-hidden="true">
      </div>
      <div className={clsx("relative z-10 max-w-screen-sm mx-auto mt-24 px-4 transition-[transform,opacity]", isOpen ? '' : 'scale-110 opacity-0')}>
        <div className="bg-white rounded-lg shadow-2xl dark:bg-gray-900 border dark:border-gray-800">
          <div className="relative flex items-center border-b dark:border-gray-800 px-2">
            <input 
              className="bg-transparent py-2.5 px-2 block w-full outline-none appearance-none" 
              placeholder="搜索文章"
              id="search"
            />
            <button className="w-4 h-4 flex items-center justify-center border rounded-full opacity-50 hover:opacity-100" ></button>
          </div>
        </div>
      </div>
    </div>
  )
}