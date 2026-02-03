import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    if (!query && !category) {
        return NextResponse.json({ services: [] });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let dbQuery = supabase
        .from('services')
        .select(`
      *,
      profiles:provider_id (business_name, phone, whatsapp_enabled)
    `)
        .eq('is_active', true)
        .order('average_rating', { ascending: false });

    if (category && category !== 'all') {
        dbQuery = dbQuery.eq('category', category);
    }

    if (query) {
        // Perform text search on title, description, or location
        dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`);
    }

    const { data: services, error } = await dbQuery;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Future Integration:
    // Here we would perform server-side calls to Google Places API or TikTok API
    // if we had access keys. For now, we return our internal results.
    // const googleResults = await fetchGoogleMaps(query);
    // const tiktokResults = await fetchTikTok(query);

    return NextResponse.json({
        services: services || [],
        meta: {
            query,
            count: services?.length || 0,
            external_search_enabled: false // Flag to frontend
        }
    });
}
