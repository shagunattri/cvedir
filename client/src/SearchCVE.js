import React, { useState } from 'react';
import axios from 'axios';

const SearchCVE = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchVulnerability = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://localhost:5000/api/vulnerabilities', {
        params: {
          cveId: query.includes('CVE') ? query : null,
          description: !query.includes('CVE') ? query : null,
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching vulnerabilities', error);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={searchVulnerability}>
        <input
          type="text"
          placeholder="Enter CVE ID or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="results">
        {results.length > 0 && (
          <ul>
            {results.map((vuln) => (
              <li key={vuln._id}>
                <h3>{vuln.cveID}</h3>
                <p>{vuln.description}</p>
                <p>Severity: {vuln.severity}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchCVE;