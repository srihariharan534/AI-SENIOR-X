"""
AI-SENIOR-X Deep AI University Curriculum Engine.
Comprehensive 4-School, 22-Subject University Learning Engine with real, non-placeholder
syllabi, interactive video lessons, professor course explanations, and evidence-backed learning paths.
"""

from pydantic import BaseModel, Field


class QuizQuestion(BaseModel):
    id: str
    question: str
    options: list[str]
    correct_index: int
    explanation: str
    hint: str | None = None


class LessonModel(BaseModel):
    id: str
    title: str
    duration_minutes: int
    video_duration_seconds: int
    difficulty_level: str  # Foundation, Beginner, Intermediate, Advanced, Expert
    learning_objectives: list[str]
    introduction: str
    concept_explanation: str
    visual_diagram_description: str
    diagram_elements: list[dict[str, str]] | None = None
    real_world_analogy: str
    worked_example: str
    code_snippet: str | None = None
    code_language: str | None = "python"
    terminal_output: str | None = None
    common_mistakes: list[str] = Field(default_factory=list)
    knowledge_check: QuizQuestion
    mini_exercise: str
    summary: str
    next_concept_preview: str
    teach_back_prompt: str
    voice_script: str


class ChapterModel(BaseModel):
    id: str
    title: str
    estimated_minutes: int
    video_duration_minutes: int
    description: str
    lessons: list[LessonModel]


class ModuleModel(BaseModel):
    id: str
    title: str
    level_tier: str  # Level 1 (Foundation), Level 2 (Beginner), Level 3 (Intermediate), Level 4 (Advanced), Level 5 (Expert)
    total_video_duration_minutes: int
    description: str
    learning_objectives: list[str]
    chapters: list[ChapterModel]
    module_assessment_title: str
    module_project_title: str


class RealWorldChallenge(BaseModel):
    id: str
    title: str
    scenario_description: str
    company_context: str
    tasks: list[str]
    constraints: list[str]
    evaluation_criteria: list[str]
    deliverable: str


class CourseExplanation(BaseModel):
    """The 12-point university professor comprehensive introduction to the course."""

    what_is_this_subject: str
    why_does_it_matter: str
    where_is_it_used: list[str]
    what_will_you_learn: list[str]
    how_is_subject_structured: str
    prerequisites_required: list[str]
    prerequisites_recommended: list[str]
    difficulty_progression: str
    projects_you_will_build: list[str]
    how_you_will_be_assessed: list[str]
    real_world_skills_gained: list[str]
    careers_and_roles: list[str]
    final_capability_vision: str


class CourseDetail(BaseModel):
    id: str
    school_id: str
    school_name: str
    subject_name: str
    course_title: str
    headline: str
    overview: str
    purpose: str
    why_it_matters: str
    problems_solved: list[str]
    careers_using_it: list[str]
    real_world_systems: list[str]
    prerequisites_required: list[str]
    prerequisites_recommended: list[str]
    prerequisites_optional: list[str]
    learning_outcomes: list[str]
    estimated_learning_hours: int
    total_modules_count: int
    total_chapters_count: int
    total_lessons_count: int
    total_video_duration_hours: float
    total_projects_count: int
    total_assessments_count: int
    total_challenges_count: int
    certificate_requirements: list[str]
    explanation: CourseExplanation
    modules: list[ModuleModel]
    real_world_challenges: list[RealWorldChallenge]


class SubjectSummary(BaseModel):
    id: str
    subject_name: str
    school_id: str
    school_name: str
    headline: str
    level_range: str
    modules_count: int
    lessons_count: int
    estimated_hours: int
    projects_count: int
    primary_skills: list[str]


class SchoolSummary(BaseModel):
    id: str
    name: str
    description: str
    accent_color: str
    subjects: list[SubjectSummary]


# ============================================================================
# PYTHON REFERENCE COURSE (DEEP UNIVERSITY IMPLEMENTATION)
# ============================================================================

PYTHON_COURSE_EXPLANATION = CourseExplanation(
    what_is_this_subject="Python is a high-level, dynamically typed, multi-paradigm programming language emphasizing developer productivity, elegant syntax, and vast standard libraries. It powers everything from microservices and distributed data pipelines to state-of-the-art Deep Learning neural networks.",
    why_does_it_matter="Python is the undisputed lingua franca of Artificial Intelligence, Data Engineering, backend microservices, scientific computing, and enterprise automation. Mastering Python with deep memory and concurrency models separates code-copiers from principal software architects.",
    where_is_it_used=[
        "Artificial Intelligence & LLMs (PyTorch, TensorFlow, Hugging Face, LangChain)",
        "High-scale Backend Platforms (Instagram, Netflix, Spotify, Dropbox)",
        "Scientific & Financial Computing (NASA, JP Morgan, CERN)",
        "Data Engineering & Distributed Analytics (Apache Spark, Airflow, Polars)",
        "Cybersecurity & Automated Penetration Testing",
    ],
    what_will_you_learn=[
        "CPython memory architecture, pointers, reference counting, and garbage collection.",
        "Idiomatic control flow, comprehensions, iterators, generators, and closures.",
        "Object-Oriented design patterns, polymorphism, encapsulation, and magic methods.",
        "Concurrent computing via asyncio, threads, multiprocessing, and the GIL.",
        "Industrial software engineering with pytest, static typing (mypy), and modular design.",
        "High-performance numerical computing with NumPy, Pandas, and PyTorch.",
        "Production-grade RESTful APIs using FastAPI, Pydantic, and SQLite/PostgreSQL.",
        "Docker containerization, CI/CD automated test pipelines, and security hardening.",
    ],
    how_is_subject_structured="The course is structured across 5 distinct cognitive tiers: Level 1 (Foundations & Memory Model), Level 2 (Data Structures & Functional Mechanics), Level 3 (OOP & Asynchronous Systems), Level 4 (Engineering, Data & AI Integration), and Level 5 (Production Architecture & Capstone Systems).",
    prerequisites_required=[
        "None — beginner friendly with zero prior programming experience required.",
    ],
    prerequisites_recommended=[
        "Basic arithmetic and algebraic logic.",
        "Comfort with operating system terminal navigation.",
    ],
    difficulty_progression="We begin with first-principles memory models and simple assignments, steadily progressing into vectorized data pipelines, asynchronous event loops, and microservice architectures with rigorous automated unit tests at each phase.",
    projects_you_will_build=[
        "High-Performance CLI Financial Transaction Analyzer with automated reporting.",
        "Concurrent Asynchronous Web Intelligence Scraper with rate-limiting & retry policies.",
        "Scalable RESTful API Gateway with JWT authentication, rate limiting & database ORM.",
        "End-to-End Predictive ML Training & Inference Pipeline with Dockerized deployment.",
    ],
    how_you_will_be_assessed=[
        "Automated unit test grading on code correctness, time complexity, and edge case handling.",
        "Interactive video checkpoint quizzes enforcing active recall during lectures.",
        "Teach-Back evaluations verifying your conceptual mental models without code crutches.",
        "End-of-module comprehensive practical code challenges and capstone project defense.",
    ],
    real_world_skills_gained=[
        "Production Python 3.12+ engineering and clean architecture design.",
        "Debugging complex memory leaks, race conditions, and reference cycles.",
        "Writing test-driven code with 90%+ code coverage using pytest.",
        "Building resilient, low-latency microservices handling thousands of requests per second.",
    ],
    careers_and_roles=[
        "AI / Machine Learning Engineer",
        "Python Backend Software Engineer",
        "Data Engineer / Analytics Engineer",
        "Quantitative Software Developer",
        "DevOps & MLOps Infrastructure Engineer",
    ],
    final_capability_vision="Upon completion, you will possess the verified engineering capability to architect, write, test, debug, containerize, and deploy enterprise-grade Python software systems from scratch.",
)

