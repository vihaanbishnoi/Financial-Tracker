import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { PanelLeftIcon } from 'lucide-react'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

// Custom Sidebar Toggle Component
function CustomSidebarToggle() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    
    // Find and toggle the sidebar - target both the sidebar and its wrapper
    const sidebar = document.querySelector('[data-sidebar="sidebar"]') as HTMLElement
    const sidebarInset = document.querySelector('[data-sidebar="inset"]') as HTMLElement
    
    if (sidebar) {
      if (newCollapsed) {
        // Fully hide the sidebar
        sidebar.style.width = '0px'
        sidebar.style.minWidth = '0px'
        sidebar.style.maxWidth = '0px'
        sidebar.style.overflow = 'hidden'
        sidebar.style.transition = 'all 0.3s ease-in-out'
        sidebar.style.transform = 'translateX(-100%)'
        
        // Adjust the main content area
        if (sidebarInset) {
          sidebarInset.style.marginLeft = '0'
          sidebarInset.style.transition = 'margin-left 0.3s ease-in-out'
        }
      } else {
        // Show the sidebar with normal width
        sidebar.style.width = ''
        sidebar.style.minWidth = ''
        sidebar.style.maxWidth = ''
        sidebar.style.overflow = ''
        sidebar.style.transition = 'all 0.3s ease-in-out'
        sidebar.style.transform = ''
        
        // Reset the main content area
        if (sidebarInset) {
          sidebarInset.style.marginLeft = ''
          sidebarInset.style.transition = 'margin-left 0.3s ease-in-out'
        }
      }
    }
    
    // Store state in localStorage
    localStorage.setItem('sidebar_collapsed', newCollapsed.toString())
  }

  // Load initial state
  useEffect(() => {
    const stored = localStorage.getItem('sidebar_collapsed')
    const shouldCollapse = stored === 'true'
    
    if (shouldCollapse) {
      setIsCollapsed(true)
      const sidebar = document.querySelector('[data-sidebar="sidebar"]') as HTMLElement
      const sidebarInset = document.querySelector('[data-sidebar="inset"]') as HTMLElement
      
      if (sidebar) {
        sidebar.style.width = '0px'
        sidebar.style.minWidth = '0px'
        sidebar.style.maxWidth = '0px'
        sidebar.style.overflow = 'hidden'
        sidebar.style.transform = 'translateX(-100%)'
        
        if (sidebarInset) {
          sidebarInset.style.marginLeft = '0'
        }
      }
    }
  }, [])

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleSidebar}
      className="h-8 w-8 max-md:scale-125"
    >
      <PanelLeftIcon className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'z-50 h-16',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative flex h-full items-center gap-3 p-4 sm:gap-4',
          offset > 10 &&
            fixed &&
            'after:bg-background/20 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg'
        )}
      >
        <CustomSidebarToggle />
        <Separator orientation='vertical' className='h-6' />
        {children}
      </div>
    </header>
  )
}
