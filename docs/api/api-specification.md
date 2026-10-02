# AI-SENIOR-X REST API Specification (v1)

This document provides technical documentation for all implemented REST API endpoints exposed by the FastAPI Gateway at `/api/v1`.

---

## Base URL

* Local Development: `http://localhost:8000/api/v1`
* Interactive Swagger UI: `http://localhost:8000/docs`
* OpenAPI JSON Specification: `http://localhost:8000/openapi.json`

---

## Standard Response Envelope

All API responses return a structured JSON envelope:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Error format:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "Invalid email or password.",
    "details": {}
  }
}
```

---

## Endpoints

### 1. Health & Readiness

#### `GET /api/v1/health`
* **Summary**: Liveness probe.
* **Auth**: None.
* **Response**: `200 OK`
  ```json
  {
    "status": "healthy",
    "service": "AI-SENIOR-X",
    "version": "0.1.0",
    "environment": "development"
  }
  ```

#### `GET /api/v1/ready`
* **Summary**: Readiness probe verifying PostgreSQL database connectivity.
* **Auth**: None.
* **Response**: `200 OK`
  ```json
  {
    "status": "ready",
    "service": "AI-SENIOR-X",
    "database": "connected",
    "version": "0.1.0"
  }
  ```

---

### 2. Authentication

#### `POST /api/v1/auth/register`
* **Summary**: Register a new user account with attached learner profile.
* **Auth**: None.
* **Request**:
  ```json
  {
    "email": "learner@ai-senior-x.io",
    "password": "SecurePassword123!",
    "full_name": "Alex Chen",
    "grade_level": "undergraduate",
    "preferred_language": "en"
  }
  ```
* **Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "access_token": "eyJhbGciOi...",
      "refresh_token": "eyJhbGciOi...",
      "token_type": "bearer",
      "user": {
        "id": "c1f76d49-...",
        "email": "learner@ai-senior-x.io",
        "full_name": "Alex Chen",
        "role": "learner",
        "is_active": true,
        "is_verified": false
      }
    }
  }
  ```

#### `POST /api/v1/auth/login`
* **Summary**: Authenticate with email and password.
* **Auth**: None.
* **Request**:
  ```json
  {
    "email": "learner@ai-senior-x.io",
    "password": "SecurePassword123!"
  }
  ```
* **Response**: `200 OK` (returns `Token` payload).

#### `POST /api/v1/auth/refresh`
* **Summary**: Refresh expired access token.
* **Auth**: None.
* **Request**:
  ```json
  {
    "refresh_token": "eyJhbGciOi..."
  }
  ```
* **Response**: `200 OK`.

#### `GET /api/v1/auth/me`
* **Summary**: Retrieve identity and profile for authenticated caller.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`.

---

### 3. User & Learner Profile

#### `GET /api/v1/users/profile`
* **Summary**: Retrieve learner cognitive state, target goals, and mastery scores.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`.

#### `PATCH /api/v1/users/profile`
* **Summary**: Update profile settings (preferred language, learning style, grade level).
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`.

---

### 4. Learning Pathways & Recommendations

#### `GET /api/v1/learning/curriculum`
* **Summary**: Fetch structured curriculum modules and skills.
* **Auth**: None.
* **Query Params**: `subject` (optional string).
* **Response**: `200 OK`.

#### `GET /api/v1/learning/missions`
* **Summary**: Retrieve active learning missions and quests.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`.

#### `GET /api/v1/learning/recommendations`
* **Summary**: Retrieve personalized learning recommendations.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`.

---

### 5. Progress & Analytics

#### `GET /api/v1/progress/overview`
* **Summary**: Get aggregate dashboard metrics (total study minutes, streaks, mastery per subject).
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`.

#### `POST /api/v1/progress/activity`
* **Summary**: Log completed study activity and update module mastery.
* **Auth**: `Bearer <access_token>`.
* **Request**:
  ```json
  {
    "subject": "Computer Science",
    "module_id": "py-101",
    "time_spent_minutes": 30,
    "mastery_delta": 0.1
  }
  ```
* **Response**: `201 Created`.

#### `GET /api/v1/progress/misconceptions`
* **Summary**: List active unresolved cognitive misconceptions.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`.

---

### 6. Assessments & Grading

#### `POST /api/v1/assessment/create`
* **Summary**: Create a new diagnostic assessment with questions.
* **Auth**: `Bearer <access_token>`.
* **Response**: `201 Created`.

#### `GET /api/v1/assessment/list`
* **Summary**: List assessments for current learner.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`.