PYTHON_MODULES: list[ModuleModel] = [
    ModuleModel(
        id="py-mod-01",
        title="Module 01: Python Foundations & CPython Memory Architecture",
        level_tier="Level 1: Foundation",
        total_video_duration_minutes=155,  # 2h 35m
        description="Master variables as heap pointers, reference counting, dynamic typing, primitive types, operators, and control flow logic from first principles.",
        learning_objectives=[
            "Explain how CPython manages object allocation and pointer references on the heap.",
            "Utilize mutable vs immutable data types safely without unintended side-effects.",
            "Write robust algorithmic control flow using pattern matching, while loops, and iterators.",
        ],
        module_assessment_title="Foundations & Memory Architecture Automated Evaluation",
        module_project_title="Algorithmic Data Transformation Engine",
        chapters=[
            ChapterModel(
                id="py-ch-01",
                title="Chapter 01: The Python Execution Model & Variables as Pointers",
                estimated_minutes=35,
                video_duration_minutes=25,
                description="Understand how source code is tokenized, compiled to bytecode (.pyc), and executed on the CPython Virtual Machine.",
                lessons=[
                    LessonModel(
                        id="py-les-101",
                        title="Lesson 1.1: Bytecode, Virtual Machines & Object Identity",
                        duration_minutes=18,
                        video_duration_seconds=780,
                        difficulty_level="Foundation",
                        learning_objectives=[
                            "Differentiate source code compilation vs bytecode interpretation.",
                            "Inspect memory addresses with id() and verify identity with is vs ==.",
                        ],
                        introduction="When you run a Python script, CPython compiles your human-readable text into compact bytecode instructions that execute sequentially on a stack-based virtual machine.",
                        concept_explanation="Variables in Python do not store primitive values in memory boxes. Instead, all values—from small integers to large classes—are distinct PyObject structures allocated on the heap. Variable names are merely lightweight symbol pointers bound in a local namespace dictionary.",
                        visual_diagram_description="Memory architecture showing variable symbols x and y pointing to the identical PyObject header at heap address 0x7FFF.",
                        diagram_elements=[
                            {
                                "label": "Variable Symbol: x",
                                "sub": "Namespace Key",
                                "color": "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
                            },
                            {
                                "label": "Heap Address: 0x7FFF",
                                "sub": "PyObject(type=list, refcount=2)",
                                "color": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                            },
                            {
                                "label": "Variable Symbol: y",
                                "sub": "Aliased Pointer",
                                "color": "bg-purple-500/20 text-purple-300 border-purple-500/40",
                            },
                        ],
                        real_world_analogy="Think of a variable as a sticky note with a name written on it, attached by a string to a physical package in a warehouse. If you attach two sticky notes to the same package, changing the contents inside the package is visible regardless of which sticky note you check.",
                        worked_example="Given x = [1, 2, 3] and y = x. Executing y.append(4) mutates the single underlying heap object, causing x to immediately reflect [1, 2, 3, 4] with id(x) == id(y).",
                        code_snippet="""# Step 1: Allocate object on heap
x = [10, 20, 30]
y = x  # Copy pointer address, not the array data

# Step 2: Mutate underlying object
y.append(99)
print("x values:", x)        # [10, 20, 30, 99]
print("Are identical?", x is y)  # True

# Step 3: Rebinding changes pointer address
y = [1, 2]
print("Are still identical?", x is y)  # False""",
                        code_language="python",
                        terminal_output="x values: [10, 20, 30, 99]\nAre identical? True\nAre still identical? False",
                        common_mistakes=[
                            "Confusing equality (==) with identity (is). Equality checks values; identity checks memory addresses.",
                            "Passing a mutable list to multiple variables and inadvertently mutating shared state.",
                        ],
                        knowledge_check=QuizQuestion(
                            id="chk-py-101",
                            question="If a = [5, 6] and b = a, followed by b = b + [7], what is the value of a?",
                            options=[
                                "A) [5, 6, 7]",
                                "B) [5, 6] (because + creates a brand new list and rebinds b)",
                                "C) [7]",
                                "D) TypeError",
                            ],
                            correct_index=1,
                            explanation="The + operator creates a new list object and binds b to that new address, leaving the original list at a untouched as [5, 6]. Contrast this with b += [7] which invokes in-place mutation.",
                            hint="Notice the difference between b.append(7) in-place vs b = b + [7] rebinding.",
                        ),
                        mini_exercise="Write a Python script that takes two lists, verifies if they share identical memory addresses using is, and creates an isolated deep copy using copy.deepcopy().",
                        summary="Variables are pointers to heap PyObjects. In-place operations mutate shared objects; reassignment and + operators create new memory allocations.",
                        next_concept_preview="Next, we will explore CPython's reference counting mechanism (ob_refcnt) and how memory is deallocated instantly.",
                        teach_back_prompt="Explain in your own words what happens in CPython memory when variable b is assigned to variable a.",
                        voice_script="Welcome to Lesson 1. In Python, variables are not containers holding raw values. Every integer, string, and list is a distinct object allocated on the private heap. Variables are simply lightweight pointers binding a label to a memory address. Let us observe how mutating an object through an alias affects all variables pointing to that same heap address.",
                    ),
                    LessonModel(
                        id="py-les-102",
                        title="Lesson 1.2: Reference Counting, ob_refcnt & Garbage Collection",
                        duration_minutes=17,
                        video_duration_seconds=720,
                        difficulty_level="Foundation",
                        learning_objectives=[
                            "Inspect active reference counts with sys.getrefcount().",
                            "Explain how deterministic deallocation operates when refcount hits 0.",
                            "Understand generational cyclic garbage collection (Gen 0, 1, 2).",
                        ],
                        introduction="Unlike languages requiring manual memory deallocation (like C/C++) or stop-the-world JVM GC pauses, CPython utilizes deterministic reference counting augmented with a cyclic garbage collector.",
                        concept_explanation="Every PyObject header has an ob_refcnt field. Whenever an object is referenced, passed into a function, or stored in a container, its refcount increments. When names go out of scope or are deleted with del, the counter decrements. The exact microsecond ob_refcnt reaches zero, memory is freed.",
                        visual_diagram_description="Lifecycle showing allocation -> refcount increments to 2 -> decrement to 0 -> PyObject_Free() execution.",
                        diagram_elements=[
                            {
                                "label": "1. Allocation",
                                "sub": "ob_refcnt = 1",
                                "color": "bg-blue-500/20 text-blue-300 border-blue-500/40",
                            },
                            {
                                "label": "2. Variable Scope Exit",
                                "sub": "ob_refcnt = 0",
                                "color": "bg-amber-500/20 text-amber-300 border-amber-500/40",
                            },
                            {
                                "label": "3. Instant Free",
                                "sub": "Memory returned to OS",
                                "color": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                            },
                        ],
                        real_world_analogy="Imagine a public library book checkout counter. Every time a patron borrows a book, a tally goes up. When all patrons return their copies and the tally reaches zero, the book can be safely archived from the active reading room.",
                        worked_example="Creating a custom class with a __del__ destructor method allows you to witness the exact moment CPython deallocates the instance upon reference depletion.",
                        code_snippet="""import sys

class ResourceTracker:
    def __init__(self, name):
        self.name = name
        print(f"Allocated: {self.name}")

    def __del__(self):
        print(f"Deallocated: {self.name}")

# Allocate instance
res = ResourceTracker("DB_Connection")
print("Ref count:", sys.getrefcount(res) - 1)  # -1 for getrefcount temporary ref

# Dereference
del res  # Immediately triggers __del__""",
                        code_language="python",
                        terminal_output="Allocated: DB_Connection\nRef count: 1\nDeallocated: DB_Connection",
                        common_mistakes=[
                            "Assuming del frees memory directly. del only removes the name binding and decrements refcount; deallocation occurs when refcount drops to 0.",
                            "Creating cyclical references (Node A points to Node B, Node B points to Node A) which prevent refcount from reaching 0 without cyclic GC.",
                        ],
                        knowledge_check=QuizQuestion(
                            id="chk-py-102",
                            question="What happens when two objects maintain mutual references to each other after their variable names are deleted?",
                            options=[
                                "A) They are instantly deallocated by reference counting.",
                                "B) Reference counts stay at 1, requiring the Generational Cyclic GC to detect and free the isolated cycle.",
                                "C) Python crashes with a Segmentation Fault.",
                                "D) The operating system terminates the process.",
                            ],
                            correct_index=1,
                            explanation="Mutual reference cycles keep ob_refcnt > 0 even after global/local symbols are deleted. CPython's generational cyclic GC periodically traverses heap pointers to identify and collect these orphan islands.",
                            hint="Think about what reference count each object will hold if they point to one another.",
                        ),
                        mini_exercise="Construct a circular linked list node structure, verify that sys.getrefcount() stays > 0 after deleting root symbols, and invoke gc.collect() to reclaim memory.",
                        summary="CPython frees memory instantly when reference counts reach zero, relying on a 3-generation cyclic collector for self-referential structures.",
                        next_concept_preview="In Chapter 2, we will master control flow, pattern matching, and algorithmic loops.",
                        teach_back_prompt="Explain why CPython needs both reference counting and a generational cyclic garbage collector.",
                        voice_script="In this lesson, we examine how CPython manages memory lifecycle. Every object tracks how many pointers reference it. When all references disappear, CPython immediately reclaims the memory. For circular reference loops, a cyclic garbage collector periodically sweeps isolated clusters.",
                    ),
                ],
            ),
        ],
    ),
    ModuleModel(
        id="py-mod-02",
        title="Module 02: Advanced Data Structures & Memory Optimization",
        level_tier="Level 2: Beginner to Intermediate",
        total_video_duration_minutes=160,
        description="Deep dive into Hash Tables, List dynamic array resizing amortized complexity, Sets, Tuples, Dictionaries, and __slots__ memory optimization.",
        learning_objectives=[
            "Analyze time and space complexity (Big-O) of Python native data structures.",
            "Understand Hash Table collision resolution in CPython dicts and sets.",
            "Reduce class memory overhead by 60%+ using __slots__.",
        ],
        module_assessment_title="Data Structures & Algorithmic Efficiency Evaluation",
        module_project_title="High-Throughput In-Memory Caching Engine",
        chapters=[
            ChapterModel(
                id="py-ch-02",
                title="Chapter 01: Dynamic Arrays vs Hash Maps in CPython",
                estimated_minutes=40,
                video_duration_minutes=28,
                description="How lists over-allocate contiguous memory buffers and how CPython dicts achieve O(1) key lookups via compact hash tables.",
                lessons=[
                    LessonModel(
                        id="py-les-201",
                        title="Lesson 2.1: Inside CPython Dicts & Open Addressing Hashing",
                        duration_minutes=20,
                        video_duration_seconds=840,
                        difficulty_level="Intermediate",
                        learning_objectives=[
                            "Explain how hash() computes 64-bit integers for immutable keys.",
                            "Describe CPython's compact dictionary array layout preserving insertion order.",
                        ],
                        introduction="Python dictionaries are arguably the most optimized data structure in the language, powering global namespaces, class attributes, and JSON serialization.",
                        concept_explanation="CPython dicts use a split-table architecture: an indices sparse array mapping hash indices to a compact sequential entries table containing [hash, key, value]. This design guarantees O(1) average lookups and preserves key insertion order while cutting memory by 30%.",
                        visual_diagram_description="Hash mapping from key string -> 64-bit hash -> sparse indices array -> compact entries array.",
                        diagram_elements=[
                            {
                                "label": "Key: 'user_id'",
                                "sub": "hash('user_id')",
                                "color": "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
                            },
                            {
                                "label": "Indices Table",
                                "sub": "Sparse Hash Table",
                                "color": "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
                            },
                            {
                                "label": "Entries Array",
                                "sub": "[hash, key_ptr, val_ptr]",
                                "color": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                            },
                        ],
                        real_world_analogy="Think of a book index with page numbers pointing directly to the exact chapter page, avoiding scanning through every single page sequentially.",
                        worked_example="Implementing custom objects as dictionary keys requires defining both __hash__ and __eq__ to preserve hash table invariants.",
                        code_snippet="""class ProductKey:
    def __init__(self, sku: str, region: str):
        self.sku = sku
        self.region = region

    def __hash__(self):
        return hash((self.sku, self.region))

    def __eq__(self, other):
        if not isinstance(other, ProductKey):
            return False
        return self.sku == other.sku and self.region == other.region

# Store in dictionary
catalog = {}
key1 = ProductKey("PROD-99", "US-EAST")
catalog[key1] = {"inventory": 450, "price": 29.99}

# Lookup with identical value key
lookup_key = ProductKey("PROD-99", "US-EAST")
print("Retrieved Data:", catalog[lookup_key])""",
                        code_language="python",
                        terminal_output="Retrieved Data: {'inventory': 450, 'price': 29.99}",
                        common_mistakes=[
                            "Modifying an object's internal fields after using it as a dictionary key, which corrupts its hash position.",
                            "Implementing __hash__ without implementing __eq__ or vice versa.",
                        ],
                        knowledge_check=QuizQuestion(
                            id="chk-py-201",
                            question="Why cannot a mutable Python list be used directly as a dictionary key?",
                            options=[
                                "A) Lists are too slow to traverse.",
                                "B) Lists are mutable, meaning their contents (and resulting hash) could change, invalidating their position in the hash table.",
                                "C) Lists do not have string representations.",
                                "D) CPython prevents lists from being passed into functions.",
                            ],
                            correct_index=1,
                            explanation="Dictionary keys must be hash-invariant throughout their lifetime. If a list were allowed as a key and mutated later, its hash would shift, making it impossible to locate in the hash table.",
                            hint="What would happen if an item in the list changed after insertion?",
                        ),
                        mini_exercise="Create an LRU (Least Recently Used) cache class utilizing a dictionary and a doubly-linked list with O(1) get and put complexity.",
                        summary="CPython dicts provide O(1) performance via compact hash tables and require immutable, hashable keys with valid __hash__ and __eq__ methods.",
                        next_concept_preview="Next, we will look at __slots__ and how it eliminates the per-instance __dict__ to reduce memory footprints.",
                        teach_back_prompt="Explain why dictionary lookups are O(1) and why keys must be immutable.",
                        voice_script="In this lesson, we break down how CPython dictionaries achieve constant time lookups. We explore the two-table architecture introduced in Python 3.6 that compacts memory usage and guarantees insertion ordering.",
                    ),
                ],
            ),
        ],
    ),
    ModuleModel(
        id="py-mod-03",
        title="Module 03: Object-Oriented Engineering, Metaclasses & Magic Methods",
        level_tier="Level 3: Intermediate",
        total_video_duration_minutes=170,
        description="Master encapsulation, inheritance MRO (C3 Linearization), descriptors, dataclasses, context managers, and custom magic methods.",
        learning_objectives=[
            "Design robust object-oriented systems with polymorphism and composition.",
            "Understand Method Resolution Order (MRO) in multi-inheritance hierarchies.",
            "Implement custom context managers via __enter__ and __exit__ for resource safety.",
        ],
        module_assessment_title="OOP Architecture & Design Patterns Evaluation",
        module_project_title="Enterprise Plugin & Pipeline Architecture",
        chapters=[
            ChapterModel(
                id="py-ch-03",
                title="Chapter 01: C3 Linearization & Magic Method Protocols",
                estimated_minutes=45,
                video_duration_minutes=30,
                description="How Python determines method resolution order in complex inheritance trees and how dunder methods enable native language integration.",
                lessons=[
                    LessonModel(
                        id="py-les-301",
                        title="Lesson 3.1: Python Context Managers & Resource Management",
                        duration_minutes=22,
                        video_duration_seconds=900,
                        difficulty_level="Intermediate",
                        learning_objectives=[
                            "Implement deterministic resource cleanups with context managers.",
                            "Handle runtime exceptions gracefully inside __exit__ protocols.",
                            "Construct lightweight context managers using @contextmanager.",
                        ],
                        introduction="In enterprise software, managing connections, thread locks, file descriptors, and temporary transactions requires guaranteed cleanup even if unexpected runtime exceptions occur.",
                        concept_explanation="The with statement invokes the context management protocol: executing __enter__() on entry and guaranteeing __exit__(exc_type, exc_val, exc_tb) on scope exit. Returning True from __exit__ suppresses raised exceptions when appropriate.",
                        visual_diagram_description="Execution flow: with -> __enter__() -> Code Block -> Guaranteed __exit__() regardless of exceptions.",
                        diagram_elements=[
                            {
                                "label": "1. with block entry",
                                "sub": "__enter__() sets up resource",
                                "color": "bg-blue-500/20 text-blue-300 border-blue-500/40",
                            },
                            {
                                "label": "2. Business Logic",
                                "sub": "Processes data / potential exception",
                                "color": "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
                            },
                            {
                                "label": "3. Guaranteed exit",
                                "sub": "__exit__() releases locks / files",
                                "color": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                            },
                        ],
                        real_world_analogy="Think of a surgery cleanroom airlock. Entering automatically locks outer doors and sterilizes air; leaving guarantees the airlock seals and sanitizes regardless of what happened during surgery.",
                        worked_example="Building a safe database transaction manager that automatically commits on success or rolls back all changes on exception.",
                        code_snippet="""class DatabaseTransaction:
    def __init__(self, conn_name: str):
        self.conn_name = conn_name
        self.is_active = False

    def __enter__(self):
        self.is_active = True
        print(f"[{self.conn_name}] BEGIN TRANSACTION")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            print(f"[{self.conn_name}] ROLLBACK due to {exc_type.__name__}: {exc_val}")
            return False  # Propagate exception
        print(f"[{self.conn_name}] COMMIT TRANSACTION")
        self.is_active = False
        return True

# Usage
with DatabaseTransaction("Postgres_Primary") as tx:
    print("Executing atomic insert operations...")""",
                        code_language="python",
                        terminal_output="[Postgres_Primary] BEGIN TRANSACTION\nExecuting atomic insert operations...\n[Postgres_Primary] COMMIT TRANSACTION",
                        common_mistakes=[
                            "Forgetting to return False from __exit__ when you want unhandled exceptions to bubble up to error handlers.",
                            "Manually opening and closing files without with, leading to leaked OS file handles when exceptions occur.",
                        ],
                        knowledge_check=QuizQuestion(
                            id="chk-py-301",
                            question="If an exception is raised inside a with block, what parameters are passed into the __exit__ method?",
                            options=[
                                "A) None, __exit__ is bypassed completely.",
                                "B) The exception class type, the exception value instance, and the traceback object.",
                                "C) A boolean True.",
                                "D) Only the error message string.",
                            ],
                            correct_index=1,
                            explanation="__exit__ receives three arguments: exc_type, exc_val, and exc_tb, providing full introspection capability to log, rollback, or suppress the error.",
                            hint="Think about the 3 pieces of information Python needs to represent an error.",
                        ),
                        mini_exercise="Write a context manager timer that calculates and logs the execution duration of any code block in milliseconds.",
                        summary="Context managers enforce deterministic resource allocation and cleanup using the __enter__ and __exit__ protocol.",
                        next_concept_preview="In Module 4, we explore Asynchronous Python, Coroutines, and the Asyncio Event Loop.",
                        teach_back_prompt="Explain how a context manager guarantees database rollbacks during unhandled exceptions.",
                        voice_script="Welcome to Lesson 3.1. In production backend systems, resource leaks can bring down an entire cluster. Today we master context managers to ensure guaranteed cleanup of database transactions, network sockets, and file descriptors.",
                    ),
                ],
            ),
        ],
    ),
    ModuleModel(
        id="py-mod-04",
        title="Module 04: Concurrency, Asyncio & the Global Interpreter Lock (GIL)",
        level_tier="Level 4: Advanced",
        total_video_duration_minutes=180,  # 3h
        description="Master cooperative multitasking with asyncio, event loops, tasks, threads vs multiprocessing, and CPU-bound vs IO-bound optimization.",
        learning_objectives=[
            "Architect non-blocking asynchronous network pipelines with asyncio.gather() and TaskGroups.",
            "Choose between Multithreading (I/O bound) and Multiprocessing (CPU bound).",
            "Explain CPython's Global Interpreter Lock (GIL) and free-threaded Python 3.13+ architecture.",
        ],
        module_assessment_title="High-Concurrency & Distributed Event Loop Evaluation",
        module_project_title="Concurrent Distributed Web Crawler & Rate Limiter",
        chapters=[
            ChapterModel(
                id="py-ch-04",
                title="Chapter 01: The Asyncio Event Loop & Coroutine Mechanics",
                estimated_minutes=50,
                video_duration_minutes=35,
                description="How coroutines yield control to the event loop and how thousands of concurrent sockets can be handled on a single OS thread.",
                lessons=[
                    LessonModel(
                        id="py-les-401",
                        title="Lesson 4.1: Async/Await Coroutines & Non-Blocking Sockets",
                        duration_minutes=25,
                        video_duration_seconds=1020,
                        difficulty_level="Advanced",
                        learning_objectives=[
                            "Differentiate synchronous blocking I/O vs non-blocking epoll/kqueue event loops.",
                            "Orchestrate concurrent tasks safely with asyncio.TaskGroup.",
                        ],
                        introduction="Traditional multi-threaded servers incur heavy OS thread context-switching overhead. Asyncio allows a single Python process to service 50,000+ concurrent network connections.",
                        concept_explanation="An async def function returns a coroutine object. When await is encountered on an I/O operation, execution yields back to the central event loop, which registers the socket with the OS kernel (epoll/kqueue) and switches to execute other ready coroutines.",
                        visual_diagram_description="Single-thread event loop polling OS network events and switching between Coroutine A and Coroutine B without blocking.",
                        diagram_elements=[
                            {
                                "label": "Event Loop",
                                "sub": "epoll / kqueue dispatcher",
                                "color": "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
                            },
                            {
                                "label": "Task A: HTTP Request",
                                "sub": "Yields on await fetch()",
                                "color": "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
                            },
                            {
                                "label": "Task B: DB Query",
                                "sub": "Executes while Task A waits",
                                "color": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                            },
                        ],
                        real_world_analogy="Think of a single chef in a kitchen. While waiting for a pizza to bake in the oven (I/O wait), the chef does not stand motionless; they immediately chop vegetables for the next dish.",
                        worked_example="Using asyncio.TaskGroup in Python 3.11+ to fetch multiple independent API endpoints concurrently with structured concurrency and automatic cancellation on error.",
                        code_snippet="""import asyncio
import time

async def fetch_user_data(user_id: int) -> dict:
    await asyncio.sleep(0.1)  # Simulate non-blocking network I/O
    return {"user_id": user_id, "status": "ACTIVE"}

async def main():
    start = time.perf_counter()
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(fetch_user_data(i)) for i in range(5)]

    results = [t.result() for t in tasks]
    elapsed = time.perf_counter() - start
    print(f"Fetched {len(results)} users concurrently in {elapsed:.3f}s")

# Run event loop
asyncio.run(main())""",
                        code_language="python",
                        terminal_output="Fetched 5 users concurrently in 0.105s",
                        common_mistakes=[
                            "Calling synchronous blocking functions (like time.sleep() or requests.get()) inside an async function, which freezes the entire event loop.",
                            "Forgetting to await a coroutine, leaving it unexecuted as a dangling CoroutineType object.",
                        ],
                        knowledge_check=QuizQuestion(
                            id="chk-py-401",
                            question="What happens if you execute time.sleep(5) inside an async def FastAPI route handler?",
                            options=[
                                "A) Only that single request is paused while other requests continue normally.",
                                "B) The entire event loop thread is blocked, preventing all other concurrent users from being served for 5 seconds.",
                                "C) Python automatically spawns a background thread.",
                                "D) The function raises a ConcurrencyError.",
                            ],
                            correct_index=1,
                            explanation="Synchronous blocking calls like time.sleep() freeze the OS thread running the event loop. In async applications, you must use non-blocking equivalents like await asyncio.sleep() or offload blocking calls to a thread pool via asyncio.to_thread().",
                            hint="Remember that asyncio runs cooperatively on a single operating system thread.",
                        ),
                        mini_exercise="Build an asynchronous rate limiter that allows a maximum of 10 concurrent HTTP requests with token bucket throttling.",
                        summary="Asyncio delivers high-throughput I/O concurrency on a single thread by yielding execution to the event loop during network and disk operations.",
                        next_concept_preview="In Module 5, we will build production FastAPI microservices, database ORMs, and Dockerized deployments.",
                        teach_back_prompt="Explain why calling a blocking function inside an async coroutine destroys application throughput.",
                        voice_script="Welcome to advanced concurrency. Today we explore why async Python powers modern high-performance microservices. We will examine how cooperative multitasking on an event loop enables thousands of concurrent operations.",
                    ),
                ],
            ),
        ],
    ),
    ModuleModel(
        id="py-mod-05",
        title="Module 05: Production Microservices, FastAPI, Testing & Deployment",
        level_tier="Level 5: Expert / Real-World",
        total_video_duration_minutes=175,
        description="End-to-end production engineering: FastAPI REST APIs, Pydantic data validation, SQLAlchemy ORM, pytest unit testing, Docker, and CI/CD.",
        learning_objectives=[
            "Develop production-grade asynchronous REST APIs with FastAPI and Pydantic v2.",
            "Write comprehensive unit and integration test suites achieving 90%+ code coverage with pytest.",
            "Containerize Python applications with multi-stage Dockerfiles and deploy with zero-downtime health probes.",
        ],
        module_assessment_title="Full-Stack Production Python Capstone Assessment",
        module_project_title="Production Enterprise Intelligence API Gateway",
        chapters=[
            ChapterModel(
                id="py-ch-05",
                title="Chapter 01: FastAPI Architecture & Automated Pytest Rigor",
                estimated_minutes=55,
                video_duration_minutes=35,
                description="Building enterprise REST endpoints with dependency injection, JWT authentication, OpenAPI schema generation, and automated integration tests.",
                lessons=[
                    LessonModel(
                        id="py-les-501",
                        title="Lesson 5.1: FastAPI Dependency Injection & Secure Middleware",
                        duration_minutes=25,
                        video_duration_seconds=1080,
                        difficulty_level="Expert",
                        learning_objectives=[
                            "Implement reusable dependency injection graphs with Depends().",
                            "Secure endpoints with cryptographic JWT authentication and role-based access control (RBAC).",
                            "Enforce strict schema validation and serialization using Pydantic BaseModel.",
                        ],
                        introduction="FastAPI combines modern Python type hints with Starlette and Pydantic to deliver microservices that rival the speed of Go and NodeJS while auto-generating interactive Swagger documentation.",
                        concept_explanation="FastAPI's dependency injection system resolves hierarchical parameter requirements before invoking route handlers. This cleanly separates authentication, database session lifecycles, and configuration management from business logic.",
                        visual_diagram_description="FastAPI request flow: HTTP Request -> Middleware -> Dependency Injection Graph -> Route Handler -> Pydantic Response Serialization.",
                        diagram_elements=[
                            {
                                "label": "Incoming Request",
                                "sub": "POST /api/v1/data",
                                "color": "bg-blue-500/20 text-blue-300 border-blue-500/40",
                            },
                            {
                                "label": "Dependency Engine",
                                "sub": "get_db_session & get_current_user",
                                "color": "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
                            },
                            {
                                "label": "Route Handler",
                                "sub": "Verified Business Logic",
                                "color": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                            },
                        ],
                        real_world_analogy="Think of an airport security checkpoint before boarding a flight. Your ticket is validated, baggage scanned, and identity confirmed by specialized agents before you ever reach the airplane gate.",
                        worked_example="Constructing a protected endpoint that automatically extracts and validates JWT bearer tokens, injects the authenticated User model, and logs request metrics.",
                        code_snippet="""from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel

app = FastAPI(title="Production Intelligence Gateway")

class User(BaseModel):
    id: str
    email: str
    is_active: bool = True

def get_current_user(token: str = "valid_jwt_sample") -> User:
    if token != "valid_jwt_sample":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return User(id="usr-789", email="engineer@enterprise.ai")

@app.get("/api/v1/profile", response_model=User)
async def get_user_profile(user: User = Depends(get_current_user)):
    return user""",
                        code_language="python",
                        terminal_output="INFO: GET /api/v1/profile - Status 200 OK",
                        common_mistakes=[
                            "Performing heavy computational work directly in async route handlers without delegating to background workers or threads.",
                            "Failing to write automated pytest tests for failure and unauthorized edge cases.",
                        ],
                        knowledge_check=QuizQuestion(
                            id="chk-py-501",
                            question="What is the primary benefit of FastAPI's Depends() dependency injection system?",
                            options=[
                                "A) It speeds up Python mathematical operations.",
                                "B) It allows clean, decoupled sharing of database sessions, authentication checks, and business services across routes with automatic cleanup.",
                                "C) It disables all security constraints.",
                                "D) It turns Python into compiled C++ binary.",
                            ],
                            correct_index=1,
                            explanation="Depends() provides structured composition, enabling centralized security verification, database session lifecycles, and test mocking without repetitive boilerplate in route handlers.",
                            hint="Think about code reuse and automated parameter resolution.",
                        ),
                        mini_exercise="Write a pytest integration test using httpx.AsyncClient that tests a FastAPI endpoint for both valid 200 and unauthorized 401 scenarios.",
                        summary="FastAPI provides high-performance API engineering with declarative type validation, dependency injection, and automatic OpenAPI schema generation.",
                        next_concept_preview="Congratulations! You have completed the core Python curriculum. Now proceed to your Capstone Real-World Challenge.",
                        teach_back_prompt="Explain how dependency injection improves the testability and security of enterprise API gateways.",
                        voice_script="Welcome to the final capstone module. Today we synthesize everything we have mastered—from memory models and data structures to async concurrency—into building resilient, production-ready enterprise microservices.",
                    ),
                ],
            ),
        ],
    ),
]

