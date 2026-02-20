// Types for all landing page content, editable via admin panel

export interface HeroContent {
  title: string;
  subtitle: string;
  bullets: string[];
  ctaText: string;
  secondaryCtaText: string;
  countdownDate: string; // ISO date string
}

export interface ProblemsContent {
  title: string;
  problems: string[];
  solutionText: string;
}

export interface AudienceCard {
  role: string;
  icon: string;
  pains: string[];
  results: string[];
}

export interface AudienceContent {
  title: string;
  cards: AudienceCard[];
}

export interface FormatContent {
  title: string;
  features: string[];
  timeline: { day: string; description: string }[];
}

export interface ProgramDay {
  day: number;
  title: string;
  result: string;
  tool: string;
  format: string;
}

export interface ProgramContent {
  title: string;
  days: ProgramDay[];
  ctaText: string;
}

export interface BenefitStat {
  value: string;
  label: string;
}

export interface BenefitsContent {
  title: string;
  stats: BenefitStat[];
  scenarios: string[];
}

export interface SpeakerContent {
  name: string;
  role: string;
  photoUrl: string;
  facts: string[];
  bio: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatarUrl?: string;
}

export interface TestimonialsContent {
  title: string;
  testimonials: Testimonial[];
  participantCount: string;
}

export interface PricingContent {
  title: string;
  price: string;
  oldPrice: string;
  countdownDate: string; // ISO date string for pricing timer
  features: string[];
  bonuses: string[];
  ctaText: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  title: string;
  items: FAQItem[];
}

export interface UpsellContent {
  title: string;
  description: string;
  discount: string;
}

export interface FooterContent {
  ctaText: string;
  telegramUrl: string;
  youtubeUrl: string;
  privacyUrl: string;
  termsUrl: string;
  copyright: string;
}

export interface SiteContent {
  hero: HeroContent;
  problems: ProblemsContent;
  audience: AudienceContent;
  format: FormatContent;
  program: ProgramContent;
  benefits: BenefitsContent;
  speaker: SpeakerContent;
  testimonials: TestimonialsContent;
  pricing: PricingContent;
  faq: FAQContent;
  upsell: UpsellContent;
  footer: FooterContent;
}
