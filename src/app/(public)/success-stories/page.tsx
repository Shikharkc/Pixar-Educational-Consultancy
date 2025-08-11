import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { visaSuccesses } from '@/lib/data.tsx';
import { CheckCircle, Trophy } from 'lucide-react';

export default function SuccessStoriesPage() {
  const countryOrder = ['USA', 'Australia', 'New Zealand', 'UK', 'Canada'];

  return (
    <div className="space-y-12 md:space-y-16">
      <section>
        <SectionTitle 
          title="Our Student Success Stories" 
          subtitle="We take pride in the achievements of our students. Here are some of the many who have successfully obtained their visas with our guidance."
        />
      </section>

      <section>
        <Tabs defaultValue="usa" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mx-auto mb-8">
            {countryOrder.map(country => (
              <TabsTrigger key={country} value={country.toLowerCase()} className="py-2.5 text-sm md:text-base">
                {country}
              </TabsTrigger>
            ))}
          </TabsList>

          {countryOrder.map(country => (
            <TabsContent key={country} value={country.toLowerCase()}>
              <Card className="shadow-lg bg-card">
                <CardHeader>
                  <CardTitle className="font-headline text-primary flex items-center">
                    <Trophy className="mr-2 h-6 w-6" /> Visa Success for {country}
                  </CardTitle>
                   <CardDescription>
                    A selection of students who have successfully received their visas for {country}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visaSuccesses[country]?.map((student, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg h-full"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.destination}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(!visaSuccesses[country] || visaSuccesses[country].length === 0) && (
                    <p className="text-center text-muted-foreground py-8">
                      More success stories for {country} will be updated soon!
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
}
