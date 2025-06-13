
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
    id: 'australia',
    name: 'Australia',
    slug: 'australia',
    flagEmoji: '🇦🇺',
    description: 'Experience a high-quality education system in a vibrant, multicultural environment. Australian universities are known for their research and innovation.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'australia landmark',
    averageLivingCost: 'AUD $20,000 - $25,000 per year',
    workHoursStudent: 'Up to 48 hours per fortnight during academic sessions, unlimited during scheduled breaks.',
    visaInfoSummary: 'Student visa (subclass 500). Requires CoE, GTE statement, financial proof, OSHC.',
    postStudyWorkSummary: 'Temporary Graduate visa (subclass 485) allows eligible students to stay and work.',
    facts: [
      { icon: Landmark, label: 'Major Cities', value: 'Sydney, Melbourne, Brisbane, Perth, Adelaide' },
      { icon: Globe, label: 'Language', value: 'English' },
      { icon: TrendingUp, label: 'Known For', value: 'STEM, Business, Health Sciences' },
    ],
    topUniversities: [
      { name: 'Australian National University', city: 'Canberra', countryFocus: 'Various', website: 'https://www.anu.edu.au' },
      { name: 'University of Melbourne', city: 'Melbourne', countryFocus: 'Various', website: 'https://www.unimelb.edu.au' },
      { name: 'University of Sydney', city: 'Sydney', countryFocus: 'Various', website: 'https://www.sydney.edu.au' },
    ],
  },
  {
    id: 'canada',
    name: 'Canada',
    slug: 'canada',
    flagEmoji: '🇨🇦',
    description: 'Canada offers a high standard of living, diverse culture, and excellent educational institutions. It is a popular choice for international students.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'canada landmark',
    averageLivingCost: 'CAD $15,000 - $20,000 per year',
    workHoursStudent: 'Up to 20 hours/week during regular academic sessions, full-time during scheduled breaks.',
    visaInfoSummary: 'Study Permit required. Need an acceptance letter from a DLI, proof of financial support.',
    postStudyWorkSummary: 'Post-Graduation Work Permit (PGWP) allows graduates to gain Canadian work experience.',
    facts: [
      { icon: Landmark, label: 'Major Cities', value: 'Toronto, Montreal, Vancouver, Ottawa' },
      { icon: Globe, label: 'Languages', value: 'English, French' },
      { icon: TrendingUp, label: 'Known For', value: 'Technology, Engineering, Business, Health Sciences' },
    ],
    topUniversities: [
      { name: 'University of Toronto', city: 'Toronto', countryFocus: 'Various', website: 'https://www.utoronto.ca' },
      { name: 'McGill University', city: 'Montreal', countryFocus: 'Various', website: 'https://www.mcgill.ca' },
      { name: 'University of British Columbia', city: 'Vancouver', countryFocus: 'Various', website: 'https://www.ubc.ca' },
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
    averageLivingCost: '$1,000 - $2,500 per month (highly variable)',
    workHoursStudent: 'Up to 20 hours/week on-campus during term; CPT/OPT for off-campus.',
    visaInfoSummary: 'F-1 visa for academic studies. Requires I-20, SEVIS fee, proof of funds, interview.',
    postStudyWorkSummary: 'OPT allows up to 12 months work (extendable for STEM). H-1B for long-term.',
    facts: [
      { icon: Landmark, label: 'Key States', value: 'California, New York, Massachusetts, Texas' },
      { icon: Globe, label: 'Language', value: 'English' },
      { icon: TrendingUp, label: 'Known For', value: 'Technology, Business, Research, Arts' },
    ],
    topUniversities: [
      { name: 'Massachusetts Institute of Technology (MIT)', city: 'Cambridge, MA', countryFocus: 'Technology & Engineering', website: 'https://web.mit.edu' },
      { name: 'Stanford University', city: 'Stanford, CA', countryFocus: 'Various', website: 'https://www.stanford.edu' },
      { name: 'Harvard University', city: 'Cambridge, MA', countryFocus: 'Various', website: 'https://www.harvard.edu' },
    ],
  },
  {
    id: 'uk',
    name: 'UK',
    slug: 'uk',
    flagEmoji: '🇬🇧',
    description: 'The United Kingdom boasts a rich academic heritage with world-renowned universities, offering a diverse range of courses and a vibrant student life.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'uk landmark',
    averageLivingCost: '£1,000 - £1,500 per month (London higher)',
    workHoursStudent: 'Up to 20 hours/week during term-time for degree students.',
    visaInfoSummary: 'Student visa. Requires CAS from a licensed sponsor, proof of funds, English proficiency.',
    postStudyWorkSummary: 'Graduate Route allows 2 years stay (3 for PhD) after course completion.',
    facts: [
      { icon: Landmark, label: 'Major Cities', value: 'London, Manchester, Birmingham, Edinburgh' },
      { icon: Globe, label: 'Language', value: 'English' },
      { icon: TrendingUp, label: 'Known For', value: 'Finance, Law, Arts & Humanities, Science' },
    ],
    topUniversities: [
      { name: 'University of Oxford', city: 'Oxford', countryFocus: 'Various', website: 'https://www.ox.ac.uk' },
      { name: 'University of Cambridge', city: 'Cambridge', countryFocus: 'Various', website: 'https://www.cam.ac.uk' },
      { name: 'Imperial College London', city: 'London', countryFocus: 'Science, Engineering, Medicine', website: 'https://www.imperial.ac.uk' },
    ],
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    slug: 'new-zealand',
    flagEmoji: '🇳🇿',
    description: 'Study in a safe, welcoming country with a world-class education system and stunning natural landscapes. Offers unique programs and research opportunities.',
    imageUrl: 'https://placehold.co/1200x400.png',
    dataAiHint: 'new zealand landscape',
    averageLivingCost: 'NZD $15,000 - $20,000 per year',
    workHoursStudent: 'Up to 20 hours/week during studies, full-time during holidays.',
    visaInfoSummary: 'Student Visa. Requires Offer of Place, proof of funds, health & character checks.',
    postStudyWorkSummary: 'Post-Study Work Visa for 1-3 years for eligible graduates.',
    facts: [
      { icon: Landmark, label: 'Main Cities', value: 'Auckland, Wellington, Christchurch, Dunedin' },
      { icon: Globe, label: 'Language', value: 'English, Māori' },
      { icon: TrendingUp, label: 'Known For', value: 'Agriculture, Environmental Science, Film' },
    ],
    topUniversities: [
      { name: 'University of Auckland', city: 'Auckland', countryFocus: 'Various', website: 'https://www.auckland.ac.nz' },
      { name: 'University of Otago', city: 'Dunedin', countryFocus: 'Health Sciences, Humanities', website: 'https://www.otago.ac.nz' },
      { name: 'Victoria University of Wellington', city: 'Wellington', countryFocus: 'Law, Public Policy, Design', website: 'https://www.wgtn.ac.nz' },
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

export interface Testimonial {
    id: string;
    name: string;
    text: string;
    studyDestination: string;
    avatarUrl?: string;
  }
