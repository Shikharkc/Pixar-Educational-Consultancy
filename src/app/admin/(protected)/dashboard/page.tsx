
'use client';

import { useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot, FirestoreError } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, BarChart3, Calendar, CheckCircle, Clock, Globe, Loader2, Users, ShieldAlert, LineChart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define the structure for the summary stats document
interface DashboardStats {
  totalStudents: number;
  studentsByCountry: { [country: string]: number };
  visaStatusCounts: { [status: string]: number };
  monthlyAdmissions: { [month: string]: number };
}

// Define colors for the charts
const PIE_CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
const BAR_CHART_COLOR = 'hsl(var(--chart-1))';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This component now ONLY listens to the efficient summary document.
    const statsDocRef = doc(db, 'metrics', 'dashboard');
    
    const unsubscribe = onSnapshot(statsDocRef, (doc) => {
      if (doc.exists()) {
        setError(null);
        setStats(doc.data() as DashboardStats);
      } else {
        // The summary document does not exist.
        setError('no-data');
        setStats(null); // Clear any old stats
      }
      setLoading(false);
    }, (err: FirestoreError) => {
      if (err.code === 'permission-denied') {
        setError('permission-denied');
      } else {
        console.error("Error listening to stats document:", err);
        setError("An unknown error occurred while loading dashboard data.");
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const countryChartData = useMemo(() => {
    if (!stats?.studentsByCountry) return [];
    return Object.entries(stats.studentsByCountry).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [stats]);

  const visaStatusChartData = useMemo(() => {
    if (!stats?.visaStatusCounts) return [];
    return Object.entries(stats.visaStatusCounts).map(([name, value]) => ({ name, value }));
  }, [stats]);
  
  const monthlyAdmissionsChartData = useMemo(() => {
    if (!stats?.monthlyAdmissions) return [];
    const sortedData = Object.entries(stats.monthlyAdmissions)
      .map(([month, value]) => ({ name: month, students: value }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return sortedData;
  }, [stats]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
     return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
             {error === 'permission-denied' ? (
                <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Action Required: Firestore Permissions</AlertTitle>
                    <AlertDescription>
                        The dashboard failed to load due to missing Firestore security rules. Please go to your Firebase Console, navigate to **Firestore Database &gt; Rules**, and ensure your rules allow authenticated users to read documents.
                    </AlertDescription>
                </Alert>
             ) : error === 'no-data' ? (
                <Alert>
                    <LineChart className="h-4 w-4" />
                    <AlertTitle>No Dashboard Data Found</AlertTitle>
                    <AlertDescription>
                        <p>The dashboard is ready, but the summary data hasn't been generated yet. This is expected on first run.</p>
                        <p className="font-semibold mt-2">To populate the dashboard, please run the following command in your terminal:</p>
                        <pre className="mt-2 p-2 bg-muted text-foreground rounded-md text-sm overflow-x-auto">
                            <code>
                                npx tsx scripts/aggregate-stats.ts
                            </code>
                        </pre>
                        <p className="mt-2">Run this command whenever you want to see the latest statistics. After the script finishes, refresh this page.</p>
                    </AlertDescription>
                </Alert>
             ) : (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>An unknown error occurred: {error}</AlertDescription>
                </Alert>
             )}
        </main>
     );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Total registered students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visa Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.visaStatusCounts?.Approved || 0}</div>
            <p className="text-xs text-muted-foreground">Total visas approved</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Destination</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countryChartData[0]?.name || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Most popular country</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visa Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.visaStatusCounts?.Pending || 0}</div>
            <p className="text-xs text-muted-foreground">Applications currently pending</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
                <CardTitle className="flex items-center"><Calendar className="mr-2 h-5 w-5" />Monthly New Students</CardTitle>
                <CardDescription>New student registrations over the last 12 months.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                 <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={monthlyAdmissionsChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="students" fill={BAR_CHART_COLOR} radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
             <CardHeader>
                <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5" />Students by Destination</CardTitle>
                <CardDescription>Distribution of students across preferred study destinations.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={countryChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                        {countryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                        ))}
                        </Pie>
                         <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
