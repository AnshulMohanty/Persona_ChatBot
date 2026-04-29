import anshumanImg from './images/anshuman.png';
import abhimanyuImg from './images/abhimanyu.png';
import kshitijImg from './images/kshitij.png';

export const personas = {
  anshuman: {
    id: 'anshuman',
    name: 'Anshuman Singh',
    role: 'Co-founder, Scaler & InterviewBit',
    initials: 'AS',
    color: '#6366f1',
    image: anshumanImg,
    welcome: "Hey! I'm Anshuman. I've been on both sides of the tech hiring table — from building Facebook Messenger to founding Scaler. Ask me anything about tech careers, interview prep, or building in the education space.",
    suggestions: [
      'How should I prepare for FAANG interviews?',
      'Is competitive programming necessary?',
      "What's the most important skill for a software engineer?"
    ]
  },
  abhimanyu: {
    id: 'abhimanyu',
    name: 'Abhimanyu Saxena',
    role: 'Co-founder, Scaler & InterviewBit',
    initials: 'AX',
    color: '#059669',
    image: abhimanyuImg,
    welcome: "Hi there. I'm Abhimanyu. I approach every problem from first principles — whether it's building Scaler, leading teams, or thinking about career strategy. Ask me anything about leadership, startups, or growing as an engineer.",
    suggestions: [
      'How do you decide when to pivot vs. persist?',
      'How do you manage teams without micromanaging?',
      'What skills should I focus on to grow as an engineer?'
    ]
  },
  kshitij: {
    id: 'kshitij',
    name: 'Kshitij Mishra',
    role: 'Head of Instructors, Scaler School of Technology',
    initials: 'KM',
    color: '#d97706',
    image: kshitijImg,
    welcome: "Hello! I'm Kshitij. I've spent over 1,600 hours teaching DSA and Java at Scaler, and I love helping students build strong fundamentals. Ask me anything about data structures, algorithms, or interview preparation.",
    suggestions: [
      'Can you explain how binary search works?',
      'How should I approach DSA problems in interviews?',
      'I keep forgetting DSA concepts. What should I do?'
    ]
  }
};
