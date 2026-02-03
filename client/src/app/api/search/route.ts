import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { HAIL_VENUES } from '@/lib/hail-data';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const category = searchParams.get('category');

    if (!query && !category) {
        // Return mostly Google results + any DB results if empty query (show all)
        const allExternal = HAIL_VENUES;
        return NextResponse.json({ services: allExternal });
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
        dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`);
    }

    const { data: dbServices, error } = await dbQuery;

    if (error) {
        console.error('DB Search Error:', error);
        // Fallback to just external data if DB fails
    }

    // Filter External Data
    let externalServices = HAIL_VENUES;

    if (category && category !== 'all') {
        externalServices = externalServices.filter(s => s.category === category);
    }

    if (query) {
        externalServices = externalServices.filter(s =>
            s.title.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query) ||
            s.location.toLowerCase().includes(query)
        );
    }

    // Merge: DB results first, then External
    const finalServices = [
        ...(dbServices || []),
        ...externalServices
    ];

    return NextResponse.json({
        services: finalServices,
        meta: {
            query,
            count: finalServices.length || 0,
            external_search_enabled: true
        }
    });
}
