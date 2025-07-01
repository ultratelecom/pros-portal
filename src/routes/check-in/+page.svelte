<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Camera, MapPin } from 'lucide-svelte';
  
  let pin = '';
  let step: 'pin' | 'photo' | 'processing' | 'success' = 'pin';
  let videoRef: HTMLVideoElement;
  let canvasRef: HTMLCanvasElement;
  let stream: MediaStream | null = null;
  let capturedPhoto = '';
  let location: GeolocationPosition | null = null;
  let locationError = '';
  let checkType: 'check-in' | 'check-out' = 'check-in';
  
  onMount(() => {
    // Request location permission on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location = position;
        },
        (error) => {
          locationError = 'Location access denied. Check-in will proceed without location.';
        }
      );
    }
    
    return () => {
      // Cleanup camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  });
  
  async function handlePinSubmit() {
    if (pin.length !== 4) {
      alert('Please enter a 4-digit PIN');
      return;
    }
    
    // Move to photo capture step
    step = 'photo';
    await startCamera();
  }
  
  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef) {
        videoRef.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied. Please enable camera permissions.');
      step = 'pin';
    }
  }
  
  function capturePhoto() {
    if (videoRef && canvasRef) {
      const context = canvasRef.getContext('2d');
      if (context) {
        canvasRef.width = videoRef.videoWidth;
        canvasRef.height = videoRef.videoHeight;
        context.drawImage(videoRef, 0, 0);
        capturedPhoto = canvasRef.toDataURL('image/jpeg');
        
        // Stop camera stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        // Submit check-in
        submitCheckIn();
      }
    }
  }
  
  async function submitCheckIn() {
    step = 'processing';
    
    const formData = new FormData();
    formData.append('pin', pin);
    formData.append('photo', capturedPhoto);
    formData.append('type', checkType);
    
    if (location) {
      formData.append('latitude', location.coords.latitude.toString());
      formData.append('longitude', location.coords.longitude.toString());
    }
    
    try {
      const response = await fetch('/api/check-in', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        step = 'success';
        setTimeout(() => {
          goto('/');
        }, 3000);
      } else {
        alert(result.error || 'Check-in failed');
        step = 'pin';
        pin = '';
      }
    } catch (err) {
      alert('Network error. Please try again.');
      step = 'pin';
      pin = '';
    }
  }
  
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && step === 'pin') {
      handlePinSubmit();
    }
  }
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
    {#if step === 'pin'}
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-6">Employee Check-In/Out</h2>
        
        <!-- Check Type Toggle -->
        <div class="mb-6">
          <div class="inline-flex rounded-lg border border-gray-200 p-1">
            <button
              on:click={() => checkType = 'check-in'}
              class="px-4 py-2 rounded-md transition-colors {checkType === 'check-in' ? 'bg-blue-600 text-white' : 'text-gray-600'}"
            >
              Check In
            </button>
            <button
              on:click={() => checkType = 'check-out'}
              class="px-4 py-2 rounded-md transition-colors {checkType === 'check-out' ? 'bg-blue-600 text-white' : 'text-gray-600'}"
            >
              Check Out
            </button>
          </div>
        </div>
        
        <p class="text-gray-600 mb-4">Enter your 4-digit PIN</p>
        
        <input
          type="password"
          bind:value={pin}
          on:keypress={handleKeyPress}
          maxlength="4"
          pattern="[0-9]*"
          inputmode="numeric"
          class="w-full text-center text-3xl font-mono border-2 border-gray-300 rounded-lg p-4 mb-6 focus:border-blue-500 focus:outline-none"
          placeholder="••••"
        />
        
        <button
          on:click={handlePinSubmit}
          disabled={pin.length !== 4}
          class="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold disabled:bg-gray-300 hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
        
        {#if locationError}
          <div class="mt-4 flex items-center justify-center text-sm text-orange-600">
            <MapPin class="w-4 h-4 mr-1" />
            {locationError}
          </div>
        {/if}
      </div>
    {/if}
    
    {#if step === 'photo'}
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-6">Capture Your Photo</h2>
        <p class="text-gray-600 mb-4">Please look at the camera</p>
        
        <div class="relative mb-6">
          <video
            bind:this={videoRef}
            autoplay
            playsinline
            class="w-full rounded-lg bg-black"
          />
          <canvas bind:this={canvasRef} class="hidden" />
        </div>
        
        <button
          on:click={capturePhoto}
          class="w-full bg-green-600 text-white rounded-lg py-3 font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <Camera class="w-5 h-5 mr-2" />
          Capture Photo
        </button>
      </div>
    {/if}
    
    {#if step === 'processing'}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">Processing your {checkType}...</p>
      </div>
    {/if}
    
    {#if step === 'success'}
      <div class="text-center py-12">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Success!</h3>
        <p class="text-gray-600">Your {checkType} has been recorded and sent for verification.</p>
      </div>
    {/if}
  </div>
</div> 