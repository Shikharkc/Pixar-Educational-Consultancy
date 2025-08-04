
'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { ArrowUpDown, ListFilter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type SortConfig = {
  key: keyof Student;
  direction: 'ascending' | 'descending';
};

interface DataTableProps {
  onRowSelect: (student: Student) => void;
  selectedStudentId?: string | null;
}

export function DataTable({ onRowSelect, selectedStudentId }: DataTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'timestamp', direction: 'descending' });
  
  useEffect(() => {
    // Load filter from localStorage on component mount
    const savedFilter = localStorage.getItem('assignedToFilter');
    if (savedFilter) {
      setAssignedToFilter(savedFilter);
    }
  }, []);

  useEffect(() => {
    // Save filter to localStorage whenever it changes
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
      setStudents(studentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleSort = (key: keyof Student) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedStudents = useMemo(() => {
    let sortableStudents = [...students];

    // Filtering logic
    sortableStudents = sortableStudents.filter((student) => {
      const name = student.fullName || '';
      const email = student.email || '';
      const matchesText =
        name.toLowerCase().includes(filter.toLowerCase()) ||
        email.toLowerCase().includes(filter.toLowerCase());

      const matchesAssignedTo =
        assignedToFilter === 'all' || student.assignedTo === assignedToFilter;

      return matchesText && matchesAssignedTo;
    });

    // Sorting logic
    if (sortConfig !== null) {
      sortableStudents.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (aValue instanceof Timestamp && bValue instanceof Timestamp) {
            if (aValue.toMillis() < bValue.toMillis()) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue.toMillis() > bValue.toMillis()) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableStudents;
  }, [students, filter, assignedToFilter, sortConfig]);

  const getVisaStatusBadgeVariant = (status: Student['visaStatus']) => {
    switch (status) {
      case 'Approved': return 'default'; // Or a custom 'success' variant
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      case 'Not Applied': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="px-2 flex items-center gap-4">
        <Input
          placeholder="Filter by name or email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm h-9"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <ListFilter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
             <DropdownMenuLabel>Assigned To</DropdownMenuLabel>
             <DropdownMenuSeparator />
             <DropdownMenuCheckboxItem checked={assignedToFilter === 'all'} onCheckedChange={() => setAssignedToFilter('all')}>All</DropdownMenuCheckboxItem>
             {counselorNames.map(counselor => (
                <DropdownMenuCheckboxItem key={counselor} checked={assignedToFilter === counselor} onCheckedChange={() => setAssignedToFilter(counselor)}>{counselor}</DropdownMenuCheckboxItem>
             ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-card">
        <div className="max-h-[calc(100vh-220px)] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead onClick={() => handleSort('fullName')} className="cursor-pointer">
                  Student <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                </TableHead>
                <TableHead onClick={() => handleSort('assignedTo')} className="cursor-pointer">
                  Assigned To <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                </TableHead>
                <TableHead onClick={() => handleSort('visaStatus')} className="cursor-pointer">
                  Visa Status <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Loading data...
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedStudents.length > 0 ? (
                filteredAndSortedStudents.map((student) => (
                  <TableRow 
                    key={student.id} 
                    onClick={() => onRowSelect(student)}
                    className="cursor-pointer"
                    data-state={selectedStudentId === student.id ? 'selected' : 'unselected'}
                  >
                    <TableCell className="font-medium">
                      <div>{student.fullName}</div>
                      <div className="text-xs text-muted-foreground">{student.email}</div>
                    </TableCell>
                    <TableCell>{student.assignedTo}</TableCell>
                    <TableCell>
                      <Badge variant={getVisaStatusBadgeVariant(student.visaStatus)}>
                        {student.visaStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