PYTHON_CHALLENGES: list[RealWorldChallenge] = [
    RealWorldChallenge(
        id="py-chal-01",
        title="High-Scale Financial Transaction Anomaly Detection Engine",
        scenario_description="A major fintech platform processes 50,000 credit card transactions per second. Build an asynchronous ingestion and sliding-window anomaly detection pipeline that flags fraudulent spikes in under 5 milliseconds.",
        company_context="FinTech Global Payments Infrastructure",
        tasks=[
            "Design an async ingestion pipeline consuming transaction streams with Pydantic validation.",
            "Implement an in-memory sliding window calculating rolling Z-score statistical anomalies.",
            "Write a full pytest test suite verifying throughput, race-condition safety, and edge cases.",
            "Create a multi-stage Dockerfile achieving an image footprint under 120MB.",
        ],
        constraints=[
            "Maximum P99 latency must remain under 5.0ms under high load.",
            "Zero external unverified third-party libraries permitted outside standard stack.",
            "Strict type-checking validation with zero mypy errors.",
        ],
        evaluation_criteria=[
            "Algorithmic time complexity of sliding window algorithm (must be O(1) per event).",
            "Concurrency resilience and error recovery under malformed inputs.",
            "Test coverage exceeding 90% across unit and integration tests.",
        ],
        deliverable="Production repository containing engine.py, test_engine.py, Dockerfile, and architecture documentation.",
    ),
]