#### `GET /api/v1/assessment/{assessment_id}`
* **Summary**: Retrieve assessment questions and options.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`.

#### `POST /api/v1/assessment/{assessment_id}/submit`
* **Summary**: Submit question answer for grading and diagnostic analysis.
* **Auth**: `Bearer <access_token>`.
* **Request**:
  ```json
  {
    "question_id": "q-1234",
    "user_response": "A",
    "response_time_seconds": 15.2
  }
  ```
* **Response**: `200 OK`.

---

### 7. AI Tutor & Interactive Sessions

#### `POST /api/v1/tutor/session/start`
* **Summary**: Initialize active tutoring session.
* **Auth**: `Bearer <access_token>`.
* **Response**: `201 Created`.

#### `GET /api/v1/tutor/session/active`
* **Summary**: Retrieve current active session.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`.

#### `POST /api/v1/tutor/session/{session_id}/end`
* **Summary**: Conclude tutoring session.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`.

#### POST /api/v1/tutor/interact
* **Summary**: Interact with AI Tutor interface.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`.

---

### 8. Curriculum Engine & Knowledge Graph

#### `GET /api/v1/curriculum/graph`
* **Summary**: Retrieve complete curriculum graph with topological sorting and domain grouping.
* **Auth**: None / Optional.
* **Response**: `200 OK`

#### `GET /api/v1/curriculum/subjects`
* **Summary**: List all available educational domains (e.g. AI/ML, Python, DSA, Data Science, Math).
* **Auth**: None / Optional.
* **Response**: `200 OK`

#### `GET /api/v1/curriculum/prerequisites/{topic_id}`
* **Summary**: Evaluate prerequisite mastery requirements and readiness for a given topic node.
* **Auth**: None / Optional.
* **Query Params**: `learner_id` (optional).
* **Response**: `200 OK`

#### `POST /api/v1/curriculum/map-topic`
* **Summary**: Natural language semantic mapping from learner question/statement to curriculum node and concepts.
* **Auth**: None / Optional.
* **Request**:
  ```json
  {
    "query": "I am struggling with backpropagation gradient descent in neural networks"
  }
  ```
* **Response**: `200 OK`

---

### 9. RAG Knowledge Base & Hybrid Retrieval

#### `POST /api/v1/rag/query`
* **Summary**: Execute hybrid semantic + BM25 keyword search with reranking and LLM context packaging.
* **Auth**: None / Optional.
* **Request**:
  ```json
  {
    "query": "How do residual connections prevent vanishing gradients?",
    "top_k": 3,
    "subject": "AI/ML",
    "topic": "dl_transformers"
  }
  ```
* **Response**: `200 OK`

#### `POST /api/v1/rag/ingest`
* **Summary**: Ingest text/markdown snippet into vector index with chunking and metadata extraction.
* **Auth**: None / Optional.
* **Request**:
  ```json
  {
    "title": "Attention Is All You Need Notes",
    "text": "Self-attention computes scaled dot-product attention across query, key, and value vectors...",
    "subject": "AI/ML",
    "topic": "dl_transformers"
  }
  ```
* **Response**: `200 OK`

#### `GET /api/v1/rag/stats`
* **Summary**: Retrieve vector index statistics (total records, dimension, indexed domains).
* **Auth**: None / Optional.
* **Response**: `200 OK`

---

### 10. Learning Twin Cognitive Model & Evolution

#### `GET /api/v1/learning-twin`
* **Summary**: Retrieve full Learning Twin cognitive snapshot for the authenticated learner.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`

#### `GET /api/v1/learning-twin/knowledge`
* **Summary**: Retrieve granular concept mastery scores, mastery classifications, and confidence intervals.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`

#### `GET /api/v1/learning-twin/skills`
* **Summary**: Inspect skill graph (mastered skills, blocked skills, prerequisite gaps, review priorities).
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`

#### `GET /api/v1/learning-twin/misconceptions`
* **Summary**: List active and historical misconceptions with confidence levels and resolution flags.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`

