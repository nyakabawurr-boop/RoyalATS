'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Crown } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/job-match', label: 'Job Match' },
  { href: '/optimize', label: 'Optimize' },
  { href: '/layout-check', label: 'Layout Check' },
  { href: '/resume-builder', label: 'Resume Builder' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Royal
          </Link>
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

