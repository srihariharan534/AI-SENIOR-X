# AI-SENIOR-X — End-to-End User Journeys

## Journey 1: New Learner Onboarding & Twin Calibration
```text
Landing Page (/)
    ↓
Click "Start Learning with AI Twin"
    ↓
Onboarding Calibration (/onboarding)
    ├─ Step 1: Input Career Goal ("Full-Stack AI Engineer")
    ├─ Step 2: Select Focus Domains (AI/ML, Python, SQL)
    └─ Step 3: Choose Pedagogy Mode & 45m Daily Target
    ↓
Cognitive Model Initialized in Backend (POST /learning-twin/evidence)
    ↓
Learner Command Center (/dashboard)
    └─ Personalized Welcome, Streak Counter, Next Best Lesson Recommended
```

---

## Journey 2: Returning Learner — Socratic Tutoring & Voice Turn
```text
Login (/auth/login)
    ↓
Dashboard (/dashboard)
    ↓
Click "Resume Topic" or "Open AI Tutor" (/tutor)
    ↓
Learner asks: "Why do vanishing gradients happen in deep Sigmoid networks?"
    ↓
Orchestrator routes to TutorAgent with Socratic Pedagogy Strategy
    ↓
Tutor returns structured explanation, mathematical formula, and follow-up chips
    ↓
Learner activates "Live Voice Mode", speaks a question, and interrupts playback mid-sentence
    ↓
System halts audio immediately and processes next query turn
```

---

## Journey 3: Struggling Learner — Misconception Diagnosis & Practice
```text
Practice IDE (/practice?topic=sql_joins)
    ↓
Learner submits SQL JOIN query with incorrect NULL filtering logic
    ↓
GradingAgent runs test cases (1/3 Passed)
    ↓
MisconceptionAgent flags "LEFT_VS_INNER_JOIN_CONFUSION" (severity: medium)
    ↓
Learning Twin Knowledge State updated ($P(L_t)$ decreases on sql_left_join)
    ↓
UI displays Misconception Alert with explanation and 1-Click Remedial Challenge
    ↓
Learner solves remedial challenge (3/3 Passed) → Mastery increases → Twin syncs
```

---

## Journey 4: Diagnostic Assessment & Exam Mode
```text
Exam Mode (/exam-mode?topic=ml_supervised)
    ↓
10-minute timed diagnostic exam begins with anti-distraction layout
    ↓
Learner navigates questions 1 to 3, marks question 2 for review
    ↓
Learner submits exam
    ↓
Backend grades all items, generates question-by-question breakdown
    ↓
Results synchronized with Cognitive Learning Twin
```
