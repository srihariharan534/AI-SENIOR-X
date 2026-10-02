"""AI-SENIOR-X Curriculum Graph and Topological Traversal Engine."""

from collections import defaultdict, deque
from typing import Any

from pydantic import BaseModel, Field


class TopicNode(BaseModel):
    """Represents an atomic topic node in the curriculum knowledge graph."""

    id: str
    name: str
    subject: str
    description: str
    difficulty: str = "intermediate"  # beginner, intermediate, advanced
    pillar: str = "Computer Science"
    prerequisites: list[str] = Field(
        default_factory=list, description="IDs of prerequisite topic nodes"
    )
    learning_objectives: list[str] = Field(default_factory=list)
    estimated_duration_minutes: int = 30
    concepts: list[str] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


# Canonical 4-Pillar, 22-Domain Curriculum Hierarchy
CURRICULUM_TAXONOMY: dict[str, list[str]] = {
    "Computer Science": [
        "Python",
        "DSA",
        "Software Engineering",
        "Databases",
        "Web Development",
        "System Design",
    ],
    "AI & Data": [
        "AI & Machine Learning",
        "Deep Learning",
        "Generative AI",
        "Data Science",
        "Data Analytics",
        "Mathematics",
        "Statistics",
    ],
    "Cloud & Infrastructure": [
        "Cloud",
        "DevOps",
        "MLOps",
        "Cybersecurity",
    ],
    "Career & Innovation": [
        "Communication",
        "Interview Preparation",
        "Entrepreneurship",
        "Product Management",
        "UI/UX",
    ],
}


class CurriculumGraph:
    """Directed Acyclic Graph (DAG) representation of educational curriculum."""

    def __init__(self):
        self._nodes: dict[str, TopicNode] = {}
        self._adj: dict[str, list[str]] = defaultdict(list)  # u -> list of downstream dependents
        self._rev_adj: dict[str, list[str]] = defaultdict(
            list
        )  # v -> list of upstream prerequisites

    def add_node(self, node: TopicNode) -> None:
        """Add a node and build graph adjacency lists."""
        self._nodes[node.id] = node
        for prereq_id in node.prerequisites:
            self._adj[prereq_id].append(node.id)
            self._rev_adj[node.id].append(prereq_id)

    def get_node(self, topic_id: str) -> TopicNode | None:
        """Retrieve node by ID."""
        return self._nodes.get(topic_id)

    def list_nodes(self, pillar: str | None = None, subject: str | None = None) -> list[TopicNode]:
        """List all nodes, optionally filtered by pillar and/or subject."""
        nodes = list(self._nodes.values())
        if pillar:
            nodes = [n for n in nodes if n.pillar.lower() == pillar.lower()]
        if subject:
            nodes = [n for n in nodes if n.subject.lower() == subject.lower()]
        return nodes

    def get_pillars(self) -> list[str]:
        """Return list of all distinct curriculum pillars."""
        return list(CURRICULUM_TAXONOMY.keys())

    def get_subjects_by_pillar(self, pillar: str) -> list[str]:
        """Return subjects belonging to a specific pillar."""
        for p, subjects in CURRICULUM_TAXONOMY.items():
            if p.lower() == pillar.lower():
                return subjects
        return []

    def get_taxonomy(self) -> dict[str, list[str]]:
        """Return canonical hierarchy of pillars and subjects."""
        return CURRICULUM_TAXONOMY

    def get_prerequisites(self, topic_id: str, recursive: bool = False) -> list[TopicNode]:
        """Retrieve direct or transitive prerequisites for a topic node."""
        if not recursive:
            prereq_ids = self._rev_adj.get(topic_id, [])
            return [self._nodes[pid] for pid in prereq_ids if pid in self._nodes]

        visited: set[str] = set()
        queue = deque(self._rev_adj.get(topic_id, []))
        result: list[TopicNode] = []

        while queue:
            curr_id = queue.popleft()
            if curr_id not in visited and curr_id in self._nodes:
                visited.add(curr_id)
                result.append(self._nodes[curr_id])
                for parent_id in self._rev_adj.get(curr_id, []):
                    if parent_id not in visited:
                        queue.append(parent_id)

        return result

    def get_dependents(self, topic_id: str) -> list[TopicNode]:
        """Retrieve topics that directly depend on the specified topic."""
        dependent_ids = self._adj.get(topic_id, [])
        return [self._nodes[did] for did in dependent_ids if did in self._nodes]

    def topological_sort(
        self, pillar: str | None = None, subject: str | None = None
    ) -> list[TopicNode]:
        """Return a topologically sorted list of topics ensuring prerequisites precede dependents."""
        nodes = self.list_nodes(pillar=pillar, subject=subject)
        node_ids = {n.id for n in nodes}

        in_degree: dict[str, int] = dict.fromkeys(node_ids, 0)
        for nid in node_ids:
            for parent in self._rev_adj.get(nid, []):
                if parent in node_ids:
                    in_degree[nid] += 1

        queue = deque([nid for nid, deg in in_degree.items() if deg == 0])
        sorted_nodes: list[TopicNode] = []

        while queue:
            curr = queue.popleft()
            if curr in self._nodes:
                sorted_nodes.append(self._nodes[curr])
            for child in self._adj.get(curr, []):
                if child in in_degree:
                    in_degree[child] -= 1
                    if in_degree[child] == 0:
                        queue.append(child)

        return sorted_nodes

    def find_missing_prerequisites(
        self, topic_id: str, mastered_topic_ids: set[str]
    ) -> list[TopicNode]:
        """Find which prerequisites the learner has not yet mastered for a target topic."""
        all_prereqs = self.get_prerequisites(topic_id, recursive=True)
        missing = [p for p in all_prereqs if p.id not in mastered_topic_ids]
        return missing

    def get_recommended_next_topics(
        self,
        mastered_topic_ids: set[str],
        pillar: str | None = None,
        subject: str | None = None,
    ) -> list[TopicNode]:
        """Find unlocked topics whose prerequisites are fully satisfied by the learner."""
        nodes = self.list_nodes(pillar=pillar, subject=subject)
        unlocked: list[TopicNode] = []

        for node in nodes:
            if node.id in mastered_topic_ids:
                continue
            prereqs = set(node.prerequisites)
            if prereqs.issubset(mastered_topic_ids):
                unlocked.append(node)

        return unlocked