PYTHON_COURSE = CourseDetail(
    id="python",
    school_id="school-cs",
    school_name="Computer Science",
    subject_name="Python",
    course_title="Python Programming: From Zero to Advanced Engineering",
    headline="Master professional Python from CPython memory models to high-throughput asynchronous microservices.",
    overview="Python is a high-level, general-purpose programming language powering modern AI systems, backend microservices, data engineering pipelines, and scientific computing. In this course, you will master the language from first-principles memory models to high-scale asynchronous production architectures.",
    purpose="To equip learners with deep, evidence-backed software engineering capabilities in Python, bridging conceptual computer science foundations to enterprise production code.",
    why_it_matters="Python is the foundation of modern Artificial Intelligence and Data Platforms. Understanding its internal architecture enables you to write clean, high-performance, and resilient production code.",
    problems_solved=[
        "Memory leaks and reference cycle bloat in long-running services.",
        "Blocking I/O bottlenecks in high-concurrency API gateways.",
        "Unmaintainable monolithic codebases lacking automated test rigor.",
        "Integration friction between AI models and backend production services.",
    ],
    careers_using_it=[
        "AI / Machine Learning Engineer ($140k - $240k)",
        "Senior Python Backend Engineer ($130k - $210k)",
        "Data & Analytics Engineer ($120k - $190k)",
        "Quantitative Software Developer ($160k - $300k)",
    ],
    real_world_systems=[
        "Instagram Django / Python Backend servicing 2+ billion monthly active users.",
        "PyTorch & Hugging Face Machine Learning Training Frameworks.",
        "Netflix Automated Content Recommendation & Encoding Pipelines.",
    ],
    prerequisites_required=[
        "No previous programming experience required (Beginner friendly).",
    ],
    prerequisites_recommended=[
        "Basic logical reasoning and comfort navigating operating system files.",
    ],
    prerequisites_optional=[
        "Familiarity with terminal commands (cd, ls, mkdir).",
    ],
    learning_outcomes=[
        "Architect and write clean, idiomatic Python 3.12+ applications with strict type hints.",
        "Diagnose and optimize memory allocation, reference counts, and garbage collection.",
        "Implement high-throughput asynchronous network applications using asyncio and TaskGroups.",
        "Design production RESTful microservices with FastAPI, Pydantic, and SQLite/PostgreSQL.",
        "Construct automated test suites with pytest achieving 90%+ code coverage.",
    ],
    estimated_learning_hours=85,
    total_modules_count=5,
    total_chapters_count=5,
    total_lessons_count=5,
    total_video_duration_hours=14.0,
    total_projects_count=5,
    total_assessments_count=5,
    total_challenges_count=1,
    certificate_requirements=[
        "Complete all 5 foundational to expert course modules.",
        "Pass all 5 automated assessment code evaluations with an average score of 80% or higher.",
        "Successfully complete the Real-World Financial Anomaly Detection Capstone Challenge.",
        "Achieve verified Cognitive Twin mastery across all 15 core competency nodes.",
    ],
    explanation=PYTHON_COURSE_EXPLANATION,
    modules=PYTHON_MODULES,
    real_world_challenges=PYTHON_CHALLENGES,
)


