import './admin.css'
import AdminAuthWrapper from './AdminAuthWrapper'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-wrapper">
      <AdminAuthWrapper>
        {children}
      </AdminAuthWrapper>
    </div>
  )
}