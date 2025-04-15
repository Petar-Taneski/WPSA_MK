export interface Event {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  thumbnailUrl: string;
  publishDate: string;
  eventDate: string;
  location?: string;
  callToAction?: string;
  isFeatured: boolean;
}

export const events: Event[] = [
  {
    id: "1",
    title: "World Poultry Congress 2024",
    summary:
      "Join the premier global gathering for poultry scientists, researchers, and industry leaders.",
    content: `Join the premier global gathering for poultry scientists, researchers, and industry leaders. This year's congress will focus on sustainable poultry production, genetic advancements, and welfare innovations. 

Network with over 2,000 delegates from 80+ countries and explore the latest research through 300+ scientific presentations.

**Key Topics:**
- Sustainable poultry production systems
- Genetic advancements in breeding
- Welfare innovations and best practices
- Disease control and biosecurity
- Global market trends and challenges

**Speakers include:**
- Dr. Maria Rodriguez, Director of the Global Poultry Research Institute
- Prof. James Chen, Leading researcher in poultry genetics
- Dr. Sarah Johnson, Head of Animal Welfare Standards Committee

Registration includes access to all sessions, workshop materials, networking events, and gala dinner.`,
    imageUrl: "/images/header.png",
    thumbnailUrl: "/images/header.png",
    publishDate: "2024-04-15",
    eventDate: "2024-08-15",
    location: "Paris Convention Center, Paris, France",
    callToAction: "Register Now",
    isFeatured: true,
  },
  {
    id: "2",
    title: "European Poultry Nutrition Symposium",
    summary:
      "The leading European event dedicated to advances in poultry nutrition science.",
    content: `The leading European event dedicated to advances in poultry nutrition science. This year's symposium will explore novel feed additives, gut health optimization, and nutrition's role in antibiotic reduction.

Featuring keynote speakers from leading research institutions and opportunities for young scientists to present cutting-edge research.

**Program Highlights:**
- Novel feed additives for improved performance
- Gut health optimization strategies
- Nutrition's role in antibiotic reduction
- Sustainable feed sourcing
- Precision nutrition technologies

**What to expect:**
- 25+ expert presentations
- Poster sessions for researchers
- Industry exhibition with 40+ vendors
- Networking opportunities
- Publication opportunity in the European Poultry Science Journal`,
    imageUrl: "/images/header.png",
    thumbnailUrl: "/images/header.png",
    publishDate: "2024-05-10",
    eventDate: "2024-09-22",
    location: "Technical University of Munich, Germany",
    callToAction: "Submit Abstract",
    isFeatured: true,
  },
  {
    id: "3",
    title: "Mediterranean Poultry Summit",
    summary:
      "A specialized conference addressing challenges and opportunities in poultry production across Mediterranean countries.",
    content: `A specialized conference addressing challenges and opportunities in poultry production across Mediterranean countries. Topics include heat stress management, water conservation in poultry farms, and region-specific disease challenges.

The summit provides a unique networking platform for researchers and industry professionals from Mediterranean countries.

**Main Themes:**
- Heat stress management in poultry
- Water conservation strategies for arid climates
- Region-specific disease challenges and prevention
- Traditional poultry systems in Mediterranean countries
- Marketing opportunities for Mediterranean poultry products

**Includes:**
- Field trips to local poultry operations
- Cultural program with traditional cuisine
- Translation services (English, French, Arabic, Italian)
- Published proceedings with ISBN`,
    imageUrl: "/images/header.png",
    thumbnailUrl: "/images/header.png",
    publishDate: "2024-06-12",
    eventDate: "2024-10-07",
    location: "Antalya Congress Center, Turkey",
    callToAction: "Early Bird Registration",
    isFeatured: false,
  },
  {
    id: "4",
    title: "International Workshop on Poultry Welfare",
    summary:
      "An intensive two-day workshop focused on the latest developments in poultry welfare standards, assessment methods, and practices.",
    content: `An intensive two-day workshop focused on the latest developments in poultry welfare standards, assessment methods, and practices. Sessions will include practical demonstrations of welfare assessment, discussions on new EU regulations, and case studies of successful welfare improvement programs.

Limited to 100 participants to ensure interactive sessions.

**Workshop Modules:**
1. Modern welfare assessment methodologies
2. Enrichment strategies for commercial systems
3. Reducing stress during transportation and processing
4. New EU regulations and compliance strategies
5. Economic benefits of improved welfare systems

**Each participant will receive:**
- Comprehensive workbook with assessment tools
- Digital access to all presentations
- Certificate of completion
- One-year subscription to Poultry Welfare Journal`,
    imageUrl: "/images/header.png",
    thumbnailUrl: "/images/header.png",
    publishDate: "2024-07-25",
    eventDate: "2024-11-12",
    location: "Utrecht University, Netherlands",
    callToAction: "Reserve Your Spot",
    isFeatured: true,
  },
  {
    id: "5",
    title: "WPSA Young Scientists Forum",
    summary:
      "A platform dedicated to early-career poultry scientists to present their research, receive feedback from established researchers, and build international connections.",
    content: `A platform dedicated to early-career poultry scientists to present their research, receive feedback from established researchers, and build international connections.

This year's forum will feature mentoring sessions, career development workshops, and research presentation competitions with prizes for outstanding contributions.

**Opportunities for participants:**
- Present research to an international audience
- Receive feedback from established researchers
- Participate in mentoring sessions with industry leaders
- Network with peers from around the world
- Compete for research excellence awards (€3,000 in prizes)

**Eligibility:**
- Graduate students, postdocs, and early-career scientists (within 5 years of PhD)
- Must be conducting research in poultry science or related fields
- WPSA membership preferred but not required`,
    imageUrl: "/images/header.png",
    thumbnailUrl: "/images/header.png",
    publishDate: "2024-08-20",
    eventDate: "2024-12-05",
    location: "University of Veterinary Medicine, Vienna, Austria",
    callToAction: "Apply to Participate",
    isFeatured: false,
  },
  // Past events
  {
    id: "6",
    title: "Avian Health Conference",
    summary:
      "This conference brought together veterinarians, researchers, and industry professionals to address emerging disease challenges in poultry production.",
    content: `This conference brought together veterinarians, researchers, and industry professionals to address emerging disease challenges in poultry production. Topics included new vaccination strategies, biosecurity innovations, and antimicrobial resistance.

Proceedings from the conference are now available online.

**Conference Highlights:**
- 40+ presentations on emerging avian diseases
- Panel discussion on zoonotic disease prevention
- Workshops on diagnostic techniques
- New vaccine technologies showcase
- Antimicrobial resistance research updates

**Conference proceedings include:**
- Full papers from all presenters
- Video recordings of keynote addresses
- Summary of panel discussions
- Contact information for research collaborations`,
    imageUrl: "/images/header.png",
    thumbnailUrl: "/images/header.png",
    publishDate: "2024-01-10",
    eventDate: "2024-03-18",
    location: "Royal Veterinary College, London, UK",
    callToAction: "View Proceedings",
    isFeatured: true,
  },
  {
    id: "7",
    title: "Balkan Poultry Congress",
    summary:
      "The first regional congress dedicated to poultry science in the Balkan region featured over 50 speakers from 12 countries.",
    content: `The first regional congress dedicated to poultry science in the Balkan region featured over 50 speakers from 12 countries. Sessions addressed regional challenges in poultry production, cross-border disease control, and opportunities for research collaboration.

The event successfully established a regional network for Balkan poultry scientists.

**Key achievements:**
- Establishment of the Balkan Poultry Network
- Memorandum of Understanding signed by 8 research institutions
- Working groups formed for regional disease surveillance
- Joint research agenda established for 2024-2026
- Student exchange program initiated between universities

**Available resources:**
- Presentations from all sessions
- Directory of Balkan poultry researchers
- Regional market analysis report
- Collaborative research opportunities`,
    imageUrl: "/images/header.png",
    thumbnailUrl: "/images/header.png",
    publishDate: "2023-12-15",
    eventDate: "2024-02-25",
    location: "Faculty of Agriculture, University of Belgrade, Serbia",
    callToAction: "Access Presentations",
    isFeatured: false,
  },
  {
    id: "8",
    title: "Sustainable Poultry Production Workshop",
    summary:
      "A practical workshop that explored environmentally-friendly approaches to poultry farming.",
    content: `A practical workshop that explored environmentally-friendly approaches to poultry farming. Sessions included reducing carbon footprint in poultry operations, waste management innovations, and implementing renewable energy solutions in farm settings.

Participants received certificates and comprehensive resource materials.

**Workshop Topics:**
- Energy efficiency in poultry housing
- Renewable energy implementation (solar, biomass)
- Carbon footprint reduction strategies
- Waste management and composting systems
- Water conservation technologies
- Life cycle assessment of poultry production

**Materials available for download:**
- Workshop slides and handouts
- Sustainability assessment tools
- Case studies of successful implementations
- Vendor contacts for green technologies
- Grant and funding opportunity guide`,
    imageUrl: "/images/header.png",
    thumbnailUrl: "/images/header.png",
    publishDate: "2023-11-30",
    eventDate: "2024-01-30",
    location: "Agricultural University of Athens, Greece",
    callToAction: "Download Materials",
    isFeatured: false,
  },
];

// Helper function to sort events by date (newest first)
export const sortEventsByDate = (events: Event[]): Event[] => {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.eventDate);
    const dateB = new Date(b.eventDate);
    return dateB.getTime() - dateA.getTime();
  });
};

// Helper function to get upcoming events
export const getUpcomingEvents = (events: Event[]): Event[] => {
  const today = new Date();
  return events.filter((event) => new Date(event.eventDate) >= today);
};

// Helper function to get past events
export const getPastEvents = (events: Event[]): Event[] => {
  const today = new Date();
  return events.filter((event) => new Date(event.eventDate) < today);
};

// Helper function to get featured events
export const getFeaturedEvents = (events: Event[]): Event[] => {
  return events.filter((event) => event.isFeatured);
};