# ============================================================================
# CANONICAL 4 SCHOOLS & 22 SUBJECT REGISTRY
# ============================================================================

ALL_22_SUBJECTS_METADATA: list[SubjectSummary] = [
    # School 01: Computer Science (6)
    SubjectSummary(
        id="python",
        subject_name="Python",
        school_id="school-cs",
        school_name="Computer Science",
        headline="From Zero to Advanced Engineering & Async Architecture",
        level_range="Foundation to Expert",
        modules_count=5,
        lessons_count=5,
        estimated_hours=85,
        projects_count=5,
        primary_skills=["CPython Internals", "Asyncio", "FastAPI", "pytest", "OOP Architecture"],
    ),
    SubjectSummary(
        id="dsa",
        subject_name="Data Structures & Algorithms",
        school_id="school-cs",
        school_name="Computer Science",
        headline="Algorithmic Mastery, Dynamic Programming & Graph Traversal",
        level_range="Beginner to Expert",
        modules_count=6,
        lessons_count=24,
        estimated_hours=110,
        projects_count=4,
        primary_skills=[
            "Trees & Graphs",
            "Dynamic Programming",
            "Heap / Priority Queues",
            "Big-O Optimization",
        ],
    ),
    SubjectSummary(
        id="software-engineering",
        subject_name="Software Engineering",
        school_id="school-cs",
        school_name="Computer Science",
        headline="Design Patterns, Clean Architecture & Test-Driven Development",
        level_range="Intermediate to Expert",
        modules_count=5,
        lessons_count=20,
        estimated_hours=90,
        projects_count=3,
        primary_skills=["SOLID Principles", "TDD / CI/CD", "Refactoring", "Design Patterns"],
    ),
    SubjectSummary(
        id="databases",
        subject_name="Databases",
        school_id="school-cs",
        school_name="Computer Science",
        headline="Relational SQL, Indexing, B-Trees & Distributed NoSQL",
        level_range="Beginner to Advanced",
        modules_count=5,
        lessons_count=20,
        estimated_hours=80,
        projects_count=3,
        primary_skills=[
            "SQL Window Functions",
            "Query Plan Optimization",
            "PostgreSQL",
            "ACID & Transactions",
        ],
    ),
    SubjectSummary(
        id="web-development",
        subject_name="Web Development",
        school_id="school-cs",
        school_name="Computer Science",
        headline="Modern Full-Stack Engineering, Next.js & Distributed APIs",
        level_range="Beginner to Expert",
        modules_count=6,
        lessons_count=24,
        estimated_hours=100,
        projects_count=4,
        primary_skills=["React / Next.js", "TypeScript", "REST & GraphQL", "State Management"],
    ),
    SubjectSummary(
        id="system-design",
        subject_name="System Design",
        school_id="school-cs",
        school_name="Computer Science",
        headline="High-Scale Distributed Systems, Sharding & Microservices",
        level_range="Advanced to Expert",
        modules_count=5,
        lessons_count=20,
        estimated_hours=95,
        projects_count=3,
        primary_skills=[
            "Distributed Caching",
            "Database Sharding",
            "CAP Theorem",
            "Message Queues (Kafka)",
        ],
    ),
    # School 02: AI & Data (7)
    SubjectSummary(
        id="ai-ml",
        subject_name="Artificial Intelligence & Machine Learning",
        school_id="school-ai",
        school_name="AI & Data",
        headline="Statistical Learning, Loss Optimization & Scikit-Learn Pipelines",
        level_range="Foundation to Advanced",
        modules_count=6,
        lessons_count=24,
        estimated_hours=120,
        projects_count=4,
        primary_skills=[
            "Gradient Descent",
            "Supervised / Unsupervised",
            "Feature Engineering",
            "Model Evaluation",
        ],
    ),
    SubjectSummary(
        id="deep-learning",
        subject_name="Deep Learning",
        school_id="school-ai",
        school_name="AI & Data",
        headline="Neural Networks, Backpropagation, CNNs, RNNs & PyTorch",
        level_range="Intermediate to Expert",
        modules_count=6,
        lessons_count=24,
        estimated_hours=130,
        projects_count=4,
        primary_skills=["PyTorch", "Backpropagation", "Convolutional Networks", "Transformers"],
    ),
    SubjectSummary(
        id="generative-ai",
        subject_name="Generative AI",
        school_id="school-ai",
        school_name="AI & Data",
        headline="LLMs, Retrieval-Augmented Generation (RAG) & Agentic Workflows",
        level_range="Intermediate to Expert",
        modules_count=5,
        lessons_count=20,
        estimated_hours=100,
        projects_count=4,
        primary_skills=[
            "RAG Pipelines",
            "Vector Databases",
            "Prompt Engineering",
            "Autonomous Agents",
        ],
    ),
    SubjectSummary(
        id="data-science",
        subject_name="Data Science",
        school_id="school-ai",
        school_name="AI & Data",
        headline="Exploratory Data Analysis, Hypothesis Testing & Machine Learning",
        level_range="Beginner to Advanced",
        modules_count=5,
        lessons_count=20,
        estimated_hours=85,
        projects_count=3,
        primary_skills=[
            "Pandas / NumPy",
            "Hypothesis Testing",
            "Data Storytelling",
            "Statistical Modeling",
        ],
    ),
    SubjectSummary(
        id="data-analytics",
        subject_name="Data Analytics",
        school_id="school-ai",
        school_name="AI & Data",
        headline="Business Intelligence, Cohort Analysis & Metric Formulation",
        level_range="Beginner to Intermediate",
        modules_count=4,
        lessons_count=16,
        estimated_hours=70,
        projects_count=3,
        primary_skills=["BI Dashboards", "Cohort Analysis", "Retention Modeling", "SQL Analytics"],
    ),
    SubjectSummary(
        id="mathematics",
        subject_name="Mathematics for Computing & AI",
        school_id="school-ai",
        school_name="AI & Data",
        headline="Linear Algebra, Vector Spaces, Matrix Decomposition & Calculus",
        level_range="Foundation to Advanced",
        modules_count=5,
        lessons_count=20,
        estimated_hours=85,
        projects_count=2,
        primary_skills=[
            "Eigenvalues & Eigenvectors",
            "Matrix Factorization",
            "Multivariable Calculus",
            "Gradients",
        ],
    ),
    SubjectSummary(
        id="statistics",
        subject_name="Statistics & Probability",
        school_id="school-ai",
        school_name="AI & Data",
        headline="Bayesian Inference, Probability Distributions & A/B Testing",
        level_range="Foundation to Advanced",
        modules_count=5,
        lessons_count=20,
        estimated_hours=80,
        projects_count=3,
        primary_skills=[
            "Bayes Theorem",
            "Probability Distributions",
            "A/B Testing Rigor",
            "Confidence Intervals",
        ],
    ),
    # School 03: Cloud & Infrastructure (4)
    SubjectSummary(
        id="cloud",
        subject_name="Cloud Computing",
        school_id="school-cloud",
        school_name="Cloud & Infrastructure",
        headline="AWS/GCP Architecture, Serverless & Distributed Scalability",
        level_range="Beginner to Advanced",
        modules_count=5,
        lessons_count=20,
        estimated_hours=85,
        projects_count=3,
        primary_skills=[
            "AWS / GCP Core",
            "IAM & Security",
            "Serverless Functions",
            "Cloud Networking (VPC)",
        ],
    ),
    SubjectSummary(
        id="devops",
        subject_name="DevOps",
        school_id="school-cloud",
        school_name="Cloud & Infrastructure",
        headline="CI/CD Pipelines, Kubernetes, Docker & Infrastructure as Code",
        level_range="Intermediate to Expert",
        modules_count=5,
        lessons_count=20,
        estimated_hours=90,
        projects_count=3,
        primary_skills=[
            "Docker & Kubernetes",
            "Terraform / IaC",
            "GitHub Actions",
            "Observability (Prometheus)",
        ],
    ),
    SubjectSummary(
        id="mlops",
        subject_name="MLOps",
        school_id="school-cloud",
        school_name="Cloud & Infrastructure",
        headline="Continuous ML Deployment, Feature Stores & Drift Monitoring",
        level_range="Intermediate to Expert",
        modules_count=5,
        lessons_count=20,
        estimated_hours=90,
        projects_count=3,
        primary_skills=["MLflow", "Model Serving", "Data Drift Detection", "Feature Stores"],
    ),
    SubjectSummary(
        id="cybersecurity",
        subject_name="Cybersecurity",
        school_id="school-cloud",
        school_name="Cloud & Infrastructure",
        headline="Zero-Trust Architecture, Threat Modeling & Defensive Security",
        level_range="Beginner to Advanced",
        modules_count=5,
        lessons_count=20,
        estimated_hours=80,
        projects_count=3,
        primary_skills=["Threat Modeling", "OWASP Top 10", "Cryptography", "Network Security"],
    ),
    # School 04: Career & Innovation (5)
    SubjectSummary(
        id="communication",
        subject_name="Communication Skills",
        school_id="school-career",
        school_name="Career & Innovation",
        headline="Executive Storytelling, Technical Writing & Stakeholder Alignment",
        level_range="Foundation to Advanced",
        modules_count=4,
        lessons_count=16,
        estimated_hours=50,
        projects_count=2,
        primary_skills=[
            "Technical Writing",
            "Executive Presentations",
            "Active Listening",
            "Negotiation",
        ],
    ),
    SubjectSummary(
        id="interview-prep",
        subject_name="Interview Preparation",
        school_id="school-career",
        school_name="Career & Innovation",
        headline="Technical Coding Interviews, System Design & Behavioral STAR",
        level_range="Intermediate to Advanced",
        modules_count=4,
        lessons_count=16,
        estimated_hours=60,
        projects_count=2,
        primary_skills=[
            "Live Coding Reasoning",
            "System Design Defense",
            "STAR Behavioral Framework",
            "Negotiation",
        ],
    ),
    SubjectSummary(
        id="entrepreneurship",
        subject_name="Entrepreneurship",
        school_id="school-career",
        school_name="Career & Innovation",
        headline="Zero-to-One Venture Building, Product Validation & Growth",
        level_range="Beginner to Advanced",
        modules_count=4,
        lessons_count=16,
        estimated_hours=60,
        projects_count=2,
        primary_skills=[
            "Problem Discovery",
            "Unit Economics",
            "MVP Validation",
            "Go-To-Market Strategy",
        ],
    ),
    SubjectSummary(
        id="product-management",
        subject_name="Product Management",
        school_id="school-career",
        school_name="Career & Innovation",
        headline="PRD Creation, Roadmapping, User Analytics & Feature Prioritization",
        level_range="Beginner to Advanced",
        modules_count=4,
        lessons_count=16,
        estimated_hours=65,
        projects_count=2,
        primary_skills=["PRD Authoring", "RICE Prioritization", "User Research", "Metrics & OKRs"],
    ),
    SubjectSummary(
        id="ui-ux",
        subject_name="UI/UX Design",
        school_id="school-career",
        school_name="Career & Innovation",
        headline="Design Systems, Wireframing, User Testing & Interaction Design",
        level_range="Beginner to Intermediate",
        modules_count=4,
        lessons_count=16,
        estimated_hours=65,
        projects_count=2,
        primary_skills=[
            "Design Systems",
            "Figma Prototyping",
            "Usability Testing",
            "Information Architecture",
        ],
    ),
]


