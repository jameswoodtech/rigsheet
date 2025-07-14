import React, { useState, useEffect } from 'react';
import VehicleInfo from '../components/VehicleInfo';
import vehicleInfo from '../data/user1/vehicleInfo';
import QRCode from 'react-qr-code';
import { fetchMods } from '../data/fetchMods';
import '../styles/Printable.css';

function Printable({ userId }) {
  const userProfileUrl = `https://rigsheet.app/user/${userId}`;
  const [mods, setMods] = useState([]);

  useEffect(() => {
    fetchMods('user1').then(setMods);
  })

  return (
      <div className="print-page">
        <VehicleInfo info={vehicleInfo} />

        <header className="print-header">
          <h1>RigSheet: Build Summary</h1>
          <button className="print-button" onClick={() => window.print()}>
            🖨️ Print Page
          </button>
        </header>

        <table className="print-table">
          <thead>
            <tr>
              <th>Mod</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Weight</th>
              <th>Price</th>
              <th>Sponsored</th>
            </tr>
          </thead>
          <tbody>
            {mods.map((mod) => (
              <tr key={mod.id}>
                <td>{mod.name}</td>
                <td>{mod.brand}</td>
                <td>{mod.category}</td>
                <td>{mod.weight}</td>
                <td>{typeof mod.price === 'number' ? `$${mod.price.toFixed(2)}` : 'N/A'}</td>
                <td>{mod.sponsored ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <footer className="print-footer">
          <div className="footer-branding">
            <img
              src="/assets/rigsheet-logo.png"
              alt="RigSheet Logo"
              className="footer-logo"
            />
            <div className="footer-text">Powered by RigSheet</div>
          </div>
          <div
            className="qr-code-container"
            aria-label="QR code linking to digital RigSheet profile"
          >
            <QRCode
              value={userProfileUrl}
              size={96}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
            />
          </div>
        </footer>
      </div>
    );
  }

  export default Printable;