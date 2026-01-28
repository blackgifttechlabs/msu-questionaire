
import { Section, Question, Language } from './types';

export const LOGO_URL = "https://i.ibb.co/nNzB12S4/msu-Picsart-Ai-Image-Enhancer-removebg-preview-Picsart-Ai-Image-Enhancer.png";
export const MALE_ICON = "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
export const FEMALE_ICON = "https://cdn-icons-png.flaticon.com/512/4140/4140047.png";

const fallback = (text: string) => ({
  [Language.ENGLISH]: text
});

export const QUESTIONS: Question[] = [
  // INTRO - The script is now the first item
  {
    id: 'intro_script',
    section: Section.INTRO,
    label: fallback("My name is Nency Munyuki, and I am a researcher from Midlands State University. We are conducting a study to understand the farming practices, challenges, and opportunities smallholder farmers face in finger millet production. Your experience is very valuable to us. This interview will take about 30-45 minutes. Your participation is voluntary, and you can choose not to answer any question or stop the interview at any time. All your answers will be kept strictly confidential and will be used only for this research. Thank you for your time."),
    type: 'info'
  },
  {
    id: 'ward_location',
    section: Section.INTRO,
    label: fallback("What is your Location (Ward)?"),
    type: 'text'
  },

  // PART A: PROFILE
  {
    id: 'A1_gender',
    section: Section.PROFILE,
    label: fallback("A1: What is the Gender of the Respondent?"),
    type: 'gender'
  },
  {
    id: 'A2_age',
    section: Section.PROFILE,
    label: fallback("A2: What is the Age of the Respondent? (Years)"),
    type: 'number'
  },
  {
    id: 'A3_education',
    section: Section.PROFILE,
    label: fallback("A3: What is the highest level of formal education you have completed?"),
    type: 'radio',
    options: [
      { value: 'none', label: fallback("1. No formal schooling") },
      { value: 'primary', label: fallback("2. Primary") },
      { value: 'secondary', label: fallback("3. Secondary") },
      { value: 'tertiary', label: fallback("4. Tertiary/College") }
    ]
  },
  {
    id: 'A5_marital',
    section: Section.PROFILE,
    label: fallback("A5: What is your Marital Status?"),
    type: 'radio',
    options: [
      { value: 'single', label: fallback("1. Single") },
      { value: 'married', label: fallback("2. Married") },
      { value: 'widowed', label: fallback("3. Widowed") },
      { value: 'divorced', label: fallback("4. Divorced/Separated") }
    ]
  },
  {
    id: 'A6_hsize',
    section: Section.PROFILE,
    label: fallback("A6: What is the Household Size? (Number of people living and eating together)"),
    type: 'number'
  },
  {
    id: 'A7_income',
    section: Section.PROFILE,
    label: fallback("A7: What is your primary source of income?"),
    type: 'text'
  },
  {
    id: 'A8_land_access',
    section: Section.PROFILE,
    label: fallback("A8: How do you access the land you farm on? (Tick all that apply)"),
    type: 'checkbox',
    options: [
      { value: 'own', label: fallback("1. Own land (with title deed)") },
      { value: 'communal', label: fallback("2. Communal land (allocated by traditional leader)") },
      { value: 'rented', label: fallback("3. Rented/Leased land") },
      { value: 'borrowed', label: fallback("4. Borrowed land (no payment)") }
    ]
  },
  {
    id: 'A9_land_size',
    section: Section.PROFILE,
    label: fallback("A9: What is the total size of your landholding? (Acres/Hectares)"),
    type: 'number'
  },
  {
    id: 'A10_crops',
    section: Section.PROFILE,
    label: fallback("A10: Which crops are you producing?"),
    type: 'text'
  },
  {
    id: 'A11_cattle',
    section: Section.PROFILE,
    label: fallback("A11: Cattle (Number owned)"),
    type: 'counter'
  },
  {
    id: 'A11_goats',
    section: Section.PROFILE,
    label: fallback("A11: Goats (Number owned)"),
    type: 'counter'
  },
  {
    id: 'A12_group',
    section: Section.PROFILE,
    label: fallback("A12: Are you a member of any farmer group or cooperative?"),
    type: 'radio',
    options: [
      { value: 'yes', label: fallback("1. Yes") },
      { value: 'no', label: fallback("2. No") }
    ]
  },

  // PART B1: TILLAGE
  {
    id: 'B1_1_method',
    section: Section.TILLAGE,
    label: fallback("B1.1: What is your primary method of land preparation for finger millet?"),
    type: 'radio',
    options: [
      { value: 'conventional', label: fallback("1. Conventional Tillage (mouldboard plough, disc plough)") },
      { value: 'conservation', label: fallback("2. Conservation Tillage (e.g., ripping, planting basins)") },
      { value: 'zero', label: fallback("3. Zero Tillage (direct seeding without tillage)") },
      { value: 'other', label: fallback("4. Other") }
    ]
  },
  {
    id: 'B1_2_why',
    section: Section.TILLAGE,
    label: fallback("B1.2: Why do you use this method?"),
    type: 'text'
  },
  {
    id: 'B1_3_change',
    section: Section.TILLAGE,
    label: fallback("B1.3: What would make you consider changing your tillage method?"),
    type: 'text'
  },

  // PART B2: NUTRIENTS
  {
    id: 'B2_1_fertility',
    section: Section.NUTRIENTS,
    label: fallback("B2.1: How would you describe the current fertility of your finger millet fields?"),
    type: 'radio',
    options: [
      { value: '1', label: fallback("1. Very poor") },
      { value: '2', label: fallback("2. Poor") },
      { value: '3', label: fallback("3. Moderate") },
      { value: '4', label: fallback("4. Good") },
      { value: '5', label: fallback("5. Very good") }
    ]
  },
  {
    id: 'B2_2_methods',
    section: Section.NUTRIENTS,
    label: fallback("B2.2: What method(s) do you currently use to improve soil fertility? (Tick all that apply)"),
    type: 'checkbox',
    options: [
      { value: 'inorganic', label: fallback("1. Inorganic fertilizer (e.g., Compound D, AN)") },
      { value: 'cattle_manure', label: fallback("2. Cattle manure") },
      { value: 'goat_manure', label: fallback("3. Goat manure") },
      { value: 'compost', label: fallback("4. Compost") },
      { value: 'rotation', label: fallback("5. Crop rotation") },
      { value: 'legume', label: fallback("6. Legume intercropping") },
      { value: 'fallowing', label: fallback("7. Fallowing") },
      { value: 'none', label: fallback("8. None") }
    ]
  },
  {
    id: 'B2_5_inm_heard',
    section: Section.NUTRIENTS,
    label: fallback("B2.5: Have you ever heard of combining organic manure with a small amount of inorganic fertilizer? (INM)"),
    type: 'radio',
    options: [
      { value: 'yes', label: fallback("1. Yes") },
      { value: 'no', label: fallback("2. No") }
    ]
  },
  {
    id: 'B2_6_inm_benefits',
    section: Section.NUTRIENTS,
    label: fallback("B2.6: If Yes, what are the potential benefits of using INM? (Tick all that apply)"),
    type: 'checkbox',
    condition: (ans) => ans['B2_5_inm_heard'] === 'yes',
    options: [
      { value: 'yield', label: fallback("1. Better crop yields") },
      { value: 'health', label: fallback("2. Improves soil health for longer") },
      { value: 'cost', label: fallback("3. Reduces cost of buying fertilizer") },
      { value: 'resilient', label: fallback("4. More drought-resilient crops") },
      { value: 'unknown', label: fallback("5. I don't know the benefits") }
    ]
  },

  // PART B3: SEEDS
  {
    id: 'B3_1_seed_type',
    section: Section.SEEDS,
    label: fallback("B3.1: What type of finger millet seed did you plant in the most recent season?"),
    type: 'radio',
    options: [
      { value: 'local', label: fallback("1. Local/Traditional Variety") },
      { value: 'improved', label: fallback("2. Improved/Certified Variety") }
    ]
  },
  {
    id: 'B3_2_why',
    section: Section.SEEDS,
    label: fallback("B3.2: Why did you choose this particular variety? (Tick all that apply)"),
    type: 'checkbox',
    options: [
      { value: 'drought', label: fallback("1. Drought tolerance") },
      { value: 'yield', label: fallback("2. High yield") },
      { value: 'taste', label: fallback("3. Better taste") },
      { value: 'market', label: fallback("4. Marketability") },
      { value: 'avail', label: fallback("5. Availability") },
      { value: 'pest', label: fallback("6. Pest/disease resistance") }
    ]
  },

  // PART C: PERCEPTIONS (Likert 1-5)
  {
    id: 'C1_barrier',
    section: Section.PERCEPTIONS,
    label: fallback("C1: The high cost of inorganic fertilizer is a major barrier to my farming."),
    type: 'likert'
  },
  {
    id: 'C2_access',
    section: Section.PERCEPTIONS,
    label: fallback("C2: I have sufficient access to quality organic manure (cattle, goat, compost) on my farm."),
    type: 'likert'
  },
  {
    id: 'C3_knowledge',
    section: Section.PERCEPTIONS,
    label: fallback("C3: I have the necessary knowledge and skills to prepare and apply compost/manure effectively."),
    type: 'likert'
  },
  {
    id: 'C4_willing',
    section: Section.PERCEPTIONS,
    label: fallback("C4: I am willing to try new farming methods if they are proven to increase yield and profit."),
    type: 'likert'
  },
  {
    id: 'C5_climate',
    section: Section.PERCEPTIONS,
    label: fallback("C5: The changing climate (unreliable rains, droughts) makes it risky to invest in new practices."),
    type: 'likert'
  },

  // PART D: SUPPORT
  {
    id: 'D1_contact',
    section: Section.SUPPORT,
    label: fallback("D1: In the last 2 years, have you had any contact with an agricultural extension officer (AGRITEX)?"),
    type: 'radio',
    options: [
      { value: 'yes', label: fallback("1. Yes") },
      { value: 'no', label: fallback("2. No") }
    ]
  },
  {
    id: 'D3_relevance',
    section: Section.SUPPORT,
    label: fallback("D3: How relevant and practical was the training/advice you received?"),
    type: 'radio',
    condition: (ans) => ans['D1_contact'] === 'yes',
    options: [
      { value: '1', label: fallback("1. Not relevant") },
      { value: '2', label: fallback("2. Slightly relevant") },
      { value: '3', label: fallback("3. Moderately relevant") },
      { value: '4', label: fallback("4. Very relevant") }
    ]
  },

  // PART E: CONCLUSION
  {
    id: 'E1_challenge',
    section: Section.CONCLUSION,
    label: fallback("E1: In your own words, what is the SINGLE biggest challenge you face in growing finger millet?"),
    type: 'text'
  },
  {
    id: 'E2_encourage',
    section: Section.CONCLUSION,
    label: fallback("E2: What would encourage you to start or increase the use of improved practices (like new tillage, INM, or new varieties)?"),
    type: 'text'
  },
  {
    id: 'E3_other',
    section: Section.CONCLUSION,
    label: fallback("E3: Do you have any other comments or suggestions?"),
    type: 'text'
  }
];