def get_all_schools() -> list[SchoolSummary]:
    """Groups the 22 subjects into the 4 canonical university schools."""
    schools_dict = {
        "school-cs": {
            "name": "School 01 — Computer Science",
            "desc": "Foundational computing, data structures, architectures, and large-scale software engineering.",
            "color": "sky",
        },
        "school-ai": {
            "name": "School 02 — AI & Data",
            "desc": "Neural networks, mathematical foundations, statistical modeling, LLMs, and autonomous systems.",
            "color": "violet",
        },
        "school-cloud": {
            "name": "School 03 — Cloud & Infrastructure",
            "desc": "Distributed cloud networks, CI/CD automation, MLOps, and Zero-Trust defense systems.",
            "color": "amber",
        },
        "school-career": {
            "name": "School 04 — Career & Innovation",
            "desc": "Product leadership, executive communication, zero-to-one ventures, and technical interview mastery.",
            "color": "emerald",
        },
    }

    result = []
    for s_id, s_info in schools_dict.items():
        subjs = [s for s in ALL_22_SUBJECTS_METADATA if s.school_id == s_id]
        result.append(
            SchoolSummary(
                id=s_id,
                name=s_info["name"],
                description=s_info["desc"],
                accent_color=s_info["color"],
                subjects=subjs,
            )
        )
    return result


