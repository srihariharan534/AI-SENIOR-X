# AI-SENIOR-X Data Flow Architecture

## 1. Authentication & Session Flow

```mermaid
sequenceDiagram
    autonumber
    actor Learner
    participant Client as Next.js Client
    participant Gateway as FastAPI Router
    participant Auth as AuthService
    participant Repo as UserRepository
    participant DB as PostgreSQL

    Learner->>Client: Enters credentials (email, password)
    Client->>Gateway: POST /api/v1/auth/login
    Gateway->>Auth: authenticate(LoginRequest)
    Auth->>Repo: get_by_email(email)
    Repo->>DB: SELECT * FROM users WHERE email = ?
    DB-->>Repo: User Record
    Repo-->>Auth: User Entity
    Auth->>Auth: verify_password(plain, hashed)
    Auth->>Auth: create_access_token() & create_refresh_token()
    Auth-->>Gateway: Token(access_token, refresh_token, user)
    Gateway-->>Client: ApiResponse[Token]
    Client->>Client: Stores token in memory / localStorage
```

---

## 2. Assessment Submission & Misconception Detection Flow

```mermaid
sequenceDiagram
    autonumber
    actor Learner
    participant Client as Next.js Client
    participant Router as AssessmentRouter
    participant Service as AssessmentService
    participant DB as PostgreSQL

    Learner->>Client: Submits answer for question
    Client->>Router: POST /api/v1/assessment/{id}/submit
    Router->>Service: submit_answer(user_id, assessment_id, AnswerSubmitRequest)
    Service->>DB: Fetch question & correct answer
    DB-->>Service: Question data
    Service->>Service: Evaluate correctness & compute score
    Service->>DB: INSERT INTO answers (is_correct, score, feedback)
    alt Answer is Incorrect
        Service->>DB: INSERT INTO misconceptions (tag, severity, status='active')
    end
    Service->>DB: UPDATE assessments SET total_score = total_score + score
    Service-->>Router: AnswerResultRead
    Router-->>Client: ApiResponse[AnswerResultRead]
```

---

## 3. Learning Pathways & Recommendation Retrieval Flow

```mermaid
sequenceDiagram
    autonumber
    actor Learner
    participant Client as Next.js Client
    participant RecRouter as LearningRouter
    participant RecService as RecommendationService
    participant ProgRepo as ProgressRepository
    participant DB as PostgreSQL

    Learner->>Client: Opens Dashboard
    Client->>RecRouter: GET /api/v1/learning/recommendations
    RecRouter->>RecService: get_personalized_recommendations(user_id)
    RecService->>ProgRepo: list_active_misconceptions(profile_id)
    ProgRepo->>DB: SELECT * FROM misconceptions WHERE status='active'
    DB-->>ProgRepo: List of misconceptions
    RecService->>RecService: Synthesize priority list (Misconceptions > Mastery Gaps)
    RecService-->>RecRouter: List[LearningRecommendation]
    RecRouter-->>Client: ApiResponse[List[LearningRecommendation]]
```
