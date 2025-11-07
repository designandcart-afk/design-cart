// Auth Reset Script for Design & Cart
// Run this in browser console to fix authentication issues

console.log('🔧 Design & Cart Auth Reset Tool');
console.log('=================================');

// Check current state
console.log('📊 Current LocalStorage auth data:');
console.log('- dc:demo:mode:', localStorage.getItem('dc:demo:mode'));
console.log('- dc:demo:user:', localStorage.getItem('dc:demo:user'));

// Clear all auth data
console.log('🧹 Clearing all authentication data...');
localStorage.removeItem('dc:demo:mode');
localStorage.removeItem('dc:demo:user');

// Force real auth mode
console.log('🔄 Setting to real authentication mode...');
localStorage.setItem('dc:demo:mode', 'false');

console.log('✅ Auth state reset complete!');
console.log('🔄 Reloading page to apply changes...');

// Reload page
setTimeout(() => {
  window.location.reload();
}, 1000);