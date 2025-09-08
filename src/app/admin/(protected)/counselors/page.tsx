
'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Users, FilePenLine } from 'lucide-react';
import SectionTitle from '@/components/ui/section-title';
import { updateCounselorRole } from '@/app/actions';

interface Counselor {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'counselor';
}

export default function ManageCounselorsPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'counselor'>('counselor');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'counselors'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const counselorData: Counselor[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Counselor, 'id'>
      }));
      setCounselors(counselorData);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching counselors:", err);
      setError("Failed to load counselor data. Please check permissions.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEditClick = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setNewRole(counselor.role);
    setIsModalOpen(true);
  };

  const handleRoleUpdate = async () => {
    if (!selectedCounselor) return;
    setIsUpdating(true);
    try {
      const result = await updateCounselorRole(selectedCounselor.id, newRole);
      if (result.success) {
        toast({ title: 'Success', description: 'Counselor role updated successfully.' });
        setIsModalOpen(false);
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading Counselors...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <SectionTitle
        title="Manage Counselors"
        subtitle="View and update roles for all registered counselors and admins."
      />

      <Card>
        <CardHeader>
          <CardTitle>Counselor List</CardTitle>
          <CardDescription>A list of all users with access to the admin and counselor dashboards.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {counselors.map((counselor) => (
                <TableRow key={counselor.id}>
                  <TableCell className="font-medium">{counselor.name}</TableCell>
                  <TableCell>{counselor.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${counselor.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                      {counselor.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(counselor)}>
                      <FilePenLine className="mr-2 h-4 w-4" /> Edit Role
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role for {selectedCounselor?.name}</DialogTitle>
            <DialogDescription>
              Change the user role for this counselor. 'Admin' role provides access to all management pages. 'Counselor' role restricts access to their assigned students only.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="role-select" className="text-right">Role</label>
              <Select value={newRole} onValueChange={(value: 'admin' | 'counselor') => setNewRole(value)}>
                <SelectTrigger id="role-select" className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="counselor">Counselor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleRoleUpdate} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
