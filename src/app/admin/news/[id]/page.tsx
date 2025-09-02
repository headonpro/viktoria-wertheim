import { createClient } from '@/lib/supabase/server'
import NewsEditor from './NewsEditor'
import { notFound } from 'next/navigation'

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: article } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) {
    notFound()
  }

  return <NewsEditor article={article} />
}