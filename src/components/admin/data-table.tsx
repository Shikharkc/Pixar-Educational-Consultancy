
'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  endBefore,
  limitToLast,
  DocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Student } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DataTableProps {
  onRowSelect: (student: Student) => void;
  selectedStudentId?: string | null;
}

const PAGE_SIZE = 20;

export function DataTable({ onRowSelect, selectedStudentId }: DataTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);
  const [page, setPage] = useState(1);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [firstVisible, setFirstVisible] = useState<DocumentSnapshot | null>(null);

  const fetchStudents = async (direction: 'next' | 'prev' | 'initial' = 'initial') => {
    setLoading(true);
    try {
      let q;
      const studentsCollection = collection(db, 'students');

      if (direction === 'initial') {
        q = query(studentsCollection, orderBy('timestamp', 'desc'), limit(PAGE_SIZE));
      } else if (direction === 'next' && lastVisible) {
        q = query(studentsCollection, orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(PAGE_SIZE));
      } else if (direction === 'prev' && firstVisible) {
        q = query(studentsCollection, orderBy('timestamp', 'desc'), endBefore(firstVisible), limitToLast(PAGE_SIZE));
      } else {
        setLoading(false);
        return;
      }
      
      const documentSnapshots = await getDocs(q);
      const newStudents: Student[] = [];
      documentSnapshots.forEach((doc) => {
        newStudents.push({ id: doc.id, ...doc.data() } as Student);
      });
      
      if (!documentSnapshots.empty) {
        setStudents(newStudents);
        setFirstVisible(documentSnapshots.docs[0]);
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
        
        // Check if this is the last page
        const nextQuery = query(studentsCollection, orderBy('timestamp', 'desc'), startAfter(documentSnapshots.docs[documentSnapshots.docs.length - 1]), limit(1));
        const nextSnapshot = await getDocs(nextQuery);
        setIsLastPage(nextSnapshot.empty);

      } else {
        // This case handles when you click "Next" on the last page.
        // We don't want to clear the students, just indicate it's the end.
        if (direction === 'next') {
            setIsLastPage(true);
        } else if (direction === 'prev') {
            // This might happen if you go back to the first page.
            // Re-fetch initial to reset state correctly.
            fetchStudents('initial');
        }
      }

    } catch (error) {
      console.error("Error fetching students: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents('initial');
  }, []);
  
  const handleNextPage = () => {
    if (!isLastPage) {
        setPage(prev => prev + 1);
        fetchStudents('next');
    }
  };
  
  const handlePrevPage = () => {
    if (page > 1) {
        setPage(prev => prev - 1);
        fetchStudents('prev');
    }
  };
  
  const getFeeStatusBadgeVariant = (status: Student['serviceFeeStatus']) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Partial': return 'secondary';
      case 'Unpaid': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
       <div className="max-h-[calc(100vh-290px)] overflow-auto">
        <Table>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell className="h-24 text-center">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : students.length > 0 ? (
              students.map((student) => (
                <TableRow 
                  key={student.id} 
                  onClick={() => onRowSelect(student)}
                  className="cursor-pointer"
                  data-state={selectedStudentId === student.id ? 'selected' : 'unselected'}
                >
                  <TableCell className="font-medium p-3">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">{student.fullName}</span>
                        {student.assignedTo === 'Unassigned' && <Badge className="py-0.5 px-1.5 text-xs bg-accent text-accent-foreground">New</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{student.email}</div>
                    <div className="mt-1 flex items-center justify-between text-xs">
                       <span className="text-muted-foreground">{student.assignedTo || 'Unassigned'}</span>
                       <Badge variant={getFeeStatusBadgeVariant(student.serviceFeeStatus)} className="py-0.5 px-1.5 text-xs">
                          {student.serviceFeeStatus || 'N/A'}
                       </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="px-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={isLastPage}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
      </div>
    </div>
  );
}
