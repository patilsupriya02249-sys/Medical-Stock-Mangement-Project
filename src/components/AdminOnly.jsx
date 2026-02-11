
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminOnly({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (data?.role === 'admin') setIsAdmin(true)
    }

    checkRole()
  }, [])

  if (!isAdmin) return null
  return children
}
