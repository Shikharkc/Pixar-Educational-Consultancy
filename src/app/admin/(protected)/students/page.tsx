
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { StudentForm } from '@/components/admin/student-form';
import type { Student } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function StudentManagementPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleRowSelect = (student: Student) => {
    setSelectedStudent(student);
  };
  
  const handleDeselect = () => {
    setSelectedStudent(null);
  }

  // Effect to handle the custom event for adding a new student
  useEffect(() => {
    const handleOpenNewStudentForm = () => {
      // Create a dummy new student object to put the form in "create" mode
      const newStudent: Student = {
        id: '', // No ID for a new student
        timestamp: null as any, // Timestamp will be set on save
        fullName: '',
        email: '',
        mobileNumber: '',
        visaStatus: 'Not Applied',
        serviceFeeStatus: 'Unpaid',
        assignedTo: 'Unassigned',
      };
      setSelectedStudent(newStudent);
    };

    window.addEventListener('openNewStudentForm', handleOpenNewStudentForm);

    return () => {
      window.removeEventListener('openNewStudentForm', handleOpenNewStudentForm);
    };
  }, []);


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Welcome and Warning Section */}
       <Alert className="bg-primary/10 border-primary/20 text-primary-foreground">
        <Info className="h-5 w-5 text-primary" />
        <AlertTitle className="font-semibold text-primary">Welcome to the Student Management Dashboard!</AlertTitle>
        <AlertDescription className="text-foreground/80">
          To ensure fast load times and keep database costs low, this page displays the 20 newest student records by default.
          <span className="font-semibold block mt-1">To find any specific student, please use the search bar below.</span>
        </AlertDescription>
      </Alert>


      {/* Student Management Table and Form */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-3">
          <div className="lg:col-span-3 xl:col-span-1">
            <Card className="h-full">
              <CardHeader className="p-4">
                <CardTitle>Student List</CardTitle>
                <CardDescription>
                  Showing 20 newest students. Use search to find any student.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable onRowSelect={handleRowSelect} selectedStudentId={selectedStudent?.id} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-4 xl:col-span-2">
            {selectedStudent ? (
              <StudentForm 
                student={selectedStudent.id ? selectedStudent : null} 
                onFormClose={handleDeselect} 
                onFormSubmitSuccess={handleDeselect}
              />
            ) : (
              <Card className="h-full flex items-center justify-center bg-background border-dashed shadow-none">
                <div className="text-center text-muted-foreground p-8">
                   <Users className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                  <p className="font-semibold text-lg">No Student Selected</p>
                  <p className="text-sm">Please select a student from the list on the left to view their details or add a new student.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
  );
}
