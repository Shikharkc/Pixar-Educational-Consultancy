
import { Award, Briefcase, Lightbulb, Users, MapPin, Landmark, TrendingUp, Globe, CalendarPlus, FileText, BookOpen, University as UniversityIcon, CheckCircle, Building, Heart, Handshake, Goal, MessageSquare, Search, Wand2, ExternalLink, Home, Info, Award as AwardIconLucide, GraduationCap, DollarSign, Clock, UserCheck, FileSpreadsheet } from 'lucide-react';
import type { ReactElement } from 'react';



export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah L.',
    text: "Pixar Edu made my dream of studying in Australia a reality. Their guidance was invaluable!",
    studyDestination: 'University of Melbourne, Australia',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '2',
    name: 'John B.',
    text: "The team at Pixar Edu is extremely knowledgeable and supportive. They helped me navigate the complex US visa process seamlessly.",
    studyDestination: 'Stanford University, USA',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: '3',
    name: 'Priya K.',
    text: "I highly recommend Pixar Edu for anyone looking to study in Europe. Their country guides and university suggestions were spot on.",
    studyDestination: 'ETH Zurich, Switzerland',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
];

export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  icon: React.ElementType;
  imageUrl?: string;
  dataAiHint?: string;
}

export const services: Service[] = [
  {
    id: '1',
    title: 'Documentation Assistance',
    description: 'Comprehensive support for all your application paperwork.',
    longDescription: 'Navigating the complex documentation requirements for international university applications can be daunting. We provide meticulous assistance with preparing, organizing, and reviewing all necessary documents, including transcripts, recommendation letters, statements of purpose, and financial proofs. Our goal is to ensure your application is complete, accurate, and compelling.',
    icon: Briefcase,
    imageUrl: '/da.png',
    dataAiHint: 'documents application',
  },
  {
    id: '2',
    title: 'Personalized Guidance',
    description: 'Tailored advice to match your academic goals and preferences.',
    longDescription: 'Every student is unique, with different aspirations and academic backgrounds. We offer personalized guidance sessions to understand your specific needs, help you choose the right courses and universities, and develop a strategic application plan. Our experienced counselors provide insights into various education systems and career pathways.',
    icon: Lightbulb,
    imageUrl: '/pg.jpg',
    dataAiHint: 'student guidance',
  },
  {
    id: '3',
    title: 'Visa & Pre-Departure Support',
    description: 'Expert help with visa applications and pre-departure preparations.',
    longDescription: 'Securing a student visa and preparing for life in a new country are crucial steps. We offer expert assistance with visa applications, including mock interviews and document checklists. Additionally, we provide comprehensive pre-departure briefings covering accommodation, cultural adaptation, and essential travel tips to ensure a smooth transition.',
    icon: Users,
    imageUrl: '/vsa.jpg',
    dataAiHint: 'travel preparation',
  },
];

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  dataAiHint?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Pradeep Khadka',
    role: 'Founder & CEO',
    bio: 'With over 15 years of experience in international education, Dr. Carter is passionate about helping students achieve their academic dreams.',
    imageUrl: '/co.jpg',
    dataAiHint: 'professional woman',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Senior Advisor - North America',
    bio: 'Michael specializes in US and Canadian university admissions, holding a Master\'s in Education Counseling.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'professional man',
  },
  {
    id: '3',
    name: 'Sophia Rossi',
    role: 'Lead Consultant - Europe & Australia',
    bio: 'Sophia has extensive knowledge of European and Australian education systems, guiding students with expertise.',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'consultant advisor',
  },
];

export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  logoUrl: string;
  dataAiHint?: string;
}

export const certifications: Certification[] = [
  {
    id: '1',
    name: 'Certified Education Consultant',
    issuingBody: 'Global Education Council',
    logoUrl: 'https://placehold.co/150x100.png',
    dataAiHint: 'certificate award',
  },
  {
    id: '2',
    name: 'International Student Advisor',
    issuingBody: 'Association of International Educators',
    logoUrl: 'https://placehold.co/150x100.png',
    dataAiHint: 'badge education',
  },
];

export interface University {
  name: string;
  city: string;
  countryFocus: string; 
  website: string;
}

export interface CountryInfo {
  id: string;
  name: string;
  slug: string;
  flagEmoji: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  averageLivingCost: string;
  workHoursStudent: string;
  visaInfoSummary: string;
  postStudyWorkSummary: string;
  facts: {
    icon: React.ElementType;
    label: string;
    value: string;
  }[];
  topUniversities: University[];
}

