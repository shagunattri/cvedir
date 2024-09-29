const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const Vulnerability = require('./models/Vulnerability');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Function to fetch vulnerabilities from CISA KEV and save to MongoDB
const fetchAndSaveVulnerabilities = async () => {
  try {
    const response = await axios.get('https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json');
    const vulnerabilities = response.data.vulnerabilities;

    // Clear the existing data in the database
    await Vulnerability.deleteMany({});

    for (const vuln of vulnerabilities) {
      const newVuln = new Vulnerability({
        cveID: vuln.cveID,
        vendorProject: vuln.vendorProject || 'Unknown',
        product: vuln.product || 'Unknown',
        vulnerabilityName: vuln.vulnerabilityName || 'No name available',
        dateAdded: new Date(vuln.dateAdded) || new Date(),
        shortDescription: vuln.shortDescription || 'No description available',
        requiredAction: vuln.requiredAction || 'No action required',
        dueDate: new Date(vuln.dueDate) || new Date(),
        knownRansomwareCampaignUse: vuln.knownRansomwareCampaignUse || 'Unknown',
        notes: vuln.notes || 'No notes available',
        cwes: vuln.cwes || [],
      });
      await newVuln.save();
    }

    console.log('Vulnerabilities saved to MongoDB');
  } catch (error) {
    console.error('Error fetching vulnerabilities:', error);
  }
};

// Endpoint to search for vulnerabilities by CVE ID
app.get('/api/vulnerabilities', async (req, res) => {
  const { cveId } = req.query;

  try {
    let query = {};
    if (cveId) query.cveID = { $regex: cveId, $options: 'i' };

    const vulnerabilities = await Vulnerability.find(query);
    res.json(vulnerabilities);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for vulnerabilities', error });
  }
});

// Start Server and fetch vulnerabilities from CISA
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  fetchAndSaveVulnerabilities();
});