
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pdzynsrtwkkcndwztnkl.supabase.co';
const supabaseAnonKey = 'sb_publishable_cHdkHGu3oArTNfglry0MzQ_rNrKmGNT';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Syncs the entire portfolio state to Supabase.
 */
export const syncPortfolioData = async (data: any) => {
  try {
    const { error } = await supabase
      .from('portfolio_state')
      .upsert({ 
        id: 'main', 
        data: data,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    
    if (error) {
      // Catch specific Supabase errors for missing tables or schema cache issues
      const isMissingTable = 
        error.code === '42P01' || 
        error.code === 'PGRST108' || // Specific PostgREST error for missing schema
        error.message?.toLowerCase().includes('schema cache') || 
        error.message?.toLowerCase().includes('not found');

      if (isMissingTable) {
        return { success: false, error: 'Table not found' };
      }
      
      console.error('Supabase Sync Error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Connection failed' };
  }
};

/**
 * Fetches the portfolio state from Supabase.
 */
export const fetchPortfolioData = async () => {
  try {
    const { data, error } = await supabase
      .from('portfolio_state')
      .select('data')
      .eq('id', 'main')
      .maybeSingle();
      
    if (error) {
      const isMissingTable = 
        error.code === '42P01' || 
        error.code === 'PGRST108' ||
        error.message?.toLowerCase().includes('schema cache') || 
        error.message?.toLowerCase().includes('not found');

      if (isMissingTable) {
        return null; // Silent fallback to LocalStorage
      }

      // PGRST116 is "no rows found", which is a normal state for empty DBs
      if (error.code !== 'PGRST116') {
        console.error('Supabase Fetch Error:', error.message);
      }
      return null;
    }
    
    return data?.data || null;
  } catch (err) {
    return null;
  }
};

/**
 * Checks if the required portfolio_state table exists.
 */
export const checkDatabaseStatus = async (): Promise<{ exists: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('portfolio_state')
      .select('id')
      .limit(1);
    
    if (error) {
      const isMissingTable = 
        error.code === '42P01' || 
        error.code === 'PGRST108' ||
        error.message?.toLowerCase().includes('schema cache') || 
        error.message?.toLowerCase().includes('not found');

      if (isMissingTable) return { exists: false };
      return { exists: false, error: error.message };
    }
    return { exists: true };
  } catch (err) {
    return { exists: false, error: 'Network error' };
  }
};