export const countryData: CountryInfo[] = [
  {
    id: 'europe',
    name: 'Europe',
    slug: 'europe',
    flagEmoji: '🇪🇺',
    description: 'Discover world-class education and rich cultural experiences across diverse European countries. Europe offers a wide range of programs in historic and modern universities.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'europe landmark',
    averageLivingCost: '€800 - €1,500 per month (varies widely by country and city)',
    workHoursStudent: 'Typically 10-20 hours/week during studies, full-time during breaks (varies by country).',
    visaInfoSummary: 'Schengen visa for short courses, National visa for longer studies. Requirements vary by country. Proof of funds and health insurance are key.',
    postStudyWorkSummary: 'Many European countries offer post-study work visas (e.g., "Orientation Year" in Netherlands, Job Seeker Visa in Germany) allowing graduates to find employment.',
    facts: [
      { icon: Landmark, label: 'Key Regions', value: 'UK, Germany, France, Netherlands, Spain, Italy etc.' },
      { icon: Globe, label: 'Languages', value: 'English widely used in academia; local languages beneficial.' },
      { icon: TrendingUp, label: 'Known For', value: 'Research, Engineering, Arts, Humanities, Business' },
    ],
    topUniversities: [
      { name: 'University of Oxford', city: 'Oxford, UK', countryFocus: 'Various', website: 'https://www.ox.ac.uk' },
      { name: 'ETH Zurich', city: 'Zurich, Switzerland', countryFocus: 'Science & Technology', website: 'https://ethz.ch' },
      { name: 'Sorbonne University', city: 'Paris, France', countryFocus: 'Arts & Humanities', website: 'https://www.sorbonne-universite.fr' },
      { name: 'Technical University of Munich', city: 'Munich, Germany', countryFocus: 'Engineering', website: 'https://www.tum.de' },
    ],
  },
  {
    id: 'australia',
    name: 'Australia',
    slug: 'australia',
    flagEmoji: '🇦🇺',
    description: 'Experience a high-quality education system in a vibrant, multicultural environment. Australian universities are known for their research and innovation.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'australia landmark',
    averageLivingCost: 'AUD $20,000 - $25,000 per year (approx. AUD $1,700 - $2,100 per month)',
    workHoursStudent: 'Up to 48 hours per fortnight during academic sessions, unlimited during scheduled breaks.',
    visaInfoSummary: 'Student visa (subclass 500). Requires Confirmation of Enrolment (CoE), Genuine Temporary Entrant (GTE) statement, financial proof, OSHC (health insurance).',
    postStudyWorkSummary: 'Temporary Graduate visa (subclass 485) allows eligible international students to stay and work in Australia temporarily after graduation.',
    facts: [
      { icon: Landmark, label: 'Major Cities', value: 'Sydney, Melbourne, Brisbane, Perth, Adelaide' },
      { icon: Globe, label: 'Language', value: 'English' },
      { icon: TrendingUp, label: 'Known For', value: 'STEM, Business, Health Sciences, Environmental Studies' },
    ],
    topUniversities: [
      { name: 'Australian National University', city: 'Canberra', countryFocus: 'Various', website: 'https://www.anu.edu.au' },
      { name: 'University of Melbourne', city: 'Melbourne', countryFocus: 'Various', website: 'https://www.unimelb.edu.au' },
      { name: 'University of Sydney', city: 'Sydney', countryFocus: 'Various', website: 'https://www.sydney.edu.au' },
      { name: 'University of Queensland', city: 'Brisbane', countryFocus: 'Various', website: 'https://www.uq.edu.au' },
    ],
  },
  {
    id: 'usa',
    name: 'USA',
    slug: 'usa',
    flagEmoji: '🇺🇸',
    description: 'Home to many of the world\'s top universities, the USA offers unparalleled educational opportunities across all fields of study.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'usa landmark',
    averageLivingCost: '$1,000 - $2,500 per month (highly variable by city and lifestyle)',
    workHoursStudent: 'Up to 20 hours/week on-campus during term; full-time on-campus during breaks. Off-campus work requires authorization (CPT/OPT).',
    visaInfoSummary: 'F-1 visa for academic studies. Requires I-20 form from university, SEVIS fee payment, proof of funds, and visa interview.',
    postStudyWorkSummary: 'Optional Practical Training (OPT) allows up to 12 months of work experience (extendable for STEM fields). H-1B visa is a common route for long-term employment.',
    facts: [
      { icon: Landmark, label: 'Key States for Study', value: 'California, New York, Massachusetts, Texas, Illinois' },
      { icon: Globe, label: 'Language', value: 'English' },
      { icon: TrendingUp, label: 'Known For', value: 'Technology, Business, Research, Arts, Innovation' },
    ],
    topUniversities: [
      { name: 'Massachusetts Institute of Technology (MIT)', city: 'Cambridge, MA', countryFocus: 'Technology & Engineering', website: 'https://web.mit.edu' },
      { name: 'Stanford University', city: 'Stanford, CA', countryFocus: 'Various', website: 'https://www.stanford.edu' },
      { name: 'Harvard University', city: 'Cambridge, MA', countryFocus: 'Various', website: 'https://www.harvard.edu' },
      { name: 'California Institute of Technology (Caltech)', city: 'Pasadena, CA', countryFocus: 'Science & Engineering', website: 'https://www.caltech.edu' },
    ],
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    slug: 'new-zealand',
    flagEmoji: '🇳🇿',
    description: 'Study in a safe and welcoming country with a world-class education system and stunning natural landscapes. New Zealand offers unique programs and research opportunities.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'new zealand landscape',
    averageLivingCost: 'NZD $15,000 - $20,000 per year (approx. NZD $1,250 - $1,670 per month)',
    workHoursStudent: 'Up to 20 hours/week during studies, full-time during scheduled holidays.',
    visaInfoSummary: 'Student Visa (Fee Paying Student Visa). Requires Offer of Place from an approved education provider, proof of funds, health and character requirements.',
    postStudyWorkSummary: 'Post-Study Work Visa available for eligible graduates, allowing them to work for any employer in New Zealand for 1 to 3 years depending on qualification.',
    facts: [
      { icon: Landmark, label: 'Main Cities', value: 'Auckland, Wellington, Christchurch, Dunedin' },
      { icon: Globe, label: 'Language', value: 'English, Māori' },
      { icon: TrendingUp, label: 'Known For', value: 'Agriculture, Environmental Science, Film, Tourism' },
    ],
    topUniversities: [
      { name: 'University of Auckland', city: 'Auckland', countryFocus: 'Various', website: 'https://www.auckland.ac.nz' },
      { name: 'University of Otago', city: 'Dunedin', countryFocus: 'Health Sciences, Humanities', website: 'https://www.otago.ac.nz' },
      { name: 'Victoria University of Wellington', city: 'Wellington', countryFocus: 'Law, Public Policy, Design', website: 'https://www.wgtn.ac.nz' },
      { name: 'University of Canterbury', city: 'Christchurch', countryFocus: 'Engineering, Science', website: 'https://www.canterbury.ac.nz' },
    ],
  },
];

