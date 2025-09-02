import NewNewsForm from './NewNewsForm'
import Breadcrumb from '../../components/Breadcrumb'

export default function NewNewsPage() {
  const breadcrumbItems = [
    { label: 'News-Artikel', href: '/admin/news' },
    { label: 'Neuer Artikel' }
  ]

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <NewNewsForm />
    </div>
  )
}