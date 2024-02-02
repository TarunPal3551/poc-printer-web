import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function BluetoothApp() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [bytecode, setBytecode] = useState('');

  useEffect(() => {
    // Check if Bluetooth is supported by the browser
    if (!navigator.bluetooth) {
      alert('Web Bluetooth is not supported in this browser.');
      return;
    }
  }, []);

  const requestDevices = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [0x180F],
      });
      setDevices([...devices, device]);
    } catch (error) {
      console.error('Error requesting Bluetooth device:', error);
    }
  };

  const connectToDevice = async (device) => {
    try {
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(0x180F);
      const characteristic = await service.getCharacteristic(0x2A19);
      setConnectedDevice(device);
      setCharacteristic(characteristic);
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const sendBytecode = async () => {
    if (!connectedDevice || !characteristic) return;

    try {
      await characteristic.writeValue(new TextEncoder().encode(bytecode));
    } catch (error) {
      console.error('Error sending bytecode:', error);
    }
  };

  return (
    <div>
      <h1>Bluetooth App</h1>
      <button onClick={requestDevices}>Scan for devices</button>
      <div>
        {devices.map((device, index) => (
          <div key={index}>
            <p>{device.name}</p>
            <button onClick={() => connectToDevice(device)}>Connect</button>
          </div>
        ))}
      </div>
      {connectedDevice && (
        <div>
          <h2>Connected to: {connectedDevice.name}</h2>
          <textarea
            rows="4"
            cols="50"
            value={bytecode}
            onChange={(e) => setBytecode(e.target.value)}
          ></textarea>
          <button onClick={sendBytecode}>Send Bytecode</button>
        </div>
      )}
    </div>
  );
}

export default BluetoothApp;