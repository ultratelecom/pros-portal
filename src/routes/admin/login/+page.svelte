<script lang="ts">
  import { goto } from '$app/navigation';
  import { Shield } from 'lucide-svelte';
  
  let code = '';
  let loading = false;
  let error = '';
  
  async function handleLogin() {
    loading = true;
    error = '';
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        goto('/admin/dashboard');
      } else {
        error = result.error || 'Invalid code';
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
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Shield class="w-8 h-8 text-red-600" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900">Admin Access</h2>
      <p class="text-gray-600 mt-2">Enter your admin code</p>
    </div>
    
    <form on:submit|preventDefault={handleLogin} class="space-y-4">
      <div>
        <label for="code" class="block text-sm font-medium text-gray-700 mb-1">
          Access Code
        </label>
        <input
          id="code"
          type="password"
          bind:value={code}
          on:keypress={handleKeyPress}
          maxlength="5"
          pattern="[0-9]*"
          inputmode="numeric"
          class="w-full text-center text-2xl font-mono px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="•••••"
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
        disabled={loading || code.length !== 5}
        class="w-full bg-red-600 text-white rounded-lg py-3 font-semibold disabled:bg-gray-300 hover:bg-red-700 transition-colors"
      >
        {loading ? 'Verifying...' : 'Access Admin Panel'}
      </button>
    </form>
    
    <!-- Admin Test Section -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 class="text-sm font-semibold text-blue-800 mb-3 text-center">Admin Test - Quick Login</h3>
      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          on:click={() => { code = '00000'; handleLogin(); }}
          class="bg-blue-600 text-white text-xs px-3 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Full Access (00000)
        </button>
        <button
          type="button"
          on:click={() => { code = '11111'; handleLogin(); }}
          class="bg-gray-600 text-white text-xs px-3 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          View Only (11111)
        </button>
      </div>
    </div>
    
    <div class="mt-4 text-center space-y-1 text-xs text-gray-500">
      <p>Manual Entry:</p>
      <p>Code 00000: Full Admin Access</p>
      <p>Code 11111: View-Only Access</p>
    </div>
    
    <div class="mt-6 text-center">
      <a href="/" class="text-sm text-gray-600 hover:text-gray-900">
        ← Back to Home
      </a>
    </div>
  </div>
</div> 