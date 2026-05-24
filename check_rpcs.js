const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cjwrlbydmnqvxzvdpvtl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqd3JsYnlkbW5xdnh6dmRwdnRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMjM4MjEsImV4cCI6MjA5Mjg5OTgyMX0.cRJYyfIKTcRxgxr6GV97HoE7KHgUI0r53VNAFSUBnKA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const rpcs = [
  { name: 'exec_sql', params: { sql: 'SELECT 1;' } },
  { name: 'run_sql', params: { sql: 'SELECT 1;' } },
  { name: 'execute_sql', params: { query: 'SELECT 1;' } },
  { name: 'sql', params: { query: 'SELECT 1;' } },
];

async function checkRpcs() {
  for (const rpc of rpcs) {
    try {
      console.log(`Checking RPC: ${rpc.name}...`);
      const { data, error } = await supabase.rpc(rpc.name, rpc.params);
      if (error) {
        console.log(`RPC ${rpc.name} error:`, error.message);
      } else {
        console.log(`RPC ${rpc.name} response:`, data);
      }
    } catch (e) {
      console.log(`RPC ${rpc.name} threw exception:`, e.message);
    }
  }
}

checkRpcs();
