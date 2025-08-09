/**
 * @fileOverview Firebase Cloud Function to aggregate student data for a real-time analytics dashboard.
 *
 * This function listens for onCreate, onUpdate, and onDelete events in the 'students' Firestore collection.
 * It maintains a single aggregation document at 'metrics/dashboard' with various counts and breakdowns.
 * All writes are batched for efficiency.
 *
 * To deploy this function, you would typically use the Firebase CLI:
 * `firebase deploy --only functions:aggregateStudentMetrics`
 *
 * Ensure your Firebase project is correctly configured in your environment.
 */

import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

export const aggregateStudentMetrics = onDocumentWritten(
  'students/{studentId}',
  async (event) => {
    const metricsRef = db.collection('metrics').doc('dashboard');
    const batch = db.batch();

    const data = event.data?.after.data();
    const previousData = event.data?.before.data();

    // Data for incrementing/decrementing nested map fields
    const fieldsToIncrement: Record<string, string> = {
      byDestination: data?.preferredStudyDestination,
      byEducation: data?.lastCompletedEducation,
      byCounselor: data?.assignedTo,
      byEnglishTest: data?.englishProficiencyTest,
    };

    const fieldsToDecrement: Record<string, string> = {
      byDestination: previousData?.preferredStudyDestination,
      byEducation: previousData?.lastCompletedEducation,
      byCounselor: previousData?.assignedTo,
      byEnglishTest: previousData?.englishProficiencyTest,
    };

    if (!event.data?.before.exists && event.data?.after.exists) {
      // --- Document was CREATED ---
      batch.set(metricsRef, { totalStudents: FieldValue.increment(1) }, { merge: true });

      if (data?.visaStatus === 'Approved') {
        batch.set(metricsRef, { visaGranted: FieldValue.increment(1) }, { merge: true });
      } else if (data?.visaStatus === 'Pending') {
        batch.set(metricsRef, { pendingVisa: FieldValue.increment(1) }, { merge: true });
      }

      for (const [field, value] of Object.entries(fieldsToIncrement)) {
        if (value) {
          batch.set(metricsRef, { [field]: { [value]: FieldValue.increment(1) } }, { merge: true });
        }
      }

    } else if (event.data?.before.exists && !event.data?.after.exists) {
      // --- Document was DELETED ---
      batch.set(metricsRef, { totalStudents: FieldValue.increment(-1) }, { merge: true });

      if (previousData?.visaStatus === 'Approved') {
        batch.set(metricsRef, { visaGranted: FieldValue.increment(-1) }, { merge: true });
      } else if (previousData?.visaStatus === 'Pending') {
        batch.set(metricsRef, { pendingVisa: FieldValue.increment(-1) }, { merge: true });
      }

      for (const [field, value] of Object.entries(fieldsToDecrement)) {
        if (value) {
          batch.set(metricsRef, { [field]: { [value]: FieldValue.increment(-1) } }, { merge: true });
        }
      }

    } else if (event.data?.before.exists && event.data?.after.exists) {
      // --- Document was UPDATED ---
      // Check for changes in visa status
      const visaStatusBefore = previousData?.visaStatus;
      const visaStatusAfter = data?.visaStatus;

      if (visaStatusBefore !== visaStatusAfter) {
        if (visaStatusBefore === 'Approved') {
          batch.set(metricsRef, { visaGranted: FieldValue.increment(-1) }, { merge: true });
        } else if (visaStatusBefore === 'Pending') {
          batch.set(metricsRef, { pendingVisa: FieldValue.increment(-1) }, { merge: true });
        }

        if (visaStatusAfter === 'Approved') {
          batch.set(metricsRef, { visaGranted: FieldValue.increment(1) }, { merge: true });
        } else if (visaStatusAfter === 'Pending') {
          batch.set(metricsRef, { pendingVisa: FieldValue.increment(1) }, { merge: true });
        }
      }

      // Check for changes in categorical fields
      for (const field in fieldsToIncrement) {
        const valueBefore = fieldsToDecrement[field];
        const valueAfter = fieldsToIncrement[field];
        if (valueBefore !== valueAfter) {
          if (valueBefore) {
            batch.set(metricsRef, { [field]: { [valueBefore]: FieldValue.increment(-1) } }, { merge: true });
          }
          if (valueAfter) {
            batch.set(metricsRef, { [field]: { [valueAfter]: FieldValue.increment(1) } }, { merge: true });
          }
        }
      }
    }

    try {
      await batch.commit();
      console.log('Metrics successfully updated.');
    } catch (error) {
      console.error('Error committing batch for metrics update:', error);
    }
  }
);
