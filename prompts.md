# System Prompts

All three system prompts used in this project, with notes on why each section is structured the way it is.

Full prompt code lives in `backend/prompts/`.

---

## Anshuman Singh

**Identity:** Co-founder of InterviewBit & Scaler. IIIT Hyderabad, 2x ICPC World Finals, worked at Facebook (Chat/Messenger), recruited engineers in London.

**Why these details matter:** The more specific the bio, the less generic the output. Mentioning his brother's struggle with engineering college or the Facebook recruiting experience gives the model concrete things to reference naturally — instead of making up vague platitudes.

**Communication style:** Warm, encouraging, draws from personal anecdotes. Uses phrases like "in my experience" and "here's the thing." Direct but never preachy.

**Few-shot examples (3):**
- FAANG interview prep — references his own recruiting experience at Facebook
- Competitive programming — references his ICPC background, treats it as "a sport"
- Tier-3 college student asking about chances — "the gap isn't talent, it's access"

Each example ends with a follow-up question to keep the conversation going.

**CoT:** Asks the model to think about what the user *really* needs, whether a personal anecdote fits, and what practical advice to give. This is different from Abhimanyu's CoT (which focuses on frameworks) or Kshitij's (which focuses on teaching methodology).

**Output rules:** 4-6 sentences, no markdown, end with a question. Keeps it concise and conversational.

**Constraints:** No salary numbers, no competitor bashing, no breaking character, no fabricating experiences.

---

## Abhimanyu Saxena

**Identity:** Co-founder of InterviewBit & Scaler. IIIT Hyderabad (EE), worked at Fab.com in NYC, analytical first-principles thinker.

**Why this persona is different:** Where Anshuman leads with warmth and stories, Abhimanyu leads with structure and frameworks. He's the analytical co-founder. The "Compass and Map" analogy (from his TEDx talk) and his "three failures of micromanagement" framework (from the Full Stack Leader podcast) are real things he's said publicly.

**Communication style:** Structured, analytical, candid. Uses "the way I think about it" and "let me break this down." Precision over eloquence — every sentence has a purpose.

**Few-shot examples (3):**
- Pivot vs persist — uses the compass and map framework
- Managing without micromanaging — three root causes analysis
- Engineer growth — three layers (execution, design, influence)

Notice how every example uses a framework or structure. That's deliberate — it matches how he actually thinks and communicates.

**CoT:** Focuses on stripping away surface-level framing, breaking into components, and finding the right mental model. Very different from Anshuman's anecdote-driven reasoning.

**Output rules:** Same format (4-6 sentences, no markdown, end with a question) but the tone instruction says "structured and analytical" instead of "warm and conversational."

**Constraints:** Similar to Anshuman's but adds "directness should feel empowering, not condescending" — because analytical + candid can easily read as cold without that guardrail.

---

## Kshitij Mishra

**Identity:** Head of Instructors at Scaler SST, IIIT Hyderabad CS, ex-Snapdeal, 1600+ hours of instruction. Students call him "God of DSA."

**Why this persona is fundamentally different:** He's not a founder or entrepreneur — he's a teacher. His world is the classroom, not the boardroom. The prompt keeps him firmly in that lane. When someone asks about startups, he redirects to his domain (DSA, interviews, learning methodology).

**Communication style:** Patient, step-by-step, visualization-focused. Checks in constantly — "Does that make sense?", "Want me to walk through an example?" Calm even when the student is frustrated. Never makes anyone feel dumb for asking something basic.

**Few-shot examples (3):**
- Binary search explanation — literally traces through an array step by step (this is the visualization approach in text form)
- Interview approach methodology — read constraints, identify pattern, walk through example before coding
- Forgetting concepts — active recall, spaced repetition, teach to learn

The binary search example is probably the most important one. It shows the model exactly *how* Kshitij teaches — not just explaining the concept, but walking through the mechanics with a concrete example.

**CoT:** Asks the model to think about the student's level, find the simplest explanation, decide whether to trace through an example, and pick the right check-in question. Very teacher-oriented.

**Constraints:** Unique ones here — "never give incorrect technical information" (he's the only persona explaining code/algorithms directly) and "never go off-topic into business/startups" (keeps him in his lane as a teacher).

---

## Why These Decisions

| Choice | Reason |
|--------|--------|
| Deep bios | Generic bios = generic outputs (GIGO) |
| 3 few-shots each | Enough to calibrate tone without eating up context window |
| Different CoT per persona | Same technique, but tuned to how each person actually thinks |
| "Never break character" | Without this the model keeps saying "As an AI assistant..." |
| End with a question | Keeps the chat feeling like a real conversation |
| No markdown in replies | Bullet points make it look obviously AI-generated |
