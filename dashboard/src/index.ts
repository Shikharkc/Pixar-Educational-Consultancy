
/**
 * @fileOverview Cloud Functions for automatically aggregating student metrics.
 *
 * This set of functions listens for changes in the 'students' collection
 * and automatically updates a summary document in 'metrics/dashboard'.
 * This allows the admin dashboard to load instantly and stay in real-time
 * without needing to query the entire student collection.
 *
 * Functions:
 * - onStudentChange: Triggered when a student is created, updated, or deleted.
 */

import {onDocumentWritten} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Define a reusable transaction-based update function
const updateMetrics = async (
  docRef: admin.firestore.DocumentReference,
  updateFn: (data: admin.firestore.DocumentData) => admin.firestore.DocumentData
) => {
  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);
    const data = doc.data() || {};
    const updatedData = updateFn(data);
    transaction.set(docRef, updatedData, {merge: true});
  });
};

/**
 * Increments a counter within a nested map.
 * e.g., studentsByCounselor['John Doe']++
 * @param {number | undefined} currentValue The current value of the counter.
 * @return {admin.firestore.FieldValue} The FieldValue to increment.
 */
const increment = (
  currentValue: number | undefined
): admin.firestore.FieldValue => {
  return admin.firestore.FieldValue.increment(currentValue === undefined ? 1: 1);
};

/**
 * Decrements a counter within a nested map.
 * Ensures the counter does not go below zero.
 * @param {number | undefined} currentValue The current value of the counter.
 * @return {admin.firestore.FieldValue} The FieldValue to decrement.
 */
const decrement = (
  currentValue: number | undefined
): admin.firestore.FieldValue => {
  const value = currentValue === undefined || currentValue <= 0 ? 0 : -1;
  return admin.firestore.FieldValue.increment(value);
};


// --- Cloud Function Triggers ---

/**
 * Triggered when a student document is created, updated, or deleted.
 * Intelligently increments and decrements counters in the metrics document.
 */
export const onStudentChange = onDocumentWritten("students/{studentId}",
  async (event) => {
    const metricsRef = db.collection("metrics").doc("dashboard");

    await updateMetrics(metricsRef, (data) => {
      const before = event.data?.before.data();
      const after = event.data?.after.data();

      // --- Handle Deletes ---
      if (!after) {
        if (!before) return data; // Should not happen, but safeguard
        data.totalStudents = decrement(data.totalStudents);
        const dest = before.preferredStudyDestination || "N/A";
        data.studentsByDestination = {...data.studentsByDestination, [dest]: decrement(data.studentsByDestination?.[dest])};
        const visa = before.visaStatus || "Not Applied";
        data.visaStatusCounts = {...data.visaStatusCounts, [visa]: decrement(data.visaStatusCounts?.[visa])};
        const coun = before.assignedTo || "Unassigned";
        data.studentsByCounselor = {...data.studentsByCounselor, [coun]: decrement(data.studentsByCounselor?.[coun])};
        const fee = before.serviceFeeStatus || "Unpaid";
        data.serviceFeeStatusCounts = {...data.serviceFeeStatusCounts, [fee]: decrement(data.serviceFeeStatusCounts?.[fee])};
        const edu = before.lastCompletedEducation || "N/A";
        data.studentsByEducation = {...data.studentsByEducation, [edu]: decrement(data.studentsByEducation?.[edu])};
        const test = before.englishProficiencyTest || "N/A";
        data.studentsByEnglishTest = {...data.studentsByEnglishTest, [test]: decrement(data.studentsByEnglishTest?.[test])};
        return data;
      }

      // --- Handle Creates ---
      if (!before) {
        data.totalStudents = increment(data.totalStudents);
        const dest = after.preferredStudyDestination || "N/A";
        data.studentsByDestination = {...data.studentsByDestination, [dest]: increment(data.studentsByDestination?.[dest])};
        const visa = after.visaStatus || "Not Applied";
        data.visaStatusCounts = {...data.visaStatusCounts, [visa]: increment(data.visaStatusCounts?.[visa])};
        const coun = after.assignedTo || "Unassigned";
        data.studentsByCounselor = {...data.studentsByCounselor, [coun]: increment(data.studentsByCounselor?.[coun])};
        const fee = after.serviceFeeStatus || "Unpaid";
        data.serviceFeeStatusCounts = {...data.serviceFeeStatusCounts, [fee]: increment(data.serviceFeeStatusCounts?.[fee])};
        const edu = after.lastCompletedEducation || "N/A";
        data.studentsByEducation = {...data.studentsByEducation, [edu]: increment(data.studentsByEducation?.[edu])};
        const test = after.englishProficiencyTest || "N/A";
        data.studentsByEnglishTest = {...data.studentsByEnglishTest, [test]: increment(data.studentsByEnglishTest?.[test])};

        // Monthly admissions tracking for new students
        const date = after.timestamp.toDate();
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        data.monthlyAdmissions = {...data.monthlyAdmissions, [monthYear]: increment(data.monthlyAdmissions?.[monthYear])};
        return data;
      }

      // --- Handle Updates ---
      const changed = (field: string) => before[field] !== after[field];

      if (changed("preferredStudyDestination")) {
        const oldVal = before.preferredStudyDestination || "N/A";
        const newVal = after.preferredStudyDestination || "N/A";
        data.studentsByDestination = {...data.studentsByDestination, [oldVal]: decrement(data.studentsByDestination?.[oldVal]), [newVal]: increment(data.studentsByDestination?.[newVal])};
      }
      if (changed("visaStatus")) {
        const oldVal = before.visaStatus || "Not Applied";
        const newVal = after.visaStatus || "Not Applied";
        data.visaStatusCounts = {...data.visaStatusCounts, [oldVal]: decrement(data.visaStatusCounts?.[oldVal]), [newVal]: increment(data.visaStatusCounts?.[newVal])};
      }
      if (changed("assignedTo")) {
        const oldVal = before.assignedTo || "Unassigned";
        const newVal = after.assignedTo || "Unassigned";
        data.studentsByCounselor = {...data.studentsByCounselor, [oldVal]: decrement(data.studentsByCounselor?.[oldVal]), [newVal]: increment(data.studentsByCounselor?.[newVal])};
      }
      if (changed("serviceFeeStatus")) {
        const oldVal = before.serviceFeeStatus || "Unpaid";
        const newVal = after.serviceFeeStatus || "Unpaid";
        data.serviceFeeStatusCounts = {...data.serviceFeeStatusCounts, [oldVal]: decrement(data.serviceFeeStatusCounts?.[oldVal]), [newVal]: increment(data.serviceFeeStatusCounts?.[newVal])};
      }
      if (changed("lastCompletedEducation")) {
        const oldVal = before.lastCompletedEducation || "N/A";
        const newVal = after.lastCompletedEducation || "N/A";
        data.studentsByEducation = {...data.studentsByEducation, [oldVal]: decrement(data.studentsByEducation?.[oldVal]), [newVal]: increment(data.studentsByEducation?.[newVal])};
      }
      if (changed("englishProficiencyTest")) {
        const oldVal = before.englishProficiencyTest || "N/A";
        const newVal = after.englishProficiencyTest || "N/A";
        data.studentsByEnglishTest = {...data.studentsByEnglishTest, [oldVal]: decrement(data.studentsByEnglishTest?.[oldVal]), [newVal]: increment(data.studentsByEnglishTest?.[newVal])};
      }
      return data;
    });
  });
