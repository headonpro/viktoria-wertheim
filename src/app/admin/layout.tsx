import './admin.css'
import { AuthProvider } from './AuthContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-wrapper">
      <AuthProvider>
        {children}
      </AuthProvider>
    </div>
  )
}