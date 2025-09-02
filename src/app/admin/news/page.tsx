import { createClient } from '@/lib/supabase/server'
import NewsManager from './NewsManager'
import Breadcrumb from '../components/Breadcrumb'

export default async function AdminNewsPage() {
  const supabase = await createClient()
  
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })

  const breadcrumbItems = [
    { label: 'News-Artikel' }
  ]

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <NewsManager initialNews={news || []} />
    </div>
  )
}