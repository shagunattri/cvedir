import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [cveId, setCveId] = useState('');
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.get(`http://localhost:5001/api/vulnerabilities?cveId=${cveId}`);
      setResult(response.data);
    } catch (err) {
      setError('Failed to fetch vulnerabilities. Please try again.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>CVE Analyzer</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter CVE ID"
          value={cveId}
          onChange={(e) => setCveId(e.target.value)}
          required
        />
        <button type="submit"> 🔎 (Search)</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result.length > 0 && (
        <div>
          <h2>CVE Results:</h2>
          {result.map((vuln) => (
            <div key={vuln.cveID} style={{ margin: '10px 0', border: '1px solid #ccc', padding: '10px' }}>
              <h3>{vuln.vulnerabilityName}</h3>
              <p><strong>CVE ID:</strong> {vuln.cveID}</p>
              <p><strong>Vendor Project:</strong> {vuln.vendorProject}</p>
              <p><strong>Product:</strong> {vuln.product}</p>
              <p><strong>Date Added:</strong> {new Date(vuln.dateAdded).toLocaleDateString()}</p>
              <p><strong>Short Description:</strong> {vuln.shortDescription}</p>
              <p><strong>Required Action:</strong> {vuln.requiredAction}</p>
              <p><strong>Due Date:</strong> {new Date(vuln.dueDate).toLocaleDateString()}</p>
              <p><strong>Known Ransomware Campaign Use:</strong> {vuln.knownRansomwareCampaignUse}</p>
              <p><strong>Notes:</strong> <a href={vuln.notes} target="_blank" rel="noopener noreferrer">{vuln.notes}</a></p>
              <p><strong>CWEs:</strong> {vuln.cwes.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;