# Singleton Curriculum Registry populated with structured default curriculum
curriculum_graph = CurriculumGraph()


def initialize_default_curriculum(graph: CurriculumGraph) -> None:
    """Populate curriculum graph with comprehensive seed knowledge across all 4 pillars and 22 domains."""
    seed_nodes = [
        # =========================================================================
        # 1. COMPUTER SCIENCE
        # =========================================================================
        # --- Python ---
        TopicNode(
            id="py_basics",
            name="Python Basics & Control Flow",
            pillar="Computer Science",
            subject="Python",
            description="Core syntax, loops, conditionals, basic data structures, and functions.",
            difficulty="beginner",
            prerequisites=[],
            learning_objectives=[
                "Understand variables, data types, and scope",
                "Write loops and branching logic cleanly",
                "Define modular functions with typed annotations",
            ],
            estimated_duration_minutes=40,
            concepts=["variables", "loops", "functions", "control_flow", "type_hints"],
            skills=["python_syntax", "control_structures", "procedural_programming"],
        ),
        TopicNode(
            id="py_oop",
            name="Object-Oriented Python",
            pillar="Computer Science",
            subject="Python",
            description="Classes, inheritance, polymorphism, encapsulation, and magic methods.",
            difficulty="intermediate",
            prerequisites=["py_basics"],
            learning_objectives=[
                "Implement robust classes and inheritance hierarchies",
                "Utilize dunder methods and operator overloading",
                "Apply dataclasses and encapsulation patterns",
            ],
            estimated_duration_minutes=45,
            concepts=["classes", "inheritance", "dunder_methods", "polymorphism", "dataclasses"],
            skills=["oop_design", "python_classes", "object_modeling"],
        ),
        TopicNode(
            id="py_async",
            name="AsyncIO & Concurrency",
            pillar="Computer Science",
            subject="Python",
            description="Event loops, coroutines, async/await paradigms, tasks, and gather.",
            difficulty="advanced",
            prerequisites=["py_basics"],
            learning_objectives=[
                "Design non-blocking asynchronous I/O workflows",
                "Manage concurrency, task cancellation, and semaphores",
                "Debug async event loops and race conditions",
            ],
            estimated_duration_minutes=60,
            concepts=["event_loop", "coroutines", "async_await", "concurrency", "tasks"],
            skills=["asyncio", "concurrent_programming", "async_architecture"],
        ),
        TopicNode(
            id="py_advanced_patterns",
            name="Advanced Python: Metaclasses & Generators",
            pillar="Computer Science",
            subject="Python",
            description="Decorators, generators, context managers, metaclasses, and memory optimization.",
            difficulty="advanced",
            prerequisites=["py_oop"],
            learning_objectives=[
                "Create parameterized decorators and context managers",
                "Stream large data pipelines using memory-efficient generators",
            ],
            estimated_duration_minutes=55,
            concepts=[
                "decorators",
                "generators",
                "context_managers",
                "metaclasses",
                "memory_profiling",
            ],
            skills=["python_internals", "generator_pipelines", "decorator_patterns"],
        ),
        # --- DSA ---
        TopicNode(
            id="dsa_arrays_hashing",
            name="Arrays, Strings & Hash Tables",
            pillar="Computer Science",
            subject="DSA",
            description="Two pointers, sliding window, prefix sums, and hash table collision resolution.",
            difficulty="beginner",
            prerequisites=["py_basics"],
            learning_objectives=[
                "Solve search and substring problems in O(N) time",
                "Implement hash maps and set-based lookups",
            ],
            estimated_duration_minutes=50,
            concepts=["two_pointers", "sliding_window", "hash_tables", "time_complexity"],
            skills=["array_algorithms", "hash_map_optimization", "time_space_analysis"],
        ),
        TopicNode(
            id="dsa_graphs_trees",
            name="Trees, Graphs & Search Algorithms",
            pillar="Computer Science",
            subject="DSA",
            description="Binary Search Trees, BFS, DFS, Dijkstra shortest path, and topological sort.",
            difficulty="intermediate",
            prerequisites=["dsa_arrays_hashing"],
            learning_objectives=[
                "Implement recursive and iterative tree/graph traversals",
                "Solve shortest path problems on weighted graphs",
            ],
            estimated_duration_minutes=60,
            concepts=["binary_search_trees", "bfs_dfs", "dijkstra", "topological_sort", "graphs"],
            skills=["graph_algorithms", "tree_traversal", "shortest_path_routing"],
        ),
        TopicNode(
            id="dsa_dp_greedy",
            name="Dynamic Programming & Greedy Strategies",
            pillar="Computer Science",
            subject="DSA",
            description="Memoization, tabulation, state transitions, knapsack, and interval scheduling.",
            difficulty="advanced",
            prerequisites=["dsa_graphs_trees"],
            learning_objectives=[
                "Formulate optimal substructure and overlapping subproblems",
                "Convert top-down recursive solutions to bottom-up DP tables",
            ],
            estimated_duration_minutes=75,
            concepts=[
                "memoization",
                "tabulation",
                "knapsack",
                "greedy_heuristics",
                "state_machine_dp",
            ],
            skills=["dynamic_programming", "greedy_optimization", "complexity_reduction"],
        ),
        # --- Software Engineering ---
        TopicNode(
            id="se_clean_code_solid",
            name="Clean Code & SOLID Architecture",
            pillar="Computer Science",
            subject="Software Engineering",
            description="Single responsibility, Open-Closed, Liskov substitution, Interface segregation, and Dependency inversion.",
            difficulty="intermediate",
            prerequisites=["py_oop"],
            learning_objectives=[
                "Refactor monolithic spaghetti into decoupled modules",
                "Apply dependency injection and clean abstraction boundaries",
            ],
            estimated_duration_minutes=50,
            concepts=["solid_principles", "clean_code", "dependency_injection", "refactoring"],
            skills=["modular_software_design", "clean_architecture", "code_refactoring"],
        ),
        TopicNode(
            id="se_testing_tdd",
            name="Test-Driven Development & Automation",
            pillar="Computer Science",
            subject="Software Engineering",
            description="Unit testing, mocking, integration testing, property-based tests, and CI test matrices.",
            difficulty="intermediate",
            prerequisites=["se_clean_code_solid"],
            learning_objectives=[
                "Write test suites using pytest and test fixtures",
                "Execute red-green-refactor TDD cycles",
            ],
            estimated_duration_minutes=45,
            concepts=["unit_testing", "tdd", "mocking", "fixtures", "integration_testing"],
            skills=["test_automation", "tdd_workflow", "qa_engineering"],
        ),
        TopicNode(
            id="se_design_patterns",
            name="Enterprise Design Patterns",
            pillar="Computer Science",
            subject="Software Engineering",
            description="Factory, Singleton, Adapter, Observer, Strategy, and Repository patterns in production code.",
            difficulty="advanced",
            prerequisites=["se_clean_code_solid"],
            learning_objectives=[
                "Implement behavioral, structural, and creational design patterns",
                "Select optimal patterns for maintainable enterprise systems",
            ],
            estimated_duration_minutes=60,
            concepts=[
                "factory_pattern",
                "strategy_pattern",
                "observer_pattern",
                "repository_pattern",
            ],
            skills=["design_patterns", "enterprise_architecture", "code_extensibility"],
        ),
        # --- Databases ---
        TopicNode(
            id="sql_fundamentals",
            name="Relational SQL & Database Queries",
            pillar="Computer Science",
            subject="Databases",
            description="SELECT, JOINs, aggregations, window functions, indexing, and transaction isolation.",
            difficulty="beginner",
            prerequisites=[],
            learning_objectives=[
                "Write complex multi-table JOINs and grouping queries",
                "Utilize analytical window functions (RANK, ROW_NUMBER)",
            ],
            estimated_duration_minutes=45,
            concepts=[
                "select_queries",
                "joins",
                "window_functions",
                "aggregations",
                "transactions",
            ],
            skills=["sql_querying", "relational_modeling", "database_design"],
        ),
        TopicNode(
            id="db_indexing_optimization",
            name="Query Optimization, B-Trees & Indexing",
            pillar="Computer Science",
            subject="Databases",
            description="B-Tree indexes, EXPLAIN ANALYZE, composite indexes, query planner dynamics, and connection pooling.",
            difficulty="intermediate",
            prerequisites=["sql_fundamentals"],
            learning_objectives=[
                "Inspect execution plans and eliminate sequential table scans",
                "Design optimal composite indexes for high-concurrency workloads",
            ],
            estimated_duration_minutes=55,
            concepts=["b_trees", "explain_analyze", "composite_indexes", "connection_pooling"],
            skills=["sql_performance_tuning", "index_optimization", "query_planning"],
        ),
        TopicNode(
            id="db_nosql_distributed",
            name="NoSQL & Distributed Data Stores",
            pillar="Computer Science",
            subject="Databases",
            description="Document stores (MongoDB), key-value caches (Redis), vector databases (Qdrant), and CAP theorem.",
            difficulty="advanced",
            prerequisites=["sql_fundamentals"],
            learning_objectives=[
                "Choose between SQL and NoSQL for specific consistency requirements",
                "Implement caching and vector search retrieval architectures",
            ],
            estimated_duration_minutes=60,
            concepts=[
                "nosql",
                "redis_caching",
                "vector_databases",
                "cap_theorem",
                "eventual_consistency",
            ],
            skills=["nosql_architecture", "vector_db_integration", "distributed_caching"],
        ),
        # --- Web Development ---
        TopicNode(
            id="web_fastapi_nextjs",
            name="Full-Stack Web Architecture (FastAPI + Next.js)",
            pillar="Computer Science",
            subject="Web Development",
            description="RESTful API design, JWT authentication, async dependencies, and React Server Components.",
            difficulty="intermediate",
            prerequisites=["py_basics"],
            learning_objectives=[
                "Build authenticated full-stack web applications",
                "Implement typed schemas and API clients with Pydantic & TypeScript",
            ],
            estimated_duration_minutes=60,
            concepts=["fastapi", "nextjs", "jwt_auth", "rest_api", "react_components"],
            skills=["fastapi_development", "nextjs_react", "fullstack_engineering"],
        ),
        TopicNode(
            id="web_security_auth",
            name="Web Security, OAuth2 & CORS Architecture",
            pillar="Computer Science",
            subject="Web Development",
            description="OWASP security guidelines, CSRF/XSS prevention, OAuth2 flows, rate limiting, and HTTP headers.",
            difficulty="advanced",
            prerequisites=["web_fastapi_nextjs"],
            learning_objectives=[
                "Secure web endpoints against injection and CSRF vulnerabilities",
                "Implement zero-trust token refresh and session handling",
            ],
            estimated_duration_minutes=50,
            concepts=["oauth2", "csrf_xss_protection", "rate_limiting", "cors", "secure_cookies"],
            skills=["web_security", "auth_architecture", "api_protection"],
        ),
        # --- System Design ---
        TopicNode(
            id="sd_scalability_caching",
            name="Scalability, Caching & Load Balancing",
            pillar="Computer Science",
            subject="System Design",
            description="Horizontal scaling, reverse proxies (Nginx), CDN caching, and read-replica replication.",
            difficulty="intermediate",
            prerequisites=["web_fastapi_nextjs", "sql_fundamentals"],
            learning_objectives=[
                "Design systems that scale from 1K to 10M active requests",
                "Implement multi-tier cache invalidation strategies",
            ],
            estimated_duration_minutes=65,
            concepts=[
                "load_balancing",
                "cdn_caching",
                "database_replication",
                "horizontal_scaling",
            ],
            skills=["system_scalability", "caching_strategies", "load_balancer_configuration"],
        ),
        TopicNode(
            id="sd_microservices_messaging",
            name="Microservices & Event-Driven Architecture",
            pillar="Computer Science",
            subject="System Design",
            description="Message queues (Kafka, RabbitMQ), idempotency, saga orchestration, and API gateways.",
            difficulty="advanced",
            prerequisites=["sd_scalability_caching"],
            learning_objectives=[
                "Decouple monolithic backends into resilient asynchronous microservices",
                "Design exactly-once and at-least-once message processing workflows",
            ],
            estimated_duration_minutes=75,
            concepts=[
                "message_queues",
                "kafka",
                "saga_pattern",
                "event_driven_architecture",
                "api_gateway",
            ],
            skills=["microservices_design", "event_stream_processing", "distributed_orchestration"],
        ),
        # =========================================================================
        # 2. AI & DATA
        # =========================================================================
        # --- AI & Machine Learning ---
        TopicNode(
            id="ml_supervised",
            name="Supervised Learning Foundations",
            pillar="AI & Data",
            subject="AI & Machine Learning",
            description="Linear regression, logistic regression, decision trees, bias-variance tradeoff, evaluation metrics.",
            difficulty="intermediate",
            prerequisites=["py_basics", "math_linear_algebra", "math_calculus"],
            learning_objectives=[
                "Train regression and classification models with scikit-learn",
                "Evaluate precision, recall, F1, ROC-AUC, and cross-validation",
            ],
            estimated_duration_minutes=60,
            concepts=[
                "linear_regression",
                "logistic_regression",
                "bias_variance",
                "decision_trees",
                "cross_validation",
            ],
            skills=["scikit_learn", "model_evaluation", "supervised_modeling"],
        ),
        TopicNode(
            id="ml_unsupervised",
            name="Unsupervised Learning & Clustering",
            pillar="AI & Data",
            subject="AI & Machine Learning",
            description="K-Means clustering, PCA dimensionality reduction, t-SNE, anomaly detection, and Gaussian Mixture Models.",
            difficulty="intermediate",
            prerequisites=["ml_supervised"],
            learning_objectives=[
                "Extract latent feature representations using PCA",
                "Segment unlabelled multidimensional datasets",
            ],
            estimated_duration_minutes=55,
            concepts=["k_means", "pca", "dimensionality_reduction", "anomaly_detection"],
            skills=["unsupervised_clustering", "feature_reduction", "anomaly_modeling"],
        ),
        # --- Deep Learning ---
        TopicNode(
            id="ml_deep_learning",
            name="Deep Neural Networks & PyTorch",
            pillar="AI & Data",
            subject="Deep Learning",
            description="Multi-layer perceptrons, backpropagation, activation functions, loss functions, PyTorch.",
            difficulty="advanced",
            prerequisites=["ml_supervised"],
            learning_objectives=[
                "Construct deep neural architectures in PyTorch",
                "Debug gradient vanishing/exploding and loss convergence dynamics",
            ],
            estimated_duration_minutes=75,
            concepts=[
                "neural_networks",
                "backpropagation",
                "activations",
                "pytorch",
                "gradient_dynamics",
            ],
            skills=["pytorch_modeling", "deep_learning_training", "neural_architecture_design"],
        ),
        TopicNode(
            id="dl_transformers_nlp",
            name="Transformers, Attention & Vision Backbones",
            pillar="AI & Data",
            subject="Deep Learning",
            description="Self-attention, Multi-Head Attention, BERT, Vision Transformers (ViT), and positional encodings.",
            difficulty="advanced",
            prerequisites=["ml_deep_learning"],
            learning_objectives=[
                "Implement scaled dot-product self-attention from scratch",
                "Fine-tune pre-trained Transformer models for downstream NLP tasks",
            ],
            estimated_duration_minutes=80,
            concepts=[
                "self_attention",
                "transformers",
                "multi_head_attention",
                "positional_encoding",
                "vit",
            ],
            skills=["transformer_architectures", "attention_mechanisms", "nlp_engineering"],
        ),
        # --- Generative AI ---
        TopicNode(
            id="genai_llm_fundamentals",
            name="Large Language Models & Prompt Engineering",
            pillar="AI & Data",
            subject="Generative AI",
            description="Tokenization, autoregressive sampling, context windows, few-shot prompt patterns, and structured outputs.",
            difficulty="intermediate",
            prerequisites=["py_basics"],
            learning_objectives=[
                "Master system prompt engineering and structured JSON elicitation",
                "Understand token budget management and context window mechanics",
            ],
            estimated_duration_minutes=50,
            concepts=[
                "prompt_engineering",
                "tokenization",
                "context_window",
                "few_shot_prompting",
                "structured_generation",
            ],
            skills=["prompt_architecture", "llm_integration", "structured_prompting"],
        ),
        TopicNode(
            id="ml_rag_agents",
            name="RAG & Multi-Agent AI Architectures",
            pillar="AI & Data",
            subject="Generative AI",
            description="Vector embeddings, hybrid retrieval, cross-reranking, autonomous agent loops, tool use.",
            difficulty="advanced",
            prerequisites=["genai_llm_fundamentals", "py_async"],
            learning_objectives=[
                "Design production retrieval-augmented generation systems",
                "Build autonomous multi-agent coordination pipelines with tool calling",
            ],
            estimated_duration_minutes=90,
            concepts=["rag", "vector_embeddings", "agent_loops", "tool_calling", "hybrid_search"],
            skills=["rag_engineering", "multi_agent_systems", "autonomous_ai_design"],
        ),
        # --- Data Science ---
        TopicNode(
            id="ds_numpy_pandas",
            name="Data Manipulation with NumPy and Pandas",
            pillar="AI & Data",
            subject="Data Science",
            description="Array vectorization, DataFrames, groupbys, merges, and data cleaning pipelines.",
            difficulty="beginner",
            prerequisites=["py_basics"],
            learning_objectives=[
                "Perform high-speed vectorized operations on numerical tensors",
                "Clean, reshape, and aggregate multi-indexed tabular datasets",
            ],
            estimated_duration_minutes=50,
            concepts=["vectorization", "dataframes", "aggregation", "cleaning", "pandas_pipes"],
            skills=["pandas_data_wrangling", "numpy_arrays", "data_transformation"],
        ),
        TopicNode(
            id="ds_eda_visualization",
            name="Exploratory Data Analysis & Statistical Viz",
            pillar="AI & Data",
            subject="Data Science",
            description="Distribution plots, correlation heatmaps, feature relationships, outlier handling with Seaborn & Plotly.",
            difficulty="intermediate",
            prerequisites=["ds_numpy_pandas"],
            learning_objectives=[
                "Conduct rigorous exploratory data analysis to uncover hidden correlations",
                "Create interactive diagnostic charts with Plotly and Seaborn",
            ],
            estimated_duration_minutes=50,
            concepts=["eda", "correlation_matrices", "outlier_detection", "data_visualization"],
            skills=["exploratory_data_analysis", "statistical_visualization", "data_storytelling"],
        ),
        # --- Data Analytics ---
        TopicNode(
            id="da_business_metrics_kpis",
            name="Business Analytics & KPI Modeling",
            pillar="AI & Data",
            subject="Data Analytics",
            description="Customer lifetime value (LTV), cohort retention analysis, churn prediction metrics, and funnel analytics.",
            difficulty="beginner",
            prerequisites=[],
            learning_objectives=[
                "Model customer acquisition cost (CAC), LTV, and retention cohorts",
                "Design actionable executive reporting dashboards",
            ],
            estimated_duration_minutes=45,
            concepts=["kpi_frameworks", "cohort_analysis", "funnel_metrics", "ltv_cac"],
            skills=["business_analytics", "cohort_retention", "metric_modeling"],
        ),
        TopicNode(
            id="da_ab_testing",
            name="A/B Testing & Causal Experimentation",
            pillar="AI & Data",
            subject="Data Analytics",
            description="Sample size determination, statistical power, p-values, hypothesis verification, and variance reduction.",
            difficulty="advanced",
            prerequisites=["da_business_metrics_kpis", "stats_foundations"],
            learning_objectives=[
                "Design statistically sound randomized control trials and A/B tests",
                "Compute confidence intervals and avoid false-positive p-hacking",
            ],
            estimated_duration_minutes=60,
            concepts=[
                "ab_testing",
                "statistical_power",
                "sample_sizing",
                "cuped_variance_reduction",
            ],
            skills=["experimentation_design", "statistical_ab_testing", "causal_inference"],
        ),
        # --- Mathematics ---
        TopicNode(
            id="math_linear_algebra",
            name="Linear Algebra for Machine Learning",
            pillar="AI & Data",
            subject="Mathematics",
            description="Vectors, matrices, matrix multiplication, eigenvalues, eigenvectors, and projections.",
            difficulty="intermediate",
            prerequisites=[],
            learning_objectives=[
                "Master matrix operations, determinants, and matrix inversions",
                "Understand vector spaces, basis transformations, and SVD",
            ],
            estimated_duration_minutes=50,
            concepts=["matrices", "vectors", "eigenvectors", "dot_product", "svd"],
            skills=["matrix_algebra", "vector_spaces", "linear_transformations"],
        ),
        TopicNode(
            id="math_calculus",
            name="Multivariate Calculus & Optimization",
            pillar="AI & Data",
            subject="Mathematics",
            description="Partial derivatives, gradients, Jacobians, Hessians, and gradient descent.",
            difficulty="intermediate",
            prerequisites=[],
            learning_objectives=[
                "Compute gradients, Jacobians, and Hessians",
                "Analyze loss surfaces and convergence properties of gradient descent",
            ],
            estimated_duration_minutes=50,
            concepts=["partial_derivatives", "gradients", "optimization", "chain_rule", "hessians"],
            skills=["gradient_computation", "calculus_optimization", "mathematical_modeling"],
        ),
        # --- Statistics ---
        TopicNode(
            id="stats_foundations",
            name="Probability & Inferential Statistics",
            pillar="AI & Data",
            subject="Statistics",
            description="Probability distributions, Bayes' Theorem, hypothesis testing, and p-values.",
            difficulty="intermediate",
            prerequisites=[],
            learning_objectives=[
                "Compute conditional probabilities and posterior updates via Bayes' Theorem",
                "Perform two-sample t-tests and chi-squared tests",
            ],
            estimated_duration_minutes=45,
            concepts=[
                "bayes_theorem",
                "probability_distributions",
                "hypothesis_testing",
                "p_values",
            ],
            skills=["statistical_inference", "probability_modeling", "hypothesis_testing"],
        ),
        TopicNode(
            id="stats_bayesian",
            name="Bayesian Inference & Probabilistic Modeling",
            pillar="AI & Data",
            subject="Statistics",
            description="Prior and posterior distributions, MCMC sampling, PyMC probabilistic programming, and credible intervals.",
            difficulty="advanced",
            prerequisites=["stats_foundations"],
            learning_objectives=[
                "Construct generative Bayesian models for uncertainty estimation",
                "Run Markov Chain Monte Carlo (MCMC) simulations",
            ],
            estimated_duration_minutes=60,
            concepts=[
                "bayesian_inference",
                "mcmc_sampling",
                "priors_posteriors",
                "probabilistic_programming",
            ],
            skills=["bayesian_modeling", "uncertainty_quantification", "mcmc_estimation"],
        ),
        # =========================================================================
        # 3. CLOUD & INFRASTRUCTURE
        # =========================================================================
        # --- Cloud ---
        TopicNode(
            id="cloud_foundations_aws_gcp",
            name="Cloud Architecture & Core Services",
            pillar="Cloud & Infrastructure",
            subject="Cloud",
            description="Compute (EC2/GCE), storage (S3/GCS), IAM identity, VPC networking, and cloud security boundaries.",
            difficulty="beginner",
            prerequisites=[],
            learning_objectives=[
                "Configure cloud compute, object storage, and IAM role policies",
                "Design isolated VPC subnets and security group ingress rules",
            ],
            estimated_duration_minutes=50,
            concepts=["iam", "vpc_networking", "object_storage", "cloud_compute", "cloud_security"],
            skills=["cloud_architecture", "aws_gcp_administration", "iam_policy_configuration"],
        ),
        TopicNode(
            id="cloud_containerization",
            name="Cloud Infrastructure & Containerization",
            pillar="Cloud & Infrastructure",
            subject="Cloud",
            description="Docker containers, multi-stage builds, orchestration with Docker Compose, and cloud registries.",
            difficulty="intermediate",
            prerequisites=[],
            learning_objectives=[
                "Build secure, minimal multi-stage Docker container images",
                "Orchestrate multi-service environments with Compose and health checks",
            ],
            estimated_duration_minutes=45,
            concepts=["docker", "compose", "multi_stage_builds", "container_registries"],
            skills=["containerization", "docker_engineering", "cloud_native_packaging"],
        ),
        # --- DevOps ---
        TopicNode(
            id="devops_ci_cd_automation",
            name="CI/CD Automation & GitHub Actions",
            pillar="Cloud & Infrastructure",
            subject="DevOps",
            description="Continuous integration pipelines, automated testing, semantic versioning, and zero-downtime deployment.",
            difficulty="intermediate",
            prerequisites=["cloud_containerization"],
            learning_objectives=[
                "Write automated GitHub Actions pipelines with caching and matrix builds",
                "Implement blue-green and rolling deployment automation",
            ],
            estimated_duration_minutes=50,
            concepts=["github_actions", "ci_cd", "automated_testing", "blue_green_deployment"],
            skills=["ci_cd_engineering", "pipeline_automation", "release_engineering"],
        ),
        TopicNode(
            id="devops_iac_terraform",
            name="Infrastructure as Code (Terraform) & Observability",
            pillar="Cloud & Infrastructure",
            subject="DevOps",
            description="Declarative cloud provisioning with Terraform, state management, Prometheus metrics, and Grafana dashboards.",
            difficulty="advanced",
            prerequisites=["devops_ci_cd_automation", "cloud_foundations_aws_gcp"],
            learning_objectives=[
                "Provision complete cloud infrastructure declaratively using Terraform",
                "Set up Prometheus metrics scrapers and Grafana anomaly alerts",
            ],
            estimated_duration_minutes=65,
            concepts=["terraform", "iac", "prometheus", "grafana", "observability"],
            skills=["infrastructure_as_code", "cloud_monitoring", "terraform_provisioning"],
        ),
        # --- MLOps ---
        TopicNode(
            id="mlops_model_tracking",
            name="MLflow Experiment Tracking & Model Registry",
            pillar="Cloud & Infrastructure",
            subject="MLOps",
            description="Artifact tracking, metric logging, model lineage, hyperparameter sweeps, and staging promotion.",
            difficulty="intermediate",
            prerequisites=["ml_supervised", "cloud_containerization"],
            learning_objectives=[
                "Track training parameters, metrics, and models with MLflow",
                "Manage production model registries with automated versioning",
            ],
            estimated_duration_minutes=55,
            concepts=["mlflow", "model_registry", "experiment_tracking", "model_lineage"],
            skills=["mlflow_tracking", "ml_model_governance", "experiment_management"],
        ),
        TopicNode(
            id="mlops_serving_drift",
            name="ML Serving, Feature Stores & Drift Monitoring",
            pillar="Cloud & Infrastructure",
            subject="MLOps",
            description="High-throughput model serving (Triton/FastAPI), feature stores (Feast), and data drift detection (Evidently).",
            difficulty="advanced",
            prerequisites=["mlops_model_tracking"],
            learning_objectives=[
                "Deploy low-latency model inference endpoints with batched inference",
                "Detect covariate shift and data drift in real-time streaming pipelines",
            ],
            estimated_duration_minutes=70,
            concepts=[
                "model_serving",
                "feature_stores",
                "data_drift",
                "covariate_shift",
                "triton_inference",
            ],
            skills=["ml_serving", "drift_detection", "production_mlops"],
        ),
        # --- Cybersecurity ---
        TopicNode(
            id="sec_appsec_owasp",
            name="Application Security & OWASP Top 10",
            pillar="Cloud & Infrastructure",
            subject="Cybersecurity",
            description="SQL injection, XSS, CSRF, broken access control, server-side request forgery (SSRF), and secure coding.",
            difficulty="intermediate",
            prerequisites=["web_fastapi_nextjs"],
            learning_objectives=[
                "Audit codebases for OWASP Top 10 security vulnerabilities",
                "Implement secure input sanitization and cryptographic token validation",
            ],
            estimated_duration_minutes=55,
            concepts=["owasp_top_10", "sql_injection", "xss_csrf", "ssrf", "secure_coding"],
            skills=["application_security", "vulnerability_assessment", "security_auditing"],
        ),
        TopicNode(
            id="sec_cryptography_pki",
            name="Applied Cryptography & Zero Trust Defense",
            pillar="Cloud & Infrastructure",
            subject="Cybersecurity",
            description="Symmetric/asymmetric encryption (AES, RSA, ECC), hashing (SHA-256), PKI certificates, and zero-trust policies.",
            difficulty="advanced",
            prerequisites=["sec_appsec_owasp"],
            learning_objectives=[
                "Implement end-to-end payload encryption and digital signature verification",
                "Enforce mutual TLS (mTLS) and least-privilege zero-trust access control",
            ],
            estimated_duration_minutes=65,
            concepts=["cryptography", "aes_rsa", "pki_certificates", "mtls", "zero_trust"],
            skills=["applied_cryptography", "pki_management", "zero_trust_architecture"],
        ),
        # =========================================================================
        # 4. CAREER & INNOVATION
        # =========================================================================
        # --- Communication ---
        TopicNode(
            id="comm_technical_writing",
            name="Technical Writing, RFCs & Engineering Docs",
            pillar="Career & Innovation",
            subject="Communication",
            description="RFC writing, architectural decision records (ADRs), API documentation, and asynchronous team communication.",
            difficulty="beginner",
            prerequisites=[],
            learning_objectives=[
                "Author concise Request for Comments (RFC) engineering proposals",
                "Write crystal-clear API specifications and developer tutorials",
            ],
            estimated_duration_minutes=40,
            concepts=[
                "rfc_proposals",
                "adr_records",
                "api_documentation",
                "engineering_communication",
            ],
            skills=["technical_writing", "architectural_documentation", "async_communication"],
        ),
        TopicNode(
            id="comm_stakeholder_leadership",
            name="Executive Stakeholder Influence & Technical Mentorship",
            pillar="Career & Innovation",
            subject="Communication",
            description="Translating technical architecture into business value, running effective code reviews, and mentorship.",
            difficulty="intermediate",
            prerequisites=["comm_technical_writing"],
            learning_objectives=[
                "Present technical trade-offs persuasively to non-technical executives",
                "Conduct empathetic, high-velocity code reviews that elevate team standards",
            ],
            estimated_duration_minutes=45,
            concepts=[
                "stakeholder_influence",
                "code_review_culture",
                "technical_mentorship",
                "business_alignment",
            ],
            skills=["engineering_leadership", "stakeholder_presentation", "code_review_mentorship"],
        ),
        # --- Interview Preparation ---
        TopicNode(
            id="prep_live_coding",
            name="Technical Coding Interview Mastery",
            pillar="Career & Innovation",
            subject="Interview Preparation",
            description="Live problem-solving communication, edge case identification, test case design, and whiteboard clarity.",
            difficulty="intermediate",
            prerequisites=["dsa_arrays_hashing"],
            learning_objectives=[
                "Communicate thought processes clearly during live coding challenges",
                "Identify hidden edge cases and state constraints before writing code",
            ],
            estimated_duration_minutes=50,
            concepts=[
                "live_coding",
                "problem_decomposition",
                "edge_case_testing",
                "interview_communication",
            ],
            skills=["coding_interview_strategy", "live_problem_solving", "whiteboard_execution"],
        ),
        TopicNode(
            id="prep_system_design_behavioral",
            name="System Design & Behavioral STAR Interviews",
            pillar="Career & Innovation",
            subject="Interview Preparation",
            description="Back-of-the-envelope estimation, high-level architecture diagramming, and STAR method leadership stories.",
            difficulty="advanced",
            prerequisites=["prep_live_coding", "sd_scalability_caching"],
            learning_objectives=[
                "Drive 45-minute senior system design interviews from scoping to trade-offs",
                "Structure compelling behavioral responses using the STAR framework",
            ],
            estimated_duration_minutes=60,
            concepts=[
                "system_design_framework",
                "back_of_envelope",
                "star_framework",
                "behavioral_stories",
            ],
            skills=["system_design_interview", "behavioral_storytelling", "executive_presence"],
        ),
        # --- Entrepreneurship ---
        TopicNode(
            id="ent_pmf_validation",
            name="Idea Validation, Customer Discovery & PMF",
            pillar="Career & Innovation",
            subject="Entrepreneurship",
            description="The Mom Test customer interviewing, problem validation, value proposition design, and product-market fit metrics.",
            difficulty="beginner",
            prerequisites=[],
            learning_objectives=[
                "Conduct unbiased user discovery interviews to validate problem spaces",
                "Define unique value propositions and quantified value hypotheses",
            ],
            estimated_duration_minutes=45,
            concepts=["customer_discovery", "mom_test", "value_proposition", "product_market_fit"],
            skills=["customer_interviews", "problem_validation", "pmf_discovery"],
        ),
        TopicNode(
            id="ent_tech_mvp_gtm",
            name="Zero-to-One Tech MVP, Unit Economics & GTM",
            pillar="Career & Innovation",
            subject="Entrepreneurship",
            description="Scoping minimum lovable products (MLP), customer acquisition funnels, unit economics, and pitch deck creation.",
            difficulty="intermediate",
            prerequisites=["ent_pmf_validation"],
            learning_objectives=[
                "Scope and launch a lean, functional MVP in under 3 weeks",
                "Calculate gross margins, payback periods, and build investor pitch decks",
            ],
            estimated_duration_minutes=55,
            concepts=["mvp_scoping", "go_to_market", "unit_economics", "investor_pitching"],
            skills=["mvp_execution", "go_to_market_strategy", "startup_fundraising"],
        ),
        # --- Product Management ---
        TopicNode(
            id="pm_product_strategy_prds",
            name="Product Strategy, PRDs & Opportunity Trees",
            pillar="Career & Innovation",
            subject="Product Management",
            description="Product Requirement Documents (PRDs), Teresa Torres Opportunity Solution Trees, and prioritization (RICE).",
            difficulty="intermediate",
            prerequisites=[],
            learning_objectives=[
                "Write comprehensive PRDs with acceptance criteria and risk registers",
                "Prioritize feature roadmaps using the RICE framework",
            ],
            estimated_duration_minutes=50,
            concepts=[
                "prd_specification",
                "opportunity_trees",
                "rice_prioritization",
                "roadmap_strategy",
            ],
            skills=["product_requirements", "feature_prioritization", "roadmap_planning"],
        ),
        TopicNode(
            id="pm_growth_loops",
            name="Product-Led Growth, Retention & Analytics",
            pillar="Career & Innovation",
            subject="Product Management",
            description="Viral growth loops, North Star metric trees, onboarding activation funnels, and retention cohort drivers.",
            difficulty="advanced",
            prerequisites=["pm_product_strategy_prds", "da_business_metrics_kpis"],
            learning_objectives=[
                "Design self-reinforcing product-led growth loops and referral engines",
                "Diagnose leaky drop-off steps in user onboarding journeys",
            ],
            estimated_duration_minutes=55,
            concepts=[
                "growth_loops",
                "north_star_metric",
                "activation_funnels",
                "retention_engineering",
            ],
            skills=["growth_product_management", "retention_optimization", "activation_design"],
        ),
        # --- UI/UX ---
        TopicNode(
            id="uiux_design_foundations",
            name="UI/UX Foundations & Figma Design Systems",
            pillar="Career & Innovation",
            subject="UI/UX",
            description="Visual hierarchy, typography scales, color harmony, Figma auto-layout, components, and design tokens.",
            difficulty="beginner",
            prerequisites=[],
            learning_objectives=[
                "Construct scalable component design systems in Figma with auto-layout",
                "Apply modern color palettes, typography scales, and glassmorphism styling",
            ],
            estimated_duration_minutes=45,
            concepts=[
                "figma_design_systems",
                "visual_hierarchy",
                "typography_scales",
                "color_tokens",
            ],
            skills=["figma_prototyping", "design_system_architecture", "visual_ui_design"],
        ),
        TopicNode(
            id="uiux_interaction_wcag",
            name="Micro-Interactions, User Journeys & WCAG Accessibility",
            pillar="Career & Innovation",
            subject="UI/UX",
            description="Framer Motion micro-animations, user journey mapping, usability testing, and WCAG AA accessibility compliance.",
            difficulty="intermediate",
            prerequisites=["uiux_design_foundations"],
            learning_objectives=[
                "Design delightful interactive states, loading skeletons, and hover micro-animations",
                "Audit interfaces for keyboard navigability and WCAG AA color contrast standards",
            ],
            estimated_duration_minutes=50,
            concepts=[
                "micro_interactions",
                "user_journey_mapping",
                "wcag_accessibility",
                "usability_testing",
            ],
            skills=["interaction_design", "accessibility_auditing", "user_journey_research"],
        ),
    ]

    for node in seed_nodes:
        graph.add_node(node)


initialize_default_curriculum(curriculum_graph)
