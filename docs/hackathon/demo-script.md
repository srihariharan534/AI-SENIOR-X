# AI-SENIOR-X — Hackathon Live Demo Script (3–5 Minutes)

## Goal
Demonstrate that AI-SENIOR-X is a genuine **AI-native personalized learning platform** that actively models learner cognitive state, diagnoses misconceptions, and adaptively shifts pedagogical strategy.

---

## ⏱️ Minute 0:00 – 0:45 | The Hook & Cognitive Twin Calibration
1. **Open Landing Page (`http://localhost:3000/`)**:
   - Point to the headline: *"Your AI Learning Twin that grows with you."*
   - Highlight the difference between generic chatbots vs an event-sourced cognitive model.
2. **Click "Get Started Free" (`/onboarding`)**:
   - Complete the 3-step calibration (Goal: Full-Stack AI Engineer; Domains: AI/ML, Python, SQL; Pace: 45 min/day).
   - Show how onboarding immediately emits baseline evidence to the backend Learning Twin.

---

## ⏱️ Minute 0:45 – 1:45 | Dashboard & Socratic AI Tutor
1. **Explore Dashboard (`/dashboard`)**:
   - Point to the **Cognitive Twin Health** card, **Daily Streak (4 days)**, and **Recommendation Agent** lesson callout explaining *why* the lesson was selected based on prerequisite readiness.
2. **Jump into AI Tutor (`/tutor`)**:
   - Ask: *"Why does cross-entropy loss use logarithms instead of mean squared error for classification?"*
   - Show Socratic response with structured breakdown, code snippet, and auto-generated follow-up chips.
   - Switch Pedagogy Mode from **"Explain Simply"** to **"Use Analogy"** to show instant pedagogical adaptation.
3. **Trigger Live Voice Mode**:
   - Tap the microphone orb, speak a question, observe the audio frequency visualizer, and demonstrate **instant voice interruption** when the tutor speaks.

---

## ⏱️ Minute 1:45 – 3:00 | Misconception Diagnosis & Practice IDE
1. **Navigate to Adaptive Practice (`/practice?topic=sql_joins`)**:
   - Show the problem statement and test cases.
   - Intentionally submit code with a flaw (e.g., confusing INNER vs LEFT JOIN).
2. **Observe AI Grading & Misconception Alert**:
   - Show the grading card flagging: `LEFT_VS_INNER_JOIN_CONFUSION` with actionable remediation advice.
   - Emphasize that this is not a hardcoded prompt—it came from the `MisconceptionAgent` and updated the Bayesian knowledge state in the backend.
3. **Click "Next Adaptive Challenge"**:
   - Watch the Practice Agent generate a remedial exercise targeting the exact conceptual weakness.

---

## ⏱️ Minute 3:00 – 4:00 | Learning Twin Cockpit & Knowledge DAG Map
1. **Navigate to Learning Twin (`/learning-twin`)**:
   - Show the **Interactive SVG Knowledge DAG Map** with nodes color-coded by mastery (Mastered, Proficient, Developing, Novice).
   - Click a node to inspect its prerequisites and mastery probability.
   - Point to the **Skill Competencies** list and **Event-Sourced Activity Timeline** showing every action recorded during the demo.

---

## ⏱️ Minute 4:00 – 4:30 | Capstone Quests & Exam Mode
1. **Show Missions (`/missions`)**:
   - Display capstone quest: *Deploying a Multi-Class Neural Classifier* with interactive task checklist and XP reward.
2. **Show Exam Mode (`/exam-mode`)**:
   - Display the timed diagnostic checkpoint with anti-distraction navigator and question review.

---

## ⏱️ Minute 4:30 – 5:00 | Conclusion & Impact
- *"AI-SENIOR-X transforms AI from a static search engine into a personal cognitive partner that knows where you struggle, teaches how you learn best, and guides you all the way to mastery."*
