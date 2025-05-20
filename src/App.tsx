import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

interface Device {
  name: string;
  ip: string;
  mac: string;
}

function App() { 
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    getMacAddress()
      .then(address => {
        console.log(address);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
 
  async function getMacAddress() {
    setLoading(true);
    const devices: Device[] = await invoke("get_mac_address");
    setDevices(devices);
    setLoading(false);
    return devices;
  }

  return (
    <main className="container">
      <header className="app-header">
        <h1>System Devices</h1>
        <button onClick={getMacAddress} className="refresh-button">
          Refresh Devices
        </button>
      </header>

      {loading ? (
        <div className="loading">Loading devices...</div>
      ) : (
        <div className="table-container">
          {devices.length === 0 ? (
            <div className="no-devices">No devices found</div>
          ) : (
            <table className="devices-table">
              <thead>
                <tr>
                  <th>Device Name</th>
                  <th>IP Address</th>
                  <th>MAC Address</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device, index) => (
                  <tr key={index} className="device-row">
                    <td className="device-name-cell">{device.name || "Unnamed Device"}</td>
                    <td>{device.ip}</td>
                    <td className="mac-cell">{device.mac}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
