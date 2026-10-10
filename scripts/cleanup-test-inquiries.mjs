import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      if (key === 'FIREBASE_PRIVATE_KEY') {
        val = val.replace(/\\n/g, '\n');
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];
const missing = requiredEnvVars.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error('Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

const { admin } = await import('../lib/firebase-admin.ts');
const db = admin.firestore();

const docsToDelete = [
  'MgdsYGLv6OdMGuvhB1GD',
  'MQjXMARdtCTCB2gPTrYs',
  'iD4seuV4OIxVcfjScqvJ',
  'QKH77XtfsMLmoZQKLhzF',
  'Z97SfilYTzrBfmNmoSEc'
];

async function cleanup() {
  let deleted = 0;
  let alreadyAbsent = 0;
  let errors = 0;

  for (const docId of docsToDelete) {
    try {
      const docRef = db.collection('inquiries').doc(docId);
      const snapshot = await docRef.get();
      
      if (!snapshot.exists) {
        console.log(`Document ${docId} already absent.`);
        alreadyAbsent++;
      } else {
        await docRef.delete();
        console.log(`Deleted document ${docId}.`);
        deleted++;
      }
    } catch (err) {
      console.error(`Error deleting ${docId}:`, err);
      errors++;
    }
  }

  console.log('--------------------------------------------------');
  console.log('Cleanup Summary');
  console.log(`Deleted:        ${deleted}`);
  console.log(`Already Absent: ${alreadyAbsent}`);
  console.log(`Errors:         ${errors}`);
}

cleanup()
  .then(() => process.exit(0))
  .catch(e => {
    console.error('Cleanup failed:', e);
    process.exit(1);
  });
