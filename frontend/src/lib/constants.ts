import { MoodConfig, SupportModeDetails, EmergencyHelpline, PersonalReminder } from '../types';

export const MOODS: MoodConfig[] = [
  {
    type: 'okay',
    label: "I'm feeling okay.",
    emojiText: '🌱',
    gentleColor: 'bg-sage-100 text-sage-700 border-sage-200',
    comfortMessage: "It's wonderful to have quiet, steady moments. Hold onto this gentle breath.",
  },
  {
    type: 'sad',
    label: "I'm sad.",
    emojiText: '🌧️',
    gentleColor: 'bg-lavender-100 text-lavender-700 border-lavender-200',
    comfortMessage: "Crying or feeling down is not a failure. Your sadness is allowed to be here.",
  },
  {
    type: 'overwhelmed',
    label: "I'm overwhelmed.",
    emojiText: '🌊',
    gentleColor: 'bg-rose-100 text-rose-500 border-rose-200',
    comfortMessage: "When everything is loud, you only need to survive this single minute.",
  },
  {
    type: 'anxious',
    label: "I'm anxious.",
    emojiText: '🍃',
    gentleColor: 'bg-cream-300 text-content-primary border-cream-200',
    comfortMessage: "Your racing thoughts are not facts. Place one hand on your chest and feel your heart beating.",
  },
  {
    type: 'angry',
    label: "I'm angry.",
    emojiText: '⚡',
    gentleColor: 'bg-rose-50 text-rose-500 border-rose-300',
    comfortMessage: "Anger is often your heart's way of saying something unfair happened. You don't have to swallow it.",
  },
  {
    type: 'exhausted',
    label: "I'm exhausted.",
    emojiText: '🕯️',
    gentleColor: 'bg-surface-muted text-content-secondary border-lavender-100',
    comfortMessage: "You carry so much invisible weight. Resting right now is the most courageous choice.",
  },
  {
    type: 'lonely',
    label: "I feel lonely.",
    emojiText: '🕊️',
    gentleColor: 'bg-lavender-50 text-lavender-800 border-lavender-200',
    comfortMessage: "Even in an empty room, you are worthy of deep love and connection. You are not invisible here.",
  },
  {
    type: 'unknown',
    label: "I don't know how I feel.",
    emojiText: '🌫️',
    gentleColor: 'bg-gray-100 text-gray-700 border-gray-200',
    comfortMessage: "You don't need a label or an explanation today. Simply existing here is enough.",
  },
];

export const SUPPORT_MODES: SupportModeDetails[] = [
  {
    id: 'LISTEN',
    name: 'Listen',
    description: 'Vent freely without receiving advice',
    intention: 'The user wants to express her feelings without immediately receiving advice.',
  },
  {
    id: 'COMFORT',
    name: 'Comfort',
    description: 'Reassurance, validation, and gentle warmth',
    intention: 'The user wants reassurance, validation, and kind words.',
  },
  {
    id: 'CALM_DOWN',
    name: 'Calm Down',
    description: 'Grounding, de-escalating, and breathing together',
    intention: 'The user feels overwhelmed and wants a short grounding or breathing exercise.',
  },
  {
    id: 'THINK_IT_THROUGH',
    name: 'Think It Through',
    description: 'Separate facts from feelings and find a gentle next step',
    intention: 'The user wants help separating facts, feelings, uncertainties, and possible next steps.',
  },
];

export const SUGGESTED_CHAT_PROMPTS = [
  "I don't know how to explain what I'm feeling.",
  "Things at home have been difficult lately.",
  "I just need someone to listen.",
  "Help me calm my mind.",
  "I don't want advice right now.",
  "Can you help me think through something?",
];

export const JOURNAL_PROMPTS = [
  "What has been weighing on your mind?",
  "What do you wish someone understood?",
  "What do you need most right now?",
  "What is outside your control today?",
  "What is one small thing you can do for yourself?",
];

export const INITIAL_REMINDERS: Omit<PersonalReminder, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "One Moment at a Time",
    message: "You don't have to figure everything out today. Let's take this one moment at a time.",
    category: "Overwhelm",
    is_pinned: true,
    author_type: 'creator',
  },
  {
    title: "Permission to Rest",
    message: "It's okay to take a break. The world will keep turning while you gather your breath.",
    category: "Burnout",
    is_pinned: true,
    author_type: 'creator',
  },
  {
    title: "You Deserve Kindness",
    message: "You deserve to be treated with kindness, especially by the voice inside your own head.",
    category: "Self-Worth",
    is_pinned: false,
    author_type: 'creator',
  },
  {
    title: "Your Feelings are Real",
    message: "You don't need to explain everything for your feelings to matter. What hurts, hurts.",
    category: "Validation",
    is_pinned: false,
    author_type: 'creator',
  },
  {
    title: "Family Complexity",
    message: "You are not responsible for fixing adults or carrying emotional atmospheres that were not yours to create.",
    category: "Family",
    is_pinned: true,
    author_type: 'creator',
  },
  {
    title: "Smallest Next Step",
    message: "Take things one small step at a time. Drink a sip of water. Unclench your jaw. You're doing okay.",
    category: "Grounding",
    is_pinned: false,
    author_type: 'creator',
  },
];

export const EMERGENCY_HELPLINES: EmergencyHelpline[] = [
  {
    id: 'tele-manas',
    name: 'Tele-MANAS (Govt of India)',
    contact: '14416 or 1800-891-4416',
    description: 'National Tele Mental Health Programme of India, 24/7 toll-free multilingual emotional counseling.',
    available: '24/7, Toll-free',
    region: 'India',
    link: 'https://telemanas.mohfw.gov.in',
  },
  {
    id: 'kiran',
    name: 'KIRAN Helpline',
    contact: '1800-599-0019',
    description: 'Ministry of Social Justice 24/7 mental health helpline providing psychological support & distress relief.',
    available: '24/7, Toll-free',
    region: 'India',
  },
  {
    id: 'vandrevala',
    name: 'Vandrevala Foundation',
    contact: '+91 9999 666 555',
    description: 'Free mental health support, crisis response, and WhatsApp/voice counseling in multiple Indian languages.',
    available: '24/7 Support',
    region: 'India',
    link: 'https://www.vandrevalafoundation.com',
  },
  {
    id: 'icall',
    name: 'iCall Psychosocial Helpline',
    contact: '+91 9152987821',
    description: 'Tata Institute of Social Sciences (TISS) counseling service offering confidential, non-judgmental support.',
    available: 'Mon–Sat, 10 AM – 8 PM',
    region: 'India',
  },
  {
    id: 'us-988',
    name: '988 Suicide & Crisis Lifeline',
    contact: '988 (Call or Text)',
    description: 'Confidential crisis support available anywhere in the United States and Canada.',
    available: '24/7, Toll-free',
    region: 'US/Canada',
    link: 'https://988lifeline.org',
  },
  {
    id: 'uk-111',
    name: 'NHS Mental Health Services (UK)',
    contact: '111',
    description: 'Urgent mental health helpline for 24-hour advice and assessment in the UK.',
    available: '24/7',
    region: 'UK',
  },
  {
    id: 'befrienders',
    name: 'Befrienders Worldwide',
    contact: 'Find your country helpline',
    description: 'Global confidential emotional support for anyone in distress, suicidal thoughts, or despair.',
    available: 'Worldwide Directory',
    region: 'Global',
    link: 'https://www.befrienders.org',
  },
];
