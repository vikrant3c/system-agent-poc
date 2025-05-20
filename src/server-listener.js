// Import Tauri APIs
import { listen } from '@tauri-apps/api/event';

let serverUrl = null;

// Listen for server started event
export async function setupServerListener() {
  const unlisten = await listen('server-started', (event) => {
    console.log('Server started at:', event.payload);
    serverUrl = event.payload;
    
    // You can update your UI or store this URL for later use
    // For example, update a React/Vue state variable
  });
  
  // Return the cleanup function if needed
  return unlisten;
}

// Get the current server URL (can be called anytime after setup)
export function getServerUrl() {
  return serverUrl;
}

// Alternative: manually start server if needed
export async function startServer() {
  if (serverUrl) {
    console.log('Server already running at:', serverUrl);
    return serverUrl;
  }
  
  try {
    // Call the Tauri command which will now return the existing URL if already running
    const url = await window.__TAURI__.invoke('start_api_server');
    serverUrl = url;
    return url;
  } catch (error) {
    console.error('Failed to start server:', error);
    throw error;
  }
}
