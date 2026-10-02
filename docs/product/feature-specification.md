# AI-SENIOR-X — Complete Feature Specification & Architecture

## 1. Executive Summary
**AI-SENIOR-X** is an autonomous AI-native educational platform combining an event-sourced **Cognitive Learning Twin**, **Multi-Agent Socratic Orchestration**, **Adaptive Pedagogy Engine**, **Interactive Practice IDE**, **Gamified Capstone Missions**, and **Real-Time Voice Turns with Instant Interruption**.

---

## 2. Frontend User Interface Architecture (Next.js 14 App Router)

| Route | View Description | Connected Intelligence Systems |
|---|---|---|
| `/` | Landing Page & Interactive Pillars | Marketing showcase & Feature preview |
| `/onboarding` | 3-Step Cognitive Calibration Flow | Learner Profile API & Initial Twin Ingestion |
| `/dashboard` | Learner Command Center | Progress Service, Recommendation Agent, Twin State |
| `/learn` | Curriculum Graph Explorer (DAG) | Curriculum Graph, Topological Sorter, Prerequisite Engine |
| `/learn/[topic]` | Topic Deep Dive & Readiness Check | Prerequisite Engine, DAG Node Metadata |
| `/tutor` | Socratic AI Tutor & Voice Orb | Tutor Agent, Orchestrator, TTS/STT, Interruption Handler |
| `/practice` | Adaptive Code IDE & Challenge Runner | Practice Agent, Grading Agent, Misconception Diagnostics |
| `/missions` | Capstone Quests & Milestones Hub | Mission Agent, Task Checklist & Gamification Engine |
| `/learning-twin` | Cognitive Twin Cockpit & SVG Map | Bayesian Knowledge Tracing, Skill Graph, Evidence Timeline |
| `/exam-mode` | Diagnostic Timed Checkpoints | Assessment Service, Exam Timer, Twin Ingestion |
| `/settings` | Language, Voice & Pace Preferences | User Profile, Multilingual Router, Spaced Repetition |
| `/auth/login` | Secure JWT Login & 1-Click Demo | Auth API, JWT Bearer Token Storage |

---

## 3. Cognitive Learning Twin Features
- **Bayesian Knowledge Tracing (BKT)**: Calculates real-time concept mastery ($P(L_t)$), slip, guess, and transition probabilities.
- **Prerequisite Solver**: Validates DAG dependencies before unlocking advanced nodes.
- **Memory Decay (SM-2 Spaced Repetition)**: Automatically calculates retention intervals and schedules reviews.
- **Misconception State**: Flags specific conceptual pitfalls (e.g. `LEFT_VS_INNER_JOIN_CONFUSION`, `SIGMOID_SATURATION`) and links directly to targeted remedial practice.
- **Event-Sourced Activity Stream**: Immutable log of every practice submission, tutor conversation, assessment, and quest completion.

---

## 4. Multi-Agent System & Socratic Dialogue
- **Tutor Agent**: Formulates Socratic questions and guides learner reasoning without spoon-feeding answers.
- **Pedagogy Modes**: Explain Simply, Deep Dive, Give Example, Use Analogy, Quiz Me, Fix Mistake.
- **Practice & Grading Agents**: Ingest code submissions, evaluate test cases, and emit structured evidence.
- **Recommendation Agent**: Prioritizes explainable next-best actions.
- **Mission Agent**: Constructs capstone engineering projects with tangible milestones.

---

## 5. Voice & Speech Synthesis
- **Educational Speech Sanitization**: Strips code blocks and LaTeX math into natural spoken pauses and visual pointers.
- **Conversational Interruption**: Registers learner speech onset and halts playback within <200ms.
- **Multilingual Support**: Supports 10 languages (EN, ES, FR, DE, HI, TA, ZH, JA, etc.) with technical terminology preservation.
