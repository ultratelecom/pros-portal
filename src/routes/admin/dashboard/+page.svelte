<script lang="ts">
  import { goto } from '$app/navigation';
  import { Users, FileText, UserPlus, LogOut, Edit, Trash2 } from 'lucide-svelte';
  
  export let data: any;
  
  let activeTab: 'employees' | 'logs' = 'employees';
  let showAddEmployee = false;
  let editingEmployee: any = null;
  
  // Form data for new/edit employee
  let formData = {
    pin: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    shoeSize: '',
    jerseySize: '',
    photoUrl: ''
  };
  
  async function saveEmployee() {
    const endpoint = editingEmployee 
      ? `/api/admin/employees/${editingEmployee.id}`
      : '/api/admin/employees';
    const method = editingEmployee ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        // Refresh page
        window.location.reload();
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to save employee');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  }
  
  async function deleteEmployee(id: string) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      const response = await fetch(`/api/admin/employees/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete employee');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  }
  
  function editEmployee(employee: any) {
    editingEmployee = employee;
    formData = {
      pin: employee.pin,
      firstName: employee.firstName,
      lastName: employee.lastName,
      phone: employee.phone || '',
      address: employee.address || '',
      shoeSize: employee.shoeSize || '',
      jerseySize: employee.jerseySize || '',
      photoUrl: employee.photoUrl || ''
    };
    showAddEmployee = true;
  }
  
  function resetForm() {
    formData = {
      pin: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      shoeSize: '',
      jerseySize: '',
      photoUrl: ''
    };
    editingEmployee = null;
    showAddEmployee = false;
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
  <header class="bg-red-600 text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Admin Dashboard</h1>
          <p class="text-red-200">
            {data.user?.type === 'full' ? 'Full Access' : 'View-Only Access'}
          </p>
        </div>
        <button
          on:click={logout}
          class="flex items-center gap-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut class="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  </header>
  
  <!-- Tab Navigation -->
  <div class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex space-x-8">
        <button
          on:click={() => activeTab = 'employees'}
          class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'employees' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
        >
          <div class="flex items-center gap-2">
            <Users class="w-4 h-4" />
            Employees
          </div>
        </button>
        <button
          on:click={() => activeTab = 'logs'}
          class="py-4 px-1 border-b-2 font-medium text-sm {activeTab === 'logs' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
        >
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4" />
            Check-In Logs
          </div>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if activeTab === 'employees'}
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Employee Management</h2>
          {#if data.user?.type === 'full'}
            <button
              on:click={() => showAddEmployee = true}
              class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <UserPlus class="w-4 h-4" />
              Add Employee
            </button>
          {/if}
        </div>
        
        <!-- Employee List -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PIN</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sizes</th>
                {#if data.user?.type === 'full'}
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                {/if}
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each data.employees as employee}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {#if employee.photoUrl}
                      <img src={employee.photoUrl} alt="{employee.firstName}" class="w-10 h-10 rounded-full" />
                    {:else}
                      <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users class="w-5 h-5 text-gray-400" />
                      </div>
                    {/if}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">{employee.pin}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{employee.firstName} {employee.lastName}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{employee.phone || '-'}</td>
                  <td class="px-6 py-4 text-sm">{employee.address || '-'}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    Shoe: {employee.shoeSize || '-'}, Jersey: {employee.jerseySize || '-'}
                  </td>
                  {#if data.user?.type === 'full'}
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        on:click={() => editEmployee(employee)}
                        class="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit class="w-4 h-4" />
                      </button>
                      <button
                        on:click={() => deleteEmployee(employee.id)}
                        class="text-red-600 hover:text-red-900"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </td>
                  {/if}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
    
    {#if activeTab === 'logs'}
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold mb-6">Check-In/Out Logs</h2>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified By</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each data.checkLogs as log}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {log.employee.firstName} {log.employee.lastName}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {log.type === 'check-in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                      {log.type === 'check-in' ? 'Check In' : 'Check Out'}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">{formatDate(log.timestamp)}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {#if log.latitude && log.longitude}
                      <span class="text-blue-600">{log.latitude.toFixed(4)}, {log.longitude.toFixed(4)}</span>
                    {:else}
                      <span class="text-gray-400">No location</span>
                    {/if}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {log.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                      {log.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    {#if log.verifiedBy}
                      {log.verifiedBy.firstName} {log.verifiedBy.lastName}
                    {:else}
                      -
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  </main>
  
  <!-- Add/Edit Employee Modal -->
  {#if showAddEmployee}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-lg font-semibold mb-4">
          {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        </h3>
        
        <form on:submit|preventDefault={saveEmployee} class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">PIN (4 digits)</label>
              <input
                type="text"
                bind:value={formData.pin}
                maxlength="4"
                pattern="[0-9]*"
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                bind:value={formData.phone}
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                bind:value={formData.firstName}
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                bind:value={formData.lastName}
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              bind:value={formData.address}
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Shoe Size</label>
              <input
                type="text"
                bind:value={formData.shoeSize}
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jersey Size</label>
              <input
                type="text"
                bind:value={formData.jerseySize}
                class="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div class="flex gap-4 mt-6">
            <button
              type="submit"
              class="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              {editingEmployee ? 'Update' : 'Add'} Employee
            </button>
            <button
              type="button"
              on:click={resetForm}
              class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div> 