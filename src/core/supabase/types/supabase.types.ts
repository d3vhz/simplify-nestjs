import { SupabaseClient } from '@supabase/supabase-js';

import { Database } from '~/shared/types';

type TypedSupabaseClient = SupabaseClient<Database>;

export type { TypedSupabaseClient };
