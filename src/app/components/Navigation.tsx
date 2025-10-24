'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Brain, Home, Mail, BarChart3 } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shap-analysis', label: 'SHAP AI', icon: Brain },
    { href: '#metrics', label: 'Metrics', icon: BarChart3 },
    { href: '#contact', label: 'Contact', icon: Mail }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div className="font-bold text-xl text-gray-800">
              Epoch<span className="text-blue-600">Guard</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.label === 'SHAP AI' && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 text-gray-600 hover:text-blue-600">
              <div className="w-6 h-6 flex flex-col justify-center gap-1">
                <div className="h-0.5 w-full bg-currentColor"></div>
                <div className="h-0.5 w-full bg-currentColor"></div>
                <div className="h-0.5 w-full bg-currentColor"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}