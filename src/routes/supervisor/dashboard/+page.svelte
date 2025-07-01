<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Check, X, MapPin, Calendar, User, LogOut, AlertTriangle, Map } from 'lucide-svelte';
  
  export let data: any;
  
  let pendingLogs = data.pendingLogs || [];
  let loading = false;
  let showMapModal = false;
  let selectedLocation: { lat: number; lng: number; address: string; employee: string } | null = null;
  
  async function updateCheckLogStatus(logId: string, status: 'verified' | 'invalid') {
    loading = true;
    try {
      const response = await fetch(`/api/supervisor/verify/${logId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        // Remove from pending list
        pendingLogs = pendingLogs.filter((log: any) => log.id !== logId);
      } else {
        alert(`Failed to ${status === 'verified' ? 'verify' : 'flag'} check-in`);
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
  
  function openMap(lat: number, lng: number, address: string, employeeName: string) {
    selectedLocation = { lat, lng, address, employee: employeeName };
    showMapModal = true;
  }
  
  function closeMap() {
    showMapModal = false;
    selectedLocation = null;
  }
  
  function openInGoogleMaps(lat: number, lng: number) {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
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
                        <span class="flex-1">
                          {log.address || `${log.latitude.toFixed(6)}, ${log.longitude.toFixed(6)}`}
                        </span>
                      </div>
                    {/if}
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="mt-4 flex flex-wrap gap-3">
                    <button
                      on:click={() => updateCheckLogStatus(log.id, 'verified')}
                      disabled={loading}
                      class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300"
                    >
                      <Check class="w-4 h-4" />
                      Verify
                    </button>
                    <button
                      on:click={() => updateCheckLogStatus(log.id, 'invalid')}
                      disabled={loading}
                      class="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-300"
                    >
                      <AlertTriangle class="w-4 h-4" />
                      Flag Invalid
                    </button>
                    {#if log.latitude && log.longitude}
                      <button
                        on:click={() => openMap(log.latitude, log.longitude, log.address || 'Unknown Location', `${log.employee.firstName} ${log.employee.lastName}`)}
                        class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Map class="w-4 h-4" />
                        View Location
                      </button>
                    {/if}
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

<!-- Map Modal -->
{#if showMapModal && selectedLocation}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-hidden">
      <div class="p-4 border-b flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold">Location for {selectedLocation.employee}</h3>
          <p class="text-sm text-gray-600">{selectedLocation.address}</p>
        </div>
        <button
          on:click={closeMap}
          class="text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
      </div>
      
      <div class="p-4">
        <div class="mb-4 flex gap-3">
                   <button
           on:click={() => selectedLocation && openInGoogleMaps(selectedLocation.lat, selectedLocation.lng)}
           class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
         >
           Open in Google Maps
         </button>
                   <div class="text-sm text-gray-600 flex items-center">
           <MapPin class="w-4 h-4 mr-2" />
           {selectedLocation?.lat.toFixed(6)}, {selectedLocation?.lng.toFixed(6)}
         </div>
        </div>
        
        <!-- Embedded Map -->
                 <div class="w-full h-96 rounded-lg overflow-hidden border">
           <iframe
             src="https://www.openstreetmap.org/export/embed.html?bbox={(selectedLocation?.lng || 0) - 0.001},{(selectedLocation?.lat || 0) - 0.001},{(selectedLocation?.lng || 0) + 0.001},{(selectedLocation?.lat || 0) + 0.001}&layer=mapnik&marker={selectedLocation?.lat || 0},{selectedLocation?.lng || 0}"
             style="border: 0"
             class="w-full h-full"
             allowfullscreen={true}
             loading={'lazy'}
             referrerpolicy="no-referrer-when-downgrade"
             title="Location Map"
           ></iframe>
         </div>
        
        <div class="mt-4 text-xs text-gray-500">
          Map data © <a href="https://www.openstreetmap.org/" target="_blank" class="text-blue-600 hover:underline">OpenStreetMap</a> contributors
        </div>
      </div>
    </div>
  </div>
{/if} 