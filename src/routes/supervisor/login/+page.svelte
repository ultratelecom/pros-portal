<script lang="ts">
  import { goto } from '$app/navigation';
  import { UserCheck } from 'lucide-svelte';
  
  let username = '';
  let password = '';
  let loading = false;
  let error = '';
  
  async function handleLogin() {
    loading = true;
    error = '';
    
    try {
      const response = await fetch('/api/supervisor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        goto('/supervisor/dashboard');
      } else {
        error = result.error || 'Login failed';
      }
    } catch (err) {
      error = 'Network error. Please try again.';
    } finally {
      loading = false;
    }
  }
  
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <UserCheck class="w-8 h-8 text-purple-600" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900">Supervisor Login</h2>
      <p class="text-gray-600 mt-2">Sign in to verify check-ins</p>
    </div>
    
    <form on:submit|preventDefault={handleLogin} class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          bind:value={username}
          on:keypress={handleKeyPress}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          bind:value={password}
          on:keypress={handleKeyPress}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>
      
      {#if error}
        <div class="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      {/if}
      
      <button
        type="submit"
        disabled={loading || !username || !password}
        class="w-full bg-purple-600 text-white rounded-lg py-3 font-semibold disabled:bg-gray-300 hover:bg-purple-700 transition-colors"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
    
    <div class="mt-6 text-center">
      <a href="/" class="text-sm text-gray-600 hover:text-gray-900">
        ← Back to Home
      </a>
    </div>
  </div>
</div> 