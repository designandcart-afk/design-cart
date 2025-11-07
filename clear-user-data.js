// Clear All User Data Script
// Paste this into browser console at http://localhost:4000

console.log('🧹 Clearing all user data...');

// Clear all localStorage
localStorage.clear();
console.log('✅ localStorage cleared');

// Clear all sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage cleared');

// Clear specific keys that might exist
const keysToCheck = [
  'dc:demo:mode',
  'dc:demo:user', 
  'dc:orders',
  'supabase.auth.token'
];

keysToCheck.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Removed ${key}`);
  }
});

console.log('🔄 Refreshing page in 2 seconds...');
setTimeout(() => {
  window.location.reload();
}, 2000);