
'use client';
import Image from 'next/image';
import Link from 'next/link';
import SectionTitle from '@/components/ui/section-title';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { services } from '@/lib/data.tsx';
import type { Service } from '@/lib/data.tsx';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function ServicesPage() {
  const [titleSectionRef, isTitleSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true });
  const [featuredServiceRef, isFeaturedServiceVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [otherServicesTitleRef, isOtherServicesTitleVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.1 });
  const [otherServicesGridRef, isOtherServicesGridVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.05 });
  const [ctaSectionRef, isCtaSectionVisible] = useScrollAnimation<HTMLElement>({ triggerOnExit: true, threshold: 0.2 });

  const englishPrepService = services.find(s => s.id === 'english-prep');
  const otherServices = services.filter(s => s.id !== 'english-prep');

  return (
    <div className="space-y-16 md:space-y-24">
      <div ref={titleSectionRef} className={cn("transition-all duration-700 ease-out", isTitleSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
        <SectionTitle 
          title="Our Comprehensive Services" 
          subtitle="We offer a wide range of services designed to support you at every step of your journey to studying abroad." 
        />
      </div>

      {/* Featured Service: English Test Preparation */}
      {englishPrepService && (
        <section 
          id={englishPrepService.id} 
          ref={featuredServiceRef}
          className={cn(
            "py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-lg shadow-xl transition-all duration-700 ease-out", 
            isFeaturedServiceVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div 
                className={cn(
                  "relative aspect-video rounded-lg shadow-xl overflow-hidden transition-all duration-500 ease-out",
                  isFeaturedServiceVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
                style={{transitionDelay: isFeaturedServiceVisible ? '100ms' : '0ms'}}
              >
                {englishPrepService.imageUrl && (
                  <Image 
                    src={englishPrepService.imageUrl} 
                    alt={englishPrepService.title} 
                    layout="fill" 
                    objectFit="cover" 
                    data-ai-hint={englishPrepService.dataAiHint || 'education support'}
                  />
                )}
              </div>
              <div 
                className={cn(
                  "space-y-4 transition-all duration-500 ease-out",
                  isFeaturedServiceVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                )}
                style={{transitionDelay: isFeaturedServiceVisible ? '200ms' : '0ms'}}
              >
                <div className="flex items-center space-x-3">
                  <englishPrepService.icon className="h-12 w-12 text-primary" />
                  <h2 className="text-4xl font-headline font-bold text-primary">{englishPrepService.title}</h2>
                </div>
                <p className="text-lg text-foreground/80">
                  {englishPrepService.longDescription || englishPrepService.description}
                </p>
                {englishPrepService.keyFeatures && englishPrepService.keyFeatures.length > 0 && (
                  <ul className="space-y-2 text-foreground/70">
                    {englishPrepService.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-accent mr-2 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="pt-4">
                  <Button size="lg" asChild variant="solid" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">
                    <Link href="/book-appointment"> {/* This is your English Test Guide page */}
                      View Test Guide & Book Class <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Other Services Section */}
      {otherServices.length > 0 && (
        <>
          <div ref={otherServicesTitleRef} className={cn("transition-all duration-700 ease-out", isOtherServicesTitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            <SectionTitle 
              title="Additional Support Services"
              subtitle="Comprehensive assistance for every aspect of your study abroad plan."
            />
          </div>
          <div ref={otherServicesGridRef} className={cn("grid md:grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-700 ease-out", isOtherServicesGridVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")}>
            {otherServices.map((service: Service, index: number) => {
              const [serviceCardRef, isServiceCardVisible] = useScrollAnimation<HTMLDivElement>({ triggerOnExit: true, threshold: 0.1 });
              return (
                <div key={service.id} ref={serviceCardRef} className={cn("transition-all duration-500 ease-out", isServiceCardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")} style={{transitionDelay: `${index * 100}ms`}}>
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card h-full flex flex-col">
                    {service.imageUrl && (
                      <div className="relative h-48 w-full">
                        <Image src={service.imageUrl} alt={service.title} layout="fill" objectFit="cover" data-ai-hint={service.dataAiHint || 'education service'} />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="font-headline text-primary flex items-center"><service.icon className="mr-2 h-6 w-6 text-accent" />{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-foreground/80 mb-3">{service.longDescription || service.description}</p>
                      {service.keyFeatures && service.keyFeatures.length > 0 && (
                        <ul className="space-y-1 text-sm text-foreground/70">
                          {service.keyFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="link" className="text-accent p-0 hover:text-primary">
                        <Link href={`/contact?service=${service.id}`}>
                          Inquire About This Service <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              );
            })}
          </div>
        </>
      )}
      
      {/* Call to Action Section */}
      <section 
        ref={ctaSectionRef}
        className={cn(
          "text-center py-16 bg-gradient-to-r from-primary to-accent rounded-lg shadow-xl transition-all duration-700 ease-out",
          isCtaSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            Let our experts help you navigate the path to your dream university.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-background text-primary font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-background/90 transition-colors duration-300 text-lg">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