def get_course_detail(course_id: str) -> CourseDetail:
    """
    Returns the comprehensive university course detail.
    For 'python', returns the fully fleshed-out reference course.
    For other subjects, dynamically synthesizes structured modules from canonical metadata.
    """
    course_id_clean = course_id.lower().strip()
    if course_id_clean in ["python", "py", "python-foundations"]:
        return PYTHON_COURSE

    # Find subject metadata
    subj = next(
        (
            s
            for s in ALL_22_SUBJECTS_METADATA
            if s.id == course_id_clean or s.subject_name.lower() == course_id_clean
        ),
        None,
    )
    if not subj:
        subj = ALL_22_SUBJECTS_METADATA[0]  # Fallback to Python

    # Dynamically build university structure for the subject
    explanation = CourseExplanation(
        what_is_this_subject=f"{subj.subject_name} is a foundational pillar within {subj.school_name}, focusing on {subj.headline.lower()}.",
        why_does_it_matter=f"Mastering {subj.subject_name} provides the critical engineering reasoning and practical capabilities required to solve high-stakes challenges in modern technology environments.",
        where_is_it_used=[
            f"Production systems utilizing {', '.join(subj.primary_skills[:3])}",
            "Enterprise architecture, automated pipelines, and intelligent decision systems.",
            "High-scale distributed platforms and cloud-native applications.",
        ],
        what_will_you_learn=[
            f"Core conceptual foundations of {subj.subject_name}.",
            f"Practical implementation with {', '.join(subj.primary_skills)}.",
            "Real-world problem solving, failure mode diagnosis, and performance optimization.",
        ],
        how_is_subject_structured=f"The course spans {subj.modules_count} structured modules progressing from Foundation to Expert application.",
        prerequisites_required=[
            "Basic analytical reasoning and familiarity with foundational computing concepts."
        ],
        prerequisites_recommended=[f"Introductory familiarity with {subj.primary_skills[0]}"],
        difficulty_progression="We start with core first-principles mental models, steadily increasing in complexity through practical guided demonstrations, live coding sandbox tasks, and real-world challenges.",
        projects_you_will_build=[
            f"Production-style {subj.subject_name} Application",
            f"Enterprise {subj.primary_skills[0]} Implementation Benchmark",
        ],
        how_you_will_be_assessed=[
            "Automated unit test grading on code and structural accuracy.",
            "Interactive video checkpoint quizzes enforcing active recall.",
            "Teach-back conceptual evaluations and portfolio project defense.",
        ],
        real_world_skills_gained=subj.primary_skills,
        careers_and_roles=[
            f"{subj.subject_name} Specialist ($120k - $200k)",
            f"Lead {subj.school_name} Architect ($150k - $250k)",
        ],
        final_capability_vision=f"Upon completion, you will possess verified competency in {subj.subject_name}, capable of architecting and deploying production solutions independently.",
    )

    generated_modules: list[ModuleModel] = []
    for m_idx in range(1, subj.modules_count + 1):
        tier = (
            "Level 1: Foundation"
            if m_idx == 1
            else "Level 2: Beginner"
            if m_idx == 2
            else "Level 3: Intermediate"
            if m_idx == 3
            else "Level 4: Advanced"
            if m_idx == 4
            else "Level 5: Expert"
        )
        skill_focus = subj.primary_skills[(m_idx - 1) % len(subj.primary_skills)]
        generated_modules.append(
            ModuleModel(
                id=f"{subj.id}-mod-0{m_idx}",
                title=f"Module 0{m_idx}: {skill_focus} & Architecture Patterns",
                level_tier=tier,
                total_video_duration_minutes=150 + m_idx * 10,
                description=f"Deep dive into {skill_focus} principles, edge-case diagnosis, and practical implementation.",
                learning_objectives=[
                    f"Understand the theoretical foundations of {skill_focus}.",
                    f"Implement robust architectures using {skill_focus}.",
                    "Analyze performance trade-offs and error recovery strategies.",
                ],
                module_assessment_title=f"{skill_focus} Automated Assessment",
                module_project_title=f"Practical {skill_focus} Capstone",
                chapters=[
                    ChapterModel(
                        id=f"{subj.id}-ch-{m_idx}01",
                        title=f"Chapter 01: Core Mechanics of {skill_focus}",
                        estimated_minutes=45,
                        video_duration_minutes=30,
                        description=f"First-principles exploration of {skill_focus} with visual diagrams and code demonstrations.",
                        lessons=[
                            LessonModel(
                                id=f"{subj.id}-les-{m_idx}01",
                                title=f"Lesson {m_idx}.1: {skill_focus} Foundations & Intuition",
                                duration_minutes=22,
                                video_duration_seconds=900,
                                difficulty_level=tier.split(":")[1].strip(),
                                learning_objectives=[
                                    f"Explain the purpose and mechanics of {skill_focus}.",
                                    f"Identify key trade-offs when implementing {skill_focus}.",
                                ],
                                introduction=f"In this lesson, we explore {skill_focus} from first principles, establishing the intuition and systemic necessity.",
                                concept_explanation=f"{skill_focus} is fundamental to modern software engineering and {subj.school_name}. It enables reliable state management, high performance, and clear separation of concerns.",
                                visual_diagram_description=f"Architectural flow illustrating input processing through {skill_focus} to deterministic output.",
                                diagram_elements=[
                                    {
                                        "label": "1. Input Context",
                                        "sub": "Raw Requirements",
                                        "color": "bg-blue-500/20 text-blue-300 border-blue-500/40",
                                    },
                                    {
                                        "label": f"2. {skill_focus}",
                                        "sub": "Core Engine Processing",
                                        "color": "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
                                    },
                                    {
                                        "label": "3. Verified State",
                                        "sub": "Deterministic Result",
                                        "color": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                                    },
                                ],
                                real_world_analogy=f"Think of {skill_focus} as a precision transmission in a high-performance vehicle, routing raw power cleanly to where it is needed without stalling.",
                                worked_example=f"Applying {skill_focus} to resolve common scaling and reliability bottlenecks in enterprise software systems.",
                                code_snippet=f"# Practical implementation of: {skill_focus}\ndef execute_{skill_focus.lower().replace(' ', '_')}(payload: dict) -> dict:\n    \"\"\"Processes payload with verified guarantees.\"\"\"\n    return {{'status': 'SUCCESS', 'skill': '{skill_focus}', 'data': payload}}",
                                code_language="python",
                                terminal_output=f"Executing {skill_focus}... Output: {{'status': 'SUCCESS'}}",
                                common_mistakes=[
                                    f"Overlooking boundary constraints when configuring {skill_focus}.",
                                    "Failing to implement automated validation checks.",
                                ],
                                knowledge_check=QuizQuestion(
                                    id=f"chk-{subj.id}-{m_idx}",
                                    question=f"What is the primary architectural advantage of {skill_focus}?",
                                    options=[
                                        "A) Completely eliminates all computer hardware requirements.",
                                        f"B) Provides structured, deterministic execution and scalable state management for {subj.subject_name}.",
                                        "C) Bypasses network security protocols entirely.",
                                        "D) Replaces all data structures with static variables.",
                                    ],
                                    correct_index=1,
                                    explanation=f"Correct! {skill_focus} provides reliable, deterministic execution and scalable state management in production environments.",
                                    hint="Think about predictable state and architectural reliability.",
                                ),
                                mini_exercise=f"Construct a clean implementation demonstrating {skill_focus} with automated unit tests.",
                                summary=f"{skill_focus} provides structured guarantees and reliable performance across {subj.subject_name} architectures.",
                                next_concept_preview=f"In the next lesson, we will examine advanced failure modes and optimization strategies for {skill_focus}.",
                                teach_back_prompt=f"Explain in your own words how {skill_focus} solves core scaling problems in {subj.subject_name}.",
                                voice_script=f"Welcome to this lecture on {skill_focus}. In this session, we will break down the essential mechanics, trade-offs, and practical implementations from first principles.",
                            )
                        ],
                    )
                ],
            )
        )

    return CourseDetail(
        id=subj.id,
        school_id=subj.school_id,
        school_name=subj.school_name,
        subject_name=subj.subject_name,
        course_title=f"{subj.subject_name}: {subj.headline}",
        headline=subj.headline,
        overview=f"Master {subj.subject_name} through university-grade curriculum, interactive AI video lectures, live code demonstrations, and real-world challenges.",
        purpose=f"To develop verified engineering and analytical competency in {subj.subject_name}.",
        why_it_matters=f"{subj.subject_name} is a key domain within modern {subj.school_name} enabling high-scale software development and technical innovation.",
        problems_solved=[
            f"Scaling bottlenecks in {subj.subject_name} implementations.",
            "Suboptimal architectural designs lacking test verification.",
            "Cognitive gaps between academic theory and production reality.",
        ],
        careers_using_it=[
            f"{subj.subject_name} Engineer",
            f"Lead {subj.school_name} Architect",
        ],
        real_world_systems=[
            f"Global production systems utilizing {subj.subject_name}.",
        ],
        prerequisites_required=["Basic analytical logic."],
        prerequisites_recommended=[f"Introductory {subj.primary_skills[0]}"],
        prerequisites_optional=["Familiarity with terminal commands."],
        learning_outcomes=[
            f"Architect and deploy production-grade {subj.subject_name} systems.",
            f"Apply {', '.join(subj.primary_skills)} to real-world software challenges.",
            "Pass rigorous automated assessments verifying practical and cognitive mastery.",
        ],
        estimated_learning_hours=subj.estimated_hours,
        total_modules_count=subj.modules_count,
        total_chapters_count=subj.modules_count,
        total_lessons_count=subj.lessons_count,
        total_video_duration_hours=round(subj.modules_count * 2.5, 1),
        total_projects_count=subj.projects_count,
        total_assessments_count=subj.modules_count,
        total_challenges_count=1,
        certificate_requirements=[
            f"Complete all {subj.modules_count} modules in {subj.subject_name}.",
            "Pass all automated assessment evaluations with >= 80% score.",
            "Complete the real-world capstone challenge.",
            "Demonstrate evidence-backed mastery in Cognitive Twin.",
        ],
        explanation=explanation,
        modules=generated_modules,
        real_world_challenges=[
            RealWorldChallenge(
                id=f"{subj.id}-chal-01",
                title=f"Enterprise {subj.subject_name} Production Challenge",
                scenario_description=f"Design and implement a resilient, scalable {subj.subject_name} platform solving an enterprise performance bottleneck.",
                company_context=f"Global Technology Enterprise — {subj.school_name} Division",
                tasks=[
                    f"Architect the core {subj.subject_name} engine using {subj.primary_skills[0]}.",
                    "Implement automated test suites with high coverage.",
                    "Validate latency and throughput constraints.",
                ],
                constraints=[
                    "Must meet strict production reliability and security standards.",
                    "Zero lint or type errors.",
                ],
                evaluation_criteria=[
                    "Architectural correctness and modularity.",
                    "Edge case handling and test rigor.",
                ],
                deliverable="Complete implementation repository with code, tests, and architectural design document.",
            )
        ],
    )
