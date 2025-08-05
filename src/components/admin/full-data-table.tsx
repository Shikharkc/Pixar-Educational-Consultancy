
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp, limit, getDocs, startAfter, endBefore, limitToLast } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Student } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

type SortKey = keyof Student | 'timestamp';

const PAGE_SIZE = 20;

export function FullDataTable() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({
    key: 'timestamp',
    direction: 'descending',
  });
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [firstVisible, setFirstVisible] = useState<any>(null);
  const [isNextPageAvailable, setIsNextPageAvailable] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);


  const fetchStudents = async (direction: 'next' | 'prev' | 'initial' = 'initial') => {
    setLoading(true);
    try {
      let q;
      const studentsCollection = collection(db, 'students');
      
      const orderDirection = sortConfig.direction === 'ascending' ? 'asc' : 'desc';

      if (direction === 'initial') {
        q = query(studentsCollection, orderBy(sortConfig.key, orderDirection), limit(PAGE_SIZE));
      } else if (direction === 'next' && lastVisible) {
        q = query(studentsCollection, orderBy(sortConfig.key, orderDirection), startAfter(lastVisible), limit(PAGE_SIZE));
      } else if (direction === 'prev' && firstVisible) {
        q = query(studentsCollection, orderBy(sortConfig.key, orderDirection), endBefore(firstVisible), limitToLast(PAGE_SIZE));
      } else {
         setLoading(false);
         return;
      }

      const documentSnapshots = await getDocs(q);
      
      if (!documentSnapshots.empty) {
        const studentsData: Student[] = documentSnapshots.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as Student));

        setStudents(studentsData);
        setFirstVisible(documentSnapshots.docs[0]);
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
        
        // Check if there is a next page
        const nextQuery = query(studentsCollection, orderBy(sortConfig.key, orderDirection), startAfter(documentSnapshots.docs[documentSnapshots.docs.length - 1]), limit(1));
        const nextDocs = await getDocs(nextQuery);
        setIsNextPageAvailable(!nextDocs.empty);

      } else {
        // This handles clicking 'next' on the last page.
        if(direction === 'next') setIsNextPageAvailable(false);
        // If it was an initial load or going back to an empty state, clear students.
        if (direction !== 'next') setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students: ", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStudents('initial');
  }, [sortConfig]);

  const handleNext = () => {
    if (isNextPageAvailable) {
        setCurrentPage(prev => prev + 1);
        fetchStudents('next');
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
        setCurrentPage(prev => prev - 1);
        fetchStudents('prev');
    }
  };


  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    // Reset pagination when sort order changes
    setLastVisible(null);
    setFirstVisible(null);
    setCurrentPage(1);
    setIsNextPageAvailable(true);
  };
  
  const getSortIndicator = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  }
  
  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (timestamp && timestamp.toDate) {
      return format(timestamp.toDate(), 'PPP, p');
    }
    return 'N/A';
  };
  
   const getVisaStatusBadgeVariant = (status?: Student['visaStatus']) => {
    switch (status) {
      case 'Approved': return 'default';
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getFeeStatusBadgeVariant = (status?: Student['serviceFeeStatus']) => {
    switch (status) {
        case 'Paid': return 'default';
        case 'Partial': return 'secondary';
        case 'Unpaid': return 'outline';
        default: return 'outline';
    }
  };

  const columns: { key: SortKey; label: string; render?: (item: Student) => React.ReactNode }[] = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'mobileNumber', label: 'Mobile Number' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'visaStatus', label: 'Visa Status', render: (item) => <Badge variant={getVisaStatusBadgeVariant(item.visaStatus)}>{item.visaStatus || 'N/A'}</Badge> },
    { key: 'serviceFeeStatus', label: 'Service Fee Status', render: (item) => <Badge variant={getFeeStatusBadgeVariant(item.serviceFeeStatus)}>{item.serviceFeeStatus || 'N/A'}</Badge> },
    { key: 'preferredStudyDestination', label: 'Destination' },
    { key: 'lastCompletedEducation', label: 'Last Education' },
    { key: 'englishProficiencyTest', label: 'English Test' },
    { key: 'collegeUniversityName', label: 'College/University' },
    { key: 'emergencyContact', label: 'Emergency Contact' },
    { key: 'additionalNotes', label: 'Additional Notes' },
    { key: 'timestamp', label: 'Date Added', render: (item) => formatDate(item.timestamp) },
    { key: 'visaStatusUpdateDate', label: 'Visa Status Date', render: (item) => formatDate(item.visaStatusUpdateDate) },
    { key: 'serviceFeePaidDate', label: 'Fee Paid Date', render: (item) => formatDate(item.serviceFeePaidDate) },
  ];

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                 <TableHead key={col.key}>
                    <Button variant="ghost" onClick={() => requestSort(col.key as SortKey)} className="px-2 py-1 h-auto">
                        {col.label}
                        {getSortIndicator(col.key as SortKey)}
                    </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">Loading data...</TableCell>
              </TableRow>
            ) : students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-xs">
                      {col.render ? col.render(student) : (student[col.key as keyof Student] as React.ReactNode || 'N/A')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No results found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       <div className="flex items-center justify-end space-x-2 py-4 px-4">
        <span className="text-sm text-muted-foreground">Page {currentPage}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!isNextPageAvailable || loading}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
