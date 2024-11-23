import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ConfigBuilder } from './SingboxConfigBuilder.js';
import { generateHtml } from './htmlBuilder.js';
import { ClashConfigBuilder } from './ClashConfigBuilder.js';
import { encodeBase64, decodeBase64 } from './utils.js';
import { PREDEFINED_RULE_SETS } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
  res.send(generateHtml('', '', '', req.protocol + '://' + req.get('host')));
});

app.post('/', async (req, res) => {
  const {
    input: inputString,
    selectedRules = [],
    customRuleDomains = [],
    customRuleIPs = [],
    customRuleNames = [],
    pin
  } = req.body;

  if (!inputString) {
    return res.status(400).send('Missing input parameter');
  }

  const customRules = customRuleDomains.map((domains, index) => ({
    sites: domains.split(',').map(site => site.trim()),
    ips: customRuleIPs[index].split(',').map(ip => ip.trim()),
    outbound: customRuleNames[index]
  }));

  const rulesToUse = selectedRules.length > 0 ? selectedRules : ['广告拦截', '谷歌服务', '国外媒体', '电报消息'];
  const baseUrl = req.protocol + '://' + req.get('host');
  
  const xrayUrl = `${baseUrl}/xray?config=${encodeURIComponent(inputString)}`;
  const singboxUrl = `${baseUrl}/singbox?config=${encodeURIComponent(inputString)}&selectedRules=${encodeURIComponent(JSON.stringify(rulesToUse))}&customRules=${encodeURIComponent(JSON.stringify(customRules))}${pin ? `&pin=${pin}` : ''}`;
  const clashUrl = `${baseUrl}/clash?config=${encodeURIComponent(inputString)}&selectedRules=${encodeURIComponent(JSON.stringify(rulesToUse))}&customRules=${encodeURIComponent(JSON.stringify(customRules))}${pin ? `&pin=${pin}` : ''}`;

  res.send(generateHtml(xrayUrl, singboxUrl, clashUrl));
});

// Config generation endpoints
app.get('/singbox', async (req, res) => {
  try {
    const { config: inputString, selectedRules, customRules, pin } = req.query;
    
    if (!inputString) {
      return res.status(400).send('Missing config parameter');
    }

    let parsedRules = PREDEFINED_RULE_SETS[selectedRules] || 
      JSON.parse(decodeURIComponent(selectedRules)) || 
      PREDEFINED_RULE_SETS.minimal;

    let parsedCustomRules = [];
    try {
      parsedCustomRules = JSON.parse(decodeURIComponent(customRules));
    } catch (error) {
      console.error('Error parsing customRules:', error);
    }

    const configBuilder = new ConfigBuilder(inputString, parsedRules, parsedCustomRules, pin);
    const config = await configBuilder.build();
    
    res.json(config);
  } catch (error) {
    console.error('Error generating Singbox config:', error);
    res.status(500).send('Error generating config');
  }
});

app.get('/clash', async (req, res) => {
  try {
    const { config: inputString, selectedRules, customRules, pin } = req.query;
    
    if (!inputString) {
      return res.status(400).send('Missing config parameter');
    }

    let parsedRules = PREDEFINED_RULE_SETS[selectedRules] || 
      JSON.parse(decodeURIComponent(selectedRules)) || 
      PREDEFINED_RULE_SETS.minimal;

    let parsedCustomRules = [];
    try {
      parsedCustomRules = JSON.parse(decodeURIComponent(customRules));
    } catch (error) {
      console.error('Error parsing customRules:', error);
    }

    const configBuilder = new ClashConfigBuilder(inputString, parsedRules, parsedCustomRules, pin);
    const config = await configBuilder.build();
    
    res.type('text/yaml').send(config);
  } catch (error) {
    console.error('Error generating Clash config:', error);
    res.status(500).send('Error generating config');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
