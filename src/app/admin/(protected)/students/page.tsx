
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { StudentForm } from '@/components/admin/student-form';
import type { Student } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Phone, CalendarCheck2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function StudentManagementPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState('recent');

  const handleRowSelect = (student: Student) => {
    setSelectedStudent(student);
  };
  
  const handleDeselect = () => {
    setSelectedStudent(null);
  }

  useEffect(() => {
    const handleOpenNewStudentForm = () => {
      const newStudent: Student = {
        id: '', 
        timestamp: null as any, 
        fullName: '',
        email: '',
        mobileNumber: '',
        visaStatus: 'Not Applied',
        serviceFeeStatus: 'Unpaid',
        assignedTo: 'Unassigned',
      };
      setSelectedStudent(newStudent);
      setActiveTab('recent'); // Switch to recent tab when adding a new student
    };

    window.addEventListener('openNewStudentForm', handleOpenNewStudentForm);

    return () => {
      window.removeEventListener('openNewStudentForm', handleOpenNewStudentForm);
    };
  }, []);


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 xl:grid-cols-3">
          <div className="lg:col-span-3 xl:col-span-1">
            <Card className="h-full">
              <CardHeader className="p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 rounded-t-lg rounded-b-none">
                          <TabsTrigger value="recent"><Users className="mr-2 h-4 w-4" />Recent / Walk-ins</TabsTrigger>
                          <TabsTrigger value="remote"><Phone className="mr-2 h-4 w-4" />Remote Inquiries</TabsTrigger>
                      </TabsList>
                      <TabsContent value="recent" className="m-0">
                          <CardDescription className="px-4 pt-2 pb-0 text-xs">
                            Showing the 20 newest students. Use the search bar to find any student.
                          </CardDescription>
                          <DataTable onRowSelect={handleRowSelect} selectedStudentId={selectedStudent?.id} filterMode="recent" />
                      </TabsContent>
                      <TabsContent value="remote" className="m-0">
                           <CardDescription className="px-4 pt-2 pb-0 text-xs">
                            Showing all unassigned remote inquiries. Assign to a counselor to remove from this list.
                          </CardDescription>
                          <DataTable onRowSelect={handleRowSelect} selectedStudentId={selectedStudent?.id} filterMode="remote" />
                      </TabsContent>
                  </Tabs>
              </CardHeader>
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