export const fieldsOfStudy: string[] = [
  "Accounting",
  "Aerospace Engineering",
  "Agriculture",
  "Anthropology",
  "Architecture",
  "Art History",
  "Artificial Intelligence",
  "Astronomy",
  "Astrophysics",
  "Biochemistry",
  "Bioengineering",
  "Biology",
  "Biomedical Engineering",
  "Biotechnology",
  "Business Administration",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Cognitive Science",
  "Communications",
  "Computer Engineering",
  "Computer Science",
  "Creative Writing",
  "Criminology",
  "Cybersecurity",
  "Data Science",
  "Dentistry",
  "Design (Graphic, Industrial, etc.)",
  "Drama and Theatre Arts",
  "Earth Sciences",
  "Economics",
  "Education",
  "Electrical Engineering",
  "English Literature",
  "Environmental Science",
  "Fashion Design",
  "Film Studies",
  "Finance",
  "Fine Arts",
  "Food Science",
  "Forensic Science",
  "Genetics",
  "Geography",
  "Geology",
  "Health Sciences",
  "History",
  "Hospitality Management",
  "Human Resources Management",
  "Industrial Engineering",
  "Information Technology",
  "International Relations",
  "Journalism",
  "Kinesiology",
  "Languages and Linguistics",
  "Law",
  "Liberal Arts",
  "Library Science",
  "Marine Biology",
  "Marketing",
  "Materials Science",
  "Mathematics",
  "Mechanical Engineering",
  "Mechatronics",
  "Media Studies",
  "Medicine",
  "Microbiology",
  "Music",
  "Nanotechnology",
  "Neuroscience",
  "Nuclear Engineering",
  "Nursing",
  "Nutrition and Dietetics",
  "Oceanography",
  "Petroleum Engineering",
  "Pharmacy",
  "Philosophy",
  "Physics",
  "Physiology",
  "Political Science",
  "Psychology",
  "Public Health",
  "Robotics",
  "Social Work",
  "Sociology",
  "Software Engineering",
  "Space Science",
  "Sports Science",
  "Statistics",
  "Supply Chain Management",
  "Sustainable Development",
  "Telecommunications Engineering",
  "Tourism Management",
  "Urban Planning",
  "Veterinary Medicine",
  "Zoology",
];

