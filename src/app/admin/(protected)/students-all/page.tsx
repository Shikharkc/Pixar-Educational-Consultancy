
'use client';

import { useState, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  endBefore,
  limitToLast,
  Query,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Student } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StudentsAllTable } from '@/components/admin/students-all-table';
import { Loader2, Database, AlertTriangle, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import type { SortingState } from '@tanstack/react-table';

const PAGE_SIZE = 50;

export default function StudentsAllPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'timestamp', desc: true },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchStudents = useCallback(async (pageDirection: 'next' | 'prev' | 'first' = 'first') => {
    setIsLoading(true);
    setError(null);

    try {
      let q: Query<DocumentData>;
      const [sortField, sortDirection] = [sorting[0].id, sorting[0].desc ? 'desc' : 'asc'];

      if (pageDirection === 'next' && lastVisible) {
        q = query(
          collection(db, 'students'),
          orderBy(sortField, sortDirection),
          startAfter(lastVisible),
          limit(PAGE_SIZE)
        );
      } else if (pageDirection === 'prev' && firstVisible) {
        q = query(
          collection(db, 'students'),
          orderBy(sortField, sortDirection),
          endBefore(firstVisible),
          limitToLast(PAGE_SIZE)
        );
      } else {
        // First page
        q = query(
          collection(db, 'students'),
          orderBy(sortField, sortDirection),
          limit(PAGE_SIZE)
        );
        setCurrentPage(1);
      }

      const documentSnapshots = await getDocs(q);
      const studentData: Student[] = documentSnapshots.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      })) as Student[];

      if (studentData.length === 0 && pageDirection !== 'first') {
        toast({ title: "No more students", description: `You have reached the ${pageDirection === 'next' ? 'end' : 'beginning'} of the list.` });
        setIsLoading(false);
        return;
      }
      
      if (pageDirection === 'next') setCurrentPage(p => p + 1);
      if (pageDirection === 'prev' && currentPage > 1) setCurrentPage(p => p - 1);

      setStudents(studentData);
      setFirstVisible(documentSnapshots.docs[0] || null);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1] || null);
      if (!isDataLoaded) setIsDataLoaded(true);

    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch students. The database query might require an index. Please check the Firestore console for index creation links.');
    } finally {
      setIsLoading(false);
    }
  }, [lastVisible, firstVisible, sorting, isDataLoaded, currentPage, toast]);

  const handleSortChange = (newSorting: SortingState) => {
    setSorting(newSorting);
    // Reset pagination state when sorting changes
    setLastVisible(null);
    setFirstVisible(null);
    fetchStudents('first');
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Database className="mr-2" /> All Student Records</CardTitle>
          <CardDescription>
            View all student data with sorting and pagination. Click 'Load Students' to begin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isDataLoaded ? (
            <div className="text-center py-12">
              <Button onClick={() => fetchStudents('first')} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Load Students
              </Button>
              <p className="text-sm text-muted-foreground mt-2">Data will be loaded on demand to save resources.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {isLoading ? (
                 <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
              ) : (
                <StudentsAllTable
                  data={students}
                  sorting={sorting}
                  onSortChange={handleSortChange}
                />
              )}
              <div className="flex items-center justify-between space-x-2 py-4">
                <span className="text-sm text-muted-foreground">Page {currentPage}</span>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchStudents('prev')}
                        disabled={isLoading || currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchStudents('next')}
                        disabled={isLoading || students.length < PAGE_SIZE}
                    >
                        Next
                    </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
