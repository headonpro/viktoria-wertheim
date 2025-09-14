// Test script to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vbumolcclqrhfqiofvcz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZidW1vbGNjbHFyaGZxaW9mdmN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjM3MDY3NCwiZXhwIjoyMDcxOTQ2Njc0fQ.oXtr3Nlg4YWFWRvpTUPqYBosnBMoKrnhIs99Hn_1lNQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('Testing Supabase connection with Service Role...\n');

  // Test 1: Count matches
  const { count: matchCount, error: matchError } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true });

  console.log('Matches count:', matchCount, 'Error:', matchError);

  // Test 2: Get first 5 matches
  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('id, home_team, away_team, match_date')
    .limit(5);

  console.log('\nFirst 5 matches:');
  if (matches) {
    matches.forEach(m => {
      console.log(`- ${m.home_team} vs ${m.away_team} (${m.match_date})`);
    });
  } else {
    console.log('No matches found or error:', matchesError);
  }

  // Test 3: Check teams
  const { count: teamCount, error: teamError } = await supabase
    .from('teams')
    .select('*', { count: 'exact', head: true });

  console.log('\nTeams count:', teamCount, 'Error:', teamError);
}

testConnection().catch(console.error);