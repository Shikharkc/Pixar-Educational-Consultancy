
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Student, counselorNames } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { ListFilter, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface DataTableProps {
  onRowSelect: (student: Student) => void;
  selectedStudentId?: string | null;
}

export function DataTable({ onRowSelect, selectedStudentId }: DataTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [feeStatusFilter, setFeeStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    const savedFilter = localStorage.getItem('assignedToFilter');
    if (savedFilter) {
      setAssignedToFilter(savedFilter);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('assignedToFilter', assignedToFilter);
  }, [assignedToFilter]);

  useEffect(() => {
    const q = query(collection(db, 'students'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const studentsData: Student[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        studentsData.push({ 
          id: doc.id,
          ...data,
          timestamp: data.timestamp as Timestamp,
        } as Student);
      });
       // Snapshot listener already provides sorted data, so we can just set it.
      setStudents(studentsData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching students: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const filteredStudents = useMemo(() => {
    let processedStudents = students.filter((student) => {
      const name = student.fullName || '';
      const email = student.email || '';
      const matchesText =
        name.toLowerCase().includes(filter.toLowerCase()) ||
        email.toLowerCase().includes(filter.toLowerCase());

      const matchesAssignedTo =
        assignedToFilter === 'all' || student.assignedTo === assignedToFilter;
        
      const matchesFeeStatus = 
        feeStatusFilter === 'all' || student.serviceFeeStatus === feeStatusFilter;

      return matchesText && matchesAssignedTo && matchesFeeStatus;
    });

    // We only need to apply the alphabetical sort, as the default from Firestore is already 'latest'.
    if (sortBy === 'alphabetical') {
      processedStudents.sort((a, b) => {
        return (a.fullName || '').localeCompare(b.fullName || '');
      });
    }


    return processedStudents;
  }, [students, filter, assignedToFilter, feeStatusFilter, sortBy]);

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
      <div className="px-4 pt-2 flex flex-col gap-3">
        <Input
          placeholder="Search by name or email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-9 w-full"
        />
        <div className="flex items-center gap-2">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                <ListFilter className="mr-2 h-4 w-4" />
                Assigned: {assignedToFilter}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by Counselor</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={assignedToFilter} onValueChange={setAssignedToFilter}>
                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                    {counselorNames.map(counselor => (
                        <DropdownMenuRadioItem key={counselor} value={counselor}>{counselor}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button variant="outline" size="sm" className="flex-1">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    More Filters
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                    <DropdownMenuRadioItem value="latest">Latest First</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="alphabetical">Alphabetical (A-Z)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuLabel className="pt-2">Service Fee Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={feeStatusFilter} onValueChange={setFeeStatusFilter}>
                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Paid">Paid</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Unpaid">Unpaid</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Partial">Partial</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
      <div className="max-h-[calc(100vh-250px)] overflow-auto">
        <Table>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell className="h-24 text-center">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
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
                          {student.serviceFeeStatus}
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
    </div>
  );
}