// Data for Appointment Booking
export const appointmentServices = [
  { value: 'ielts_class_inquiry', label: 'IELTS Class Inquiry' },
  { value: 'pte_class_inquiry', label: 'PTE Class Inquiry' },
  { value: 'general_consultation', label: 'General Education Consultation' },
  { value: 'university_application_assistance', label: 'University Application Assistance' },
  { value: 'visa_counseling_usa', label: 'Visa Counseling (USA)' },
  { value: 'visa_counseling_australia', label: 'Visa Counseling (Australia)' },
  { value: 'visa_counseling_uk', label: 'Visa Counseling (UK)' },
  { value: 'visa_counseling_europe', label: 'Visa Counseling (Europe)' },
  { value: 'visa_counseling_new_zealand', label: 'Visa Counseling (New Zealand)' },
  { value: 'pre_departure_briefing', label: 'Pre-Departure Briefing' },
  { value: 'career_counseling', label: 'Career Counseling' },
  { value: 'other', label: 'Other (Please specify in notes)' },
];

export const appointmentStaff = [
  { value: 'pradeep_khadka', label: 'Pradeep Khadka (CEO)' },
  { value: 'pawan_acharye', label: 'Pawan Acharye' },
  { value: 'any_available', label: 'Any Available Advisor' },
];

export const appointmentTimeSlots = [
  '09:00 AM - 09:30 AM',
  '09:30 AM - 10:00 AM',
  '10:00 AM - 10:30 AM',
  '10:30 AM - 11:00 AM',
  '11:00 AM - 11:30 AM',
  '11:30 AM - 12:00 PM',
  '12:00 PM - 12:30 PM',
  '12:30 PM - 01:00 PM',
  '01:00 PM - 01:30 PM',
  '01:30 PM - 02:00 PM',
  '02:00 PM - 02:30 PM',
  '02:30 PM - 03:00 PM',
  '03:00 PM - 03:30 PM',
  '03:30 PM - 04:00 PM',
  '04:00 PM - 04:30 PM',
  '04:30 PM - 05:00 PM',
];

export const gpaScaleOptions = [
  { value: "4.0", label: "4.0 (or equivalent)" },
  { value: "3.7-3.9", label: "3.7 - 3.9 (or equivalent)" },
  { value: "3.3-3.6", label: "3.3 - 3.6 (or equivalent)" },
  { value: "3.0-3.2", label: "3.0 - 3.2 (or equivalent)" },
  { value: "2.5-2.9", label: "2.5 - 2.9 (or equivalent)" },
  { value: "Below 2.5", label: "Below 2.5 (or equivalent)" },
  { value: "N/A", label: "Not Applicable / Varies" },
];

export const educationLevelOptions = [
  { value: "Associate Degree", label: "Seeking Associate Degree" },
  { value: "Bachelor's Degree", label: "Seeking Bachelor's Degree" },
  { value: "Postgraduate Diploma", label: "Seeking Postgraduate Diploma" },
  { value: "Master's Degree", label: "Seeking Master's Degree" },
];


// Consolidating all icon exports from lucide-react that are used across the app
export {
  Award,
  AwardIconLucide,
  Briefcase,
  Lightbulb,
  Users,
  MapPin,
  Landmark,
  TrendingUp,
  Globe,
  CalendarPlus,
  FileText,
  BookOpen,
  UniversityIcon,
  CheckCircle,
  Building,
  Heart,
  Handshake,
  Goal,
  MessageSquare,
  Search,
  Wand2,
  ExternalLink,
  Home,
  Info,
  GraduationCap,
  DollarSign,
  Clock,
  UserCheck,
  FileSpreadsheet,
};

    

    