import React, { useEffect } from 'react';
import VehicleInfo from '../components/VehicleInfo';
import QRCode from 'react-qr-code';
import '../styles/Printable.css';
import useAppStore from '../store/useAppStore';

/**
 * Printable.js
 *
 * Print-friendly summary of the current rig:
 *  - Vehicle header block (owner, make/model, nickname, image)
 *  - Tabular list of modifications
 *  - Footer with branding and QR code to public profile
 *
 * Data:
 *  - Pulled from the centralized Zustand store (userId, vehicleInfo, mods)
 *  - If vehicle changes, re-fetch its mods
 *
 * UX:
 *  - Lightweight loading/error states (kept minimal for printing contexts)
 */
function Printable() {
  // Pull state from the store
  const userId      = useAppStore((s) => s.userId);
  const vehicleInfo = useAppStore((s) => s.vehicleInfo);
  const mods        = useAppStore((s) => s.mods) || [];
  const loading     = useAppStore((s) => s.loading);
  const error       = useAppStore((s) => s.error);

  // Build public profile URL for QR code
  const userProfileUrl = `https://rigsheet.app/user/${userId}`;

  /**
   * Effect: when vehicle id changes, fetch fresh mods.
   * We call the store method through getState() to avoid function-identity
   * changes retriggering the effect (prevents infinite loops).
   */
  useEffect(() => {
    if (vehicleInfo?.id) {
      useAppStore.getState().fetchModsForVehicle(vehicleInfo.id)
        .catch(() => { /* error is surfaced via store.error */ });
    }
  }, [vehicleInfo?.id]);

  // --- Render states (kept simple to remain print-friendly) ---
  if (loading && !vehicleInfo) {
    return <div className="loading print-loading">Preparing your printable build…</div>;
  }

  if (error && !vehicleInfo) {
    return <div className="error print-error">Couldn’t load your build. {error}</div>;
  }

  // --- Main printable content ---
  return (
    <div className="print-page">
      {/* Vehicle block */}
      {vehicleInfo && <VehicleInfo info={vehicleInfo} />}

      {/* Header with print action */}
      <header className="print-header">
        <h1>RigSheet: Build Summary</h1>
        <button className="print-button" onClick={() => window.print()}>
          🖨️ Print Page
        </button>
      </header>

      {/* Mods table */}
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
          {mods.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                No modifications found for this vehicle.
              </td>
            </tr>
          ) : (
            mods.map((mod) => (
              <tr key={mod.id}>
                <td>{mod.name}</td>
                <td>{mod.brand}</td>
                <td>{mod.category}</td>
                <td>{mod.weight ?? '—'}</td>
                <td>
                  {typeof mod.price === 'number'
                    ? `$${mod.price.toFixed(2)}`
                    : (mod.price ?? 'N/A')}
                </td>
                <td>{mod.sponsored ? 'Yes' : 'No'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Footer branding + QR */}
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