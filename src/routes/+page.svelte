<script>
  import { Calendar, UserCheck } from 'lucide-svelte';
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4">
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">CleanPro Manager</h1>
      <p class="text-gray-600">Employee Time Tracking System</p>
    </div>
    
    <div class="space-y-4">
      <!-- Check-In/Out Button -->
      <a 
        href="/check-in" 
        class="block w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-8 text-center transition-colors shadow-lg"
      >
        <Calendar class="w-16 h-16 mx-auto mb-4" />
        <h2 class="text-2xl font-semibold mb-2">Check-In/Out</h2>
        <p class="text-blue-100">Record your attendance</p>
      </a>
      
      <!-- Supervisor Admin Button -->
      <a 
        href="/supervisor/login" 
        class="block w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-8 text-center transition-colors shadow-lg"
      >
        <UserCheck class="w-16 h-16 mx-auto mb-4" />
        <h2 class="text-2xl font-semibold mb-2">Supervisor Admin</h2>
        <p class="text-purple-100">Manage and verify check-ins</p>
      </a>
    </div>
    
    <!-- Admin Login Link -->
    <div class="mt-8 text-center">
      <a href="/admin/login" class="text-sm text-gray-600 hover:text-gray-900 underline">
        Admin Access
      </a>
    </div>
  </div>
</div>
