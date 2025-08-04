
/**
 * One-time script to import student data from a CSV file into Firestore.
 *
 * How to run:
 * 1. Ensure you have Node.js and npm installed on your machine.
 * 2. Place this script in a 'scripts' folder at the root of your project.
 * 3. Place your exported 'students.csv' file in the same 'scripts' folder.
 * 4. Ensure your Firebase project credentials are set up for a local Node.js environment.
 *    - Go to Firebase Console > Project Settings > Service accounts.
 *    - Click "Generate new private key" and save the JSON file.
 *    - IMPORTANT: Rename the downloaded file to 'firebase-service-account.json' and place it in the root of your project.
 *    - IMPORTANT: Add 'firebase-service-account.json' to your .gitignore file to avoid committing it to version control.
 * 5. Install dependencies by running `npm install` in your project's root directory.
 * 6. Run the script from your project's root directory using the command: `npx tsx scripts/import-from-csv.ts`
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

// --- Configuration ---
const BATCH_SIZE = 250; // Firestore batch writes are limited to 500 operations.
const CSV_FILE_PATH = path.join(__dirname, 'students.csv'); // Assumes students.csv is in the same directory.
// --- End Configuration ---

// Initialize Firebase Admin SDK
// IMPORTANT: Ensure 'firebase-service-account.json' is in your project's root directory.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require(path.join(process.cwd(), 'firebase-service-account.json'));
  
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });

  console.log('Firebase Admin SDK initialized successfully.');

} catch (error) {
  console.error(
    "Error initializing Firebase Admin SDK. Did you create 'firebase-service-account.json' in the root of your project?"
  );
  console.error(error);
  process.exit(1);
}


const db = getFirestore();
const studentsCollection = db.collection('students');

interface StudentCSVRecord {
  'Timestamp': string;
  'Email Address': string;
  'Full Name': string;
  'Mobile Number': string;
  'Last Completed Education': string;
  'English Proficiency Test': string;
  'Preferred Study Destination': string;
  'Additional Notes / Specific Questions': string;
  [key: string]: any; // Allow other columns
}

async function importStudents() {
  const records: StudentCSVRecord[] = [];

  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.error(`Error: CSV file not found at ${CSV_FILE_PATH}`);
    console.error("Please make sure your 'students.csv' file is inside the 'scripts' folder.");
    return;
  }

  console.log(`Reading CSV file from: ${CSV_FILE_PATH}`);

  fs.createReadStream(CSV_FILE_PATH)
    .pipe(csv())
    .on('data', (data: StudentCSVRecord) => {
      // Basic validation to skip empty rows
      if (data['Full Name'] && data['Email Address']) {
        records.push(data);
      }
    })
    .on('end', async () => {
      console.log(`CSV file successfully processed. Found ${records.length} valid records.`);
      
      if (records.length === 0) {
        console.log("No records to import. Exiting.");
        return;
      }

      let totalImported = 0;
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = db.batch();
        const chunk = records.slice(i, i + BATCH_SIZE);

        console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(records.length / BATCH_SIZE)}...`);

        chunk.forEach(record => {
          const docRef = studentsCollection.doc(); // Auto-generate document ID
          
          const studentData = {
            fullName: record['Full Name'] || '',
            email: record['Email Address'] || '',
            mobileNumber: record['Mobile Number'] || '',
            lastCompletedEducation: record['Last Completed Education'] || '',
            englishProficiencyTest: record['English Proficiency Test'] || '',
            preferredStudyDestination: record['Preferred Study Destination'] || '',
            additionalNotes: record['Additional Notes / Specific Questions'] || '',
            timestamp: new Date(record['Timestamp']),
            // Set default values for fields not in the form
            visaStatus: 'Not Applied',
            serviceFeeStatus: 'Unpaid',
            assignedTo: 'Unassigned',
            emergencyContact: '',
            collegeUniversityName: '',
            serviceFeePaidDate: null,
            visaStatusUpdateDate: null,
          };
          
          batch.set(docRef, studentData);
        });

        try {
          await batch.commit();
          totalImported += chunk.length;
          console.log(`Successfully imported ${chunk.length} records in this batch.`);
        } catch (error) {
          console.error('Error committing batch:', error);
        }
      }
      
      console.log(`--------------------------------------------------`);
      console.log(`Import complete. Total records imported: ${totalImported}`);
      console.log(`--------------------------------------------------`);
    });
}

importStudents().catch(error => {
  console.error("An unexpected error occurred during the import process:", error);
});