#### `GET /api/v1/learning-twin/history`
* **Summary**: Retrieve immutable learning event log for reconstructing cognitive progression.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`

#### `GET /api/v1/learning-twin/preferences`
* **Summary**: Retrieve evidence-based modality preferences, pace, and difficulty settings.
* **Auth**: `Bearer <access_token>`.
* **Response**: `200 OK`

#### `POST /api/v1/learning-twin/evidence`
* **Summary**: Ingest standardized learning evidence from assessments, practice, or AI agents to evolve the twin.
* **Auth**: `Bearer <access_token>`.
* **Request**:
  ```json
  {
    "evidence_type": "assessment",
    "concept_id": "gradient_descent",
    "topic_id": "ml_supervised",
    "score": 0.85,
    "difficulty": 0.7,
    "response_time_seconds": 12.0
  }
  ```
* **Response**: `200 OK`

---

### 11. Interactive Practice & Targeted Exercises

#### `POST /api/v1/practice/generate`
* **Summary**: Generate interactive coding challenge or concept drill targeted at weak concepts.
* **Auth**: `Bearer <access_token>`.
* **Request**:
  ```json
  {
    "topic_id": "sql_joins",
    "concept_id": "sql_inner_left_join",
    "difficulty": 0.5
  }
  ```
* **Response**: `200 OK`

#### `POST /api/v1/practice/submit`
* **Summary**: Submit exercise code/response for automated grading and Learning Twin mastery update.
* **Auth**: `Bearer <access_token>`.
* **Request**:
  ```json
  {
    "exercise_id": "ex-1234",
    "topic_id": "sql_joins",
    "concept_id": "sql_inner_left_join",
    "submitted_code": "SELECT s.name, c.title FROM students s LEFT JOIN enrollments e ON s.id = e.student_id;",
    "time_spent_seconds": 45.0
  }
  ```
* **Response**: `200 OK`

---

### 12. Explainable Recommendations & Learning Paths

#### `GET /api/v1/recommendations/next-actions`
* **Summary**: Retrieve explainable, prioritized next-best learning actions (remediations, reviews, new lessons).
* **Auth**: `Bearer <access_token>`.
* **Query Params**: `subject` (default: `AI/ML`).
* **Response**: `200 OK`

#### `POST /api/v1/recommendations/learning-path`
* **Summary**: Solve shortest prerequisite DAG path to master a target topic.
* **Auth**: `Bearer <access_token>`.
* **Request**:
  ```json
  {
    "target_topic_id": "dl_transformers"
  }
  ```
* **Response**: `200 OK`

---

### 13. Gamified Missions & Capstone Quests

#### `GET /api/v1/missions/active`
* **Summary**: Retrieve or initialize an active multi-step quest with milestone tasks and XP rewards.
* **Auth**: `Bearer <access_token>`.
* **Query Params**: `topic_id` (default: `ml_supervised`).
* **Response**: `200 OK`

#### `POST /api/v1/missions/create`
* **Summary**: Create customized capstone challenge quest.
* **Auth**: `Bearer <access_token>`.
* **Request**:
  ```json
  {
    "topic_id": "py_async",
    "difficulty_level": "Intermediate"
  }
  ```
* **Response**: `201 Created`

---

### 14. Conversational Voice & Audio Synthesis

#### `POST /api/v1/voice/turn`
* **Summary**: Execute conversational voice turn (input text/audio -> Orchestrator -> TTS sanitized audio).
* **Auth**: `Bearer <access_token>`.
* **Request**:
  ```json
  {
    "session_id": "sess-voice-123",
    "text_prompt": "Explain how neural networks learn",
    "language_preference": "en",
    "voice_locale": "en-US"
  }
  ```
* **Response**: `200 OK`

#### `POST /api/v1/voice/synthesize`
* **Summary**: Direct text-to-speech audio synthesis with automatic code block sanitization.
* **Auth**: None / Optional.
* **Request**:
  ```json
  {
    "text": "Here is the explanation without raw code.",
    "voice_locale": "en-US",
    "speech_rate": 1.0
  }
  ```
* **Response**: `200 OK`

#### `POST /api/v1/voice/interrupt`
* **Summary**: Notify server that the user interrupted/cut-off system speech playback.
* **Auth**: None / Optional.
* **Request**:
  ```json
  {
    "session_id": "sess-voice-123",
    "offset_seconds": 1.2
  }
  ```
* **Response**: `200 OK`

