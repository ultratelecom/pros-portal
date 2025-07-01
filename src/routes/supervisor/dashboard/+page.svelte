<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Check, X, MapPin, Calendar, User, LogOut } from 'lucide-svelte';
  
  export let data: any;
  
  let pendingLogs = data.pendingLogs || [];
  let loading = false;
  
  async function verifyCheckLog(logId: string) {
    loading = true;
    try {
      const response = await fetch(`/api/supervisor/verify/${logId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Remove from pending list
        pendingLogs = pendingLogs.filter((log: any) => log.id !== logId);
      } else {
        alert('Failed to verify check-in');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      loading = false;
    }
  }
  
  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    goto('/');
  }
  
  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }
</script>

<div class="min-h-screen bg-gray-100">
  <!-- Header -->
  <header class="bg-purple-600 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Supervisor Dashboard</h1>
          <p class="text-purple-200">Welcome, {data.supervisor?.firstName} {data.supervisor?.lastName}</p>
        </div>
        <button
          on:click={logout}
          class="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut class="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  </header>
  
  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-6">Pending Check-Ins/Outs</h2>
      
      {#if pendingLogs.length === 0}
        <div class="text-center py-12 text-gray-500">
          <Calendar class="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No pending check-ins to verify</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each pendingLogs as log}
            <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex flex-col sm:flex-row gap-4">
                <!-- Employee Photo -->
                <div class="flex-shrink-0">
                  {#if log.photoUrl}
                    <img 
                      src={log.photoUrl} 
                      alt="Employee photo" 
                      class="w-24 h-24 rounded-lg object-cover"
                    />
                  {:else}
                    <div class="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <User class="w-8 h-8 text-gray-400" />
                    </div>
                  {/if}
                </div>
                
                <!-- Log Details -->
                <div class="flex-grow">
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="font-semibold text-lg">
                        {log.employee.firstName} {log.employee.lastName}
                      </h3>
                      <p class="text-sm text-gray-600">PIN: {log.employee.pin}</p>
                    </div>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {log.type === 'check-in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                      {log.type === 'check-in' ? 'Check In' : 'Check Out'}
                    </span>
                  </div>
                  
                  <div class="mt-2 space-y-1 text-sm text-gray-600">
                    <div class="flex items-center gap-2">
                      <Calendar class="w-4 h-4" />
                      {formatDate(log.timestamp)}
                    </div>
                    {#if log.latitude && log.longitude}
                      <div class="flex items-center gap-2">
                        <MapPin class="w-4 h-4" />
                        Location: {log.latitude.toFixed(6)}, {log.longitude.toFixed(6)}
                      </div>
                    {/if}
                  </div>
                  
                  <!-- Verify Button -->
                  <div class="mt-4">
                    <button
                      on:click={() => verifyCheckLog(log.id)}
                      disabled={loading}
                      class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300"
                    >
                      <Check class="w-4 h-4" />
                      Verify Check-{log.type === 'check-in' ? 'In' : 'Out'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </main>
</div> 