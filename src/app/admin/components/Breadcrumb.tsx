'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="admin-breadcrumb" aria-label="Breadcrumb">
      <ol className="admin-breadcrumb-list">
        {/* Home/Dashboard Link */}
        <li className="admin-breadcrumb-item">
          <Link href="/admin" className="admin-breadcrumb-link">
            <Home className="admin-breadcrumb-icon" />
            <span className="admin-breadcrumb-text">Dashboard</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="admin-breadcrumb-item">
            <ChevronRight className="admin-breadcrumb-separator" />
            {item.href ? (
              <Link href={item.href} className="admin-breadcrumb-link">
                <span className="admin-breadcrumb-text">{item.label}</span>
              </Link>
            ) : (
              <span className="admin-breadcrumb-current">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}