'use server'

import { supabase } from './supabaseClient'

// CREATE
export async function createRecord(data) {
  const { error } = await supabase
    .from('records')
    .insert([data])

  if (error) throw error
}

// READ
export async function getRecords() {
  const { data, error } = await supabase
    .from('records')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// UPDATE
export async function updateRecord(id, updates) {
  const { error } = await supabase
    .from('records')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

// DELETE
export async function deleteRecord(id) {
  const { error } = await supabase
    .from('records')
    .delete()
    .eq('id', id)

  if (error) throw error
}
