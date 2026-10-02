'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import { ReadinessEvaluation, TopicNode } from '@/types';

const DEFAULT_SEED_NODES: TopicNode[] = [
  // 1. Computer Science
  {
    id: 'py_basics',
    name: 'Python Basics & Control Flow',
    pillar: 'Computer Science',
    subject: 'Python',
    description: 'Core syntax, loops, conditionals, basic data structures, and functions.',
    difficulty: 'beginner',
    prerequisites: [],
    estimated_duration_minutes: 40,
    learning_objectives: ['Understand variables and types', 'Write loops and branching logic'],
    concepts: ['variables', 'loops', 'functions', 'control_flow'],
  },
  {
    id: 'py_oop',
    name: 'Object-Oriented Python',
    pillar: 'Computer Science',
    subject: 'Python',
    description: 'Classes, inheritance, polymorphism, encapsulation, and magic methods.',
    difficulty: 'intermediate',
    prerequisites: ['py_basics'],
    estimated_duration_minutes: 45,
    learning_objectives: ['Implement classes and inheritance', 'Utilize special dunder methods'],
    concepts: ['classes', 'inheritance', 'dunder_methods', 'polymorphism'],
  },
  {
    id: 'py_async',
    name: 'AsyncIO & Concurrency',
    pillar: 'Computer Science',
    subject: 'Python',
    description: 'Event loops, coroutines, async/await paradigms, tasks, and gather.',
    difficulty: 'advanced',
    prerequisites: ['py_basics'],
    estimated_duration_minutes: 60,
    learning_objectives: ['Design asynchronous I/O workflows', 'Manage concurrency and tasks'],
    concepts: ['event_loop', 'coroutines', 'async_await', 'concurrency'],
  },
  {
    id: 'dsa_arrays_hashing',
    name: 'Arrays, Strings & Hash Tables',
    pillar: 'Computer Science',
    subject: 'DSA',
    description: 'Two pointers, sliding window, prefix sums, and hash table collision resolution.',
    difficulty: 'beginner',
    prerequisites: ['py_basics'],
    estimated_duration_minutes: 50,
    learning_objectives: ['Solve search and substring problems in O(N) time', 'Implement hash maps'],
    concepts: ['two_pointers', 'sliding_window', 'hash_tables'],
  },
  {
    id: 'dsa_graphs_trees',
    name: 'Data Structures: Trees, Graphs & Algorithms',
    pillar: 'Computer Science',
    subject: 'DSA',
    description: 'Binary Search Trees, AVL balance, BFS, DFS, Dijkstra, dynamic programming.',
    difficulty: 'intermediate',
    prerequisites: ['dsa_arrays_hashing'],
    estimated_duration_minutes: 60,
    learning_objectives: ['Implement tree and graph traversals', 'Analyze asymptotic complexity'],
    concepts: ['binary_search_trees', 'bfs_dfs', 'dynamic_programming'],
  },
  {
    id: 'se_clean_code_solid',
    name: 'Clean Code & SOLID Architecture',
    pillar: 'Computer Science',
    subject: 'Software Engineering',
    description: 'Single responsibility, Open-Closed, Liskov substitution, and Dependency inversion.',
    difficulty: 'intermediate',
    prerequisites: ['py_oop'],
    estimated_duration_minutes: 50,
    learning_objectives: ['Refactor spaghetti into decoupled modules', 'Apply clean architecture'],
    concepts: ['solid_principles', 'clean_code', 'dependency_injection'],
  },
  {
    id: 'sql_fundamentals',
    name: 'Relational SQL & Database Queries',
    pillar: 'Computer Science',
    subject: 'Databases',
    description: 'SELECT, JOINs, aggregations, window functions, indexing, and transaction isolation.',
    difficulty: 'beginner',
    prerequisites: [],
    estimated_duration_minutes: 45,
    learning_objectives: ['Write multi-table JOINs', 'Optimize query execution with indexes'],
    concepts: ['select_queries', 'joins', 'indexing', 'transactions'],
  },
  {
    id: 'web_fastapi_nextjs',
    name: 'Full-Stack Web Architecture (FastAPI + Next.js)',
    pillar: 'Computer Science',
    subject: 'Web Development',
    description: 'RESTful API design, JWT authentication, async dependencies, React Server Components.',
    difficulty: 'intermediate',
    prerequisites: ['py_basics'],
    estimated_duration_minutes: 60,
    learning_objectives: ['Build authenticated full-stack web applications', 'Connect typed API clients'],
    concepts: ['fastapi', 'nextjs', 'jwt_auth', 'rest_api'],
  },
  {
    id: 'sd_scalability_caching',
    name: 'Scalability, Caching & Load Balancing',
    pillar: 'Computer Science',
    subject: 'System Design',
    description: 'Horizontal scaling, reverse proxies, CDN caching, and read-replica replication.',
    difficulty: 'intermediate',
    prerequisites: ['web_fastapi_nextjs', 'sql_fundamentals'],
    estimated_duration_minutes: 65,
    learning_objectives: ['Design systems scaling from 1K to 10M requests', 'Implement multi-tier caching'],
    concepts: ['load_balancing', 'cdn_caching', 'database_replication'],
  },

  // 2. AI & Data
  {
    id: 'ml_supervised',
    name: 'Supervised Learning Foundations',
    pillar: 'AI & Data',
    subject: 'AI & Machine Learning',
    description: 'Linear regression, logistic regression, decision trees, bias-variance tradeoff, evaluation metrics.',
    difficulty: 'intermediate',
    prerequisites: ['py_basics', 'math_linear_algebra', 'math_calculus'],
    estimated_duration_minutes: 60,
    learning_objectives: ['Train regression and classification models', 'Evaluate precision, recall, and ROC-AUC'],
    concepts: ['linear_regression', 'logistic_regression', 'bias_variance', 'decision_trees'],
  },
  {
    id: 'ml_deep_learning',
    name: 'Deep Neural Networks & PyTorch',
    pillar: 'AI & Data',
    subject: 'Deep Learning',
    description: 'Multi-layer perceptrons, backpropagation, activation functions, loss functions, PyTorch.',
    difficulty: 'advanced',
    prerequisites: ['ml_supervised'],
    estimated_duration_minutes: 75,
    learning_objectives: ['Construct neural networks in PyTorch', 'Debug training and gradient dynamics'],
    concepts: ['neural_networks', 'backpropagation', 'activations', 'pytorch'],
  },
  {
    id: 'genai_llm_fundamentals',
    name: 'Large Language Models & Prompt Engineering',
    pillar: 'AI & Data',
    subject: 'Generative AI',
    description: 'Tokenization, autoregressive sampling, context windows, few-shot prompt patterns, and structured outputs.',
    difficulty: 'intermediate',
    prerequisites: ['py_basics'],
    estimated_duration_minutes: 50,
    learning_objectives: ['Master system prompt engineering', 'Manage token budgets and context windows'],
    concepts: ['prompt_engineering', 'tokenization', 'context_window', 'structured_generation'],
  },
  {
    id: 'ml_rag_agents',
    name: 'RAG & Multi-Agent AI Architectures',
    pillar: 'AI & Data',
    subject: 'Generative AI',
    description: 'Vector embeddings, hybrid retrieval, cross-reranking, autonomous agent loops, tool use.',
    difficulty: 'advanced',
    prerequisites: ['genai_llm_fundamentals', 'py_async'],
    estimated_duration_minutes: 90,
    learning_objectives: ['Design retrieval-augmented systems', 'Build multi-agent coordination pipelines'],
    concepts: ['rag', 'vector_embeddings', 'agent_loops', 'tool_calling'],
  },
  {
    id: 'ds_numpy_pandas',
    name: 'Data Manipulation with NumPy and Pandas',
    pillar: 'AI & Data',
    subject: 'Data Science',
    description: 'Array vectorization, DataFrames, groupbys, merges, and data cleaning pipelines.',
    difficulty: 'beginner',
    prerequisites: ['py_basics'],
    estimated_duration_minutes: 50,
    learning_objectives: ['Perform vectorized computations', 'Transform structured tabular datasets'],
    concepts: ['vectorization', 'dataframes', 'aggregation', 'cleaning'],
  },
  {
    id: 'da_business_metrics_kpis',
    name: 'Business Analytics & KPI Modeling',
    pillar: 'AI & Data',
    subject: 'Data Analytics',
    description: 'Customer lifetime value (LTV), cohort retention analysis, churn prediction metrics, and funnel analytics.',
    difficulty: 'beginner',
    prerequisites: [],
    estimated_duration_minutes: 45,
    learning_objectives: ['Model CAC, LTV, and retention cohorts', 'Design executive reporting dashboards'],
    concepts: ['kpi_frameworks', 'cohort_analysis', 'funnel_metrics', 'ltv_cac'],
  },
  {
    id: 'math_linear_algebra',
    name: 'Linear Algebra for Machine Learning',
    pillar: 'AI & Data',
    subject: 'Mathematics',
    description: 'Vectors, matrices, matrix multiplication, eigenvalues, eigenvectors, and projections.',
    difficulty: 'intermediate',
    prerequisites: [],
    estimated_duration_minutes: 50,
    learning_objectives: ['Master matrix operations', 'Understand vector spaces and transformations'],
    concepts: ['matrices', 'vectors', 'eigenvectors', 'dot_product'],
  },
  {
    id: 'math_calculus',
    name: 'Multivariate Calculus & Optimization',
    pillar: 'AI & Data',
    subject: 'Mathematics',
    description: 'Partial derivatives, gradients, Jacobians, Hessians, and gradient descent.',
    difficulty: 'intermediate',
    prerequisites: [],
    estimated_duration_minutes: 50,
    learning_objectives: ['Compute gradients and partial derivatives', 'Understand optimization surfaces'],
    concepts: ['partial_derivatives', 'gradients', 'optimization', 'chain_rule'],
  },
  {
    id: 'stats_foundations',
    name: 'Probability & Inferential Statistics',
    pillar: 'AI & Data',
    subject: 'Statistics',
    description: "Probability distributions, Bayes' Theorem, hypothesis testing, and p-values.",
    difficulty: 'intermediate',
    prerequisites: [],
    estimated_duration_minutes: 45,
    learning_objectives: ['Compute conditional probabilities', 'Perform hypothesis testing'],
    concepts: ['bayes_theorem', 'probability_distributions', 'hypothesis_testing'],
  },

  // 3. Cloud & Infrastructure
  {
    id: 'cloud_foundations_aws_gcp',
    name: 'Cloud Architecture & Core Services',
    pillar: 'Cloud & Infrastructure',
    subject: 'Cloud',
    description: 'Compute (EC2/GCE), storage (S3/GCS), IAM identity, VPC networking, and cloud security boundaries.',
    difficulty: 'beginner',
    prerequisites: [],
    estimated_duration_minutes: 50,
    learning_objectives: ['Configure cloud compute and IAM roles', 'Design isolated VPC subnets'],
    concepts: ['iam', 'vpc_networking', 'object_storage', 'cloud_compute'],
  },
  {
    id: 'cloud_containerization',
    name: 'Cloud Infrastructure & Containerization',
    pillar: 'Cloud & Infrastructure',
    subject: 'Cloud',
    description: 'Docker containers, multi-stage builds, orchestration with Docker Compose, and CI/CD pipelines.',
    difficulty: 'intermediate',
    prerequisites: [],
    estimated_duration_minutes: 45,
    learning_objectives: ['Build optimized container images', 'Configure automated CI test workflows'],
    concepts: ['docker', 'compose', 'ci_cd', 'cloud_native'],
  },
  {
    id: 'devops_ci_cd_automation',
    name: 'CI/CD Automation & GitHub Actions',
    pillar: 'Cloud & Infrastructure',
    subject: 'DevOps',
    description: 'Continuous integration pipelines, automated testing, semantic versioning, and zero-downtime deployment.',
    difficulty: 'intermediate',
    prerequisites: ['cloud_containerization'],
    estimated_duration_minutes: 50,
    learning_objectives: ['Write automated GitHub Actions pipelines', 'Implement blue-green deployment automation'],
    concepts: ['github_actions', 'ci_cd', 'automated_testing', 'blue_green_deployment'],
  },
  {
    id: 'mlops_model_tracking',
    name: 'MLflow Experiment Tracking & Model Registry',
    pillar: 'Cloud & Infrastructure',
    subject: 'MLOps',
    description: 'Artifact tracking, metric logging, model lineage, hyperparameter sweeps, and staging promotion.',
    difficulty: 'intermediate',
    prerequisites: ['ml_supervised', 'cloud_containerization'],
    estimated_duration_minutes: 55,
    learning_objectives: ['Track training metrics with MLflow', 'Manage production model registries'],
    concepts: ['mlflow', 'model_registry', 'experiment_tracking', 'model_lineage'],
  },
  {
    id: 'sec_appsec_owasp',
    name: 'Application Security & OWASP Top 10',
    pillar: 'Cloud & Infrastructure',
    subject: 'Cybersecurity',
    description: 'SQL injection, XSS, CSRF, broken access control, and secure coding patterns.',
    difficulty: 'intermediate',
    prerequisites: ['web_fastapi_nextjs'],
    estimated_duration_minutes: 55,
    learning_objectives: ['Audit codebases for OWASP Top 10 flaws', 'Implement secure input sanitization'],
    concepts: ['owasp_top_10', 'sql_injection', 'xss_csrf', 'secure_coding'],
  },

  // 4. Career & Innovation
  {
    id: 'comm_technical_writing',
    name: 'Technical Writing, RFCs & Engineering Docs',
    pillar: 'Career & Innovation',
    subject: 'Communication',
    description: 'RFC writing, architectural decision records (ADRs), API documentation, and asynchronous team communication.',
    difficulty: 'beginner',
    prerequisites: [],
    estimated_duration_minutes: 40,
    learning_objectives: ['Author concise RFC proposals', 'Write crystal-clear API specifications'],
    concepts: ['rfc_proposals', 'adr_records', 'api_documentation'],
  },
  {
    id: 'prep_live_coding',
    name: 'Technical Coding Interview Mastery',
    pillar: 'Career & Innovation',
    subject: 'Interview Preparation',
    description: 'Live problem-solving communication, edge case identification, test case design, and whiteboard clarity.',
    difficulty: 'intermediate',
    prerequisites: ['dsa_arrays_hashing'],
    estimated_duration_minutes: 50,
    learning_objectives: ['Communicate thought processes clearly during live coding', 'Identify hidden edge cases'],
    concepts: ['live_coding', 'problem_decomposition', 'edge_case_testing'],
  },
  {
    id: 'ent_pmf_validation',
    name: 'Idea Validation, Customer Discovery & PMF',
    pillar: 'Career & Innovation',
    subject: 'Entrepreneurship',
    description: 'Customer discovery interviewing, problem validation, value proposition design, and product-market fit metrics.',
    difficulty: 'beginner',
    prerequisites: [],
    estimated_duration_minutes: 45,
    learning_objectives: ['Conduct unbiased user discovery interviews', 'Define unique value propositions'],
    concepts: ['customer_discovery', 'mom_test', 'value_proposition', 'product_market_fit'],
  },
  {
    id: 'pm_product_strategy_prds',
    name: 'Product Strategy, PRDs & Opportunity Trees',
    pillar: 'Career & Innovation',
    subject: 'Product Management',
    description: 'Product Requirement Documents (PRDs), Teresa Torres Opportunity Solution Trees, and prioritization (RICE).',
    difficulty: 'intermediate',
    prerequisites: [],
    estimated_duration_minutes: 50,
    learning_objectives: ['Write comprehensive PRDs', 'Prioritize feature roadmaps using RICE'],
    concepts: ['prd_specification', 'opportunity_trees', 'rice_prioritization'],
  },
  {
    id: 'uiux_design_foundations',
    name: 'UI/UX Foundations & Figma Design Systems',
    pillar: 'Career & Innovation',
    subject: 'UI/UX',
    description: 'Visual hierarchy, typography scales, color harmony, Figma auto-layout, components, and design tokens.',
    difficulty: 'beginner',
    prerequisites: [],
    estimated_duration_minutes: 45,
    learning_objectives: ['Construct scalable component design systems in Figma', 'Apply modern color palettes and typography'],
    concepts: ['figma_design_systems', 'visual_hierarchy', 'typography_scales', 'color_tokens'],
  },
];

export function useCurriculum(selectedSubject?: string, selectedPillar?: string) {
  const [nodes, setNodes] = useState<TopicNode[]>(DEFAULT_SEED_NODES);
  const [selectedNode, setSelectedNode] = useState<TopicNode | null>(DEFAULT_SEED_NODES[0]);
  const [readiness, setReadiness] = useState<ReadinessEvaluation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGraph = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getCurriculumGraph(selectedSubject, selectedPillar);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setNodes(res.data);
        if (!selectedNode) {
          setSelectedNode(res.data[0]);
        }
      } else {
        let fallback = DEFAULT_SEED_NODES;
        if (selectedPillar && selectedPillar !== 'All') {
          fallback = fallback.filter((n) => n.pillar?.toLowerCase() === selectedPillar.toLowerCase());
        }
        if (selectedSubject && selectedSubject !== 'All') {
          fallback = fallback.filter((n) => n.subject.toLowerCase() === selectedSubject.toLowerCase());
        }
        setNodes(fallback);
      }
    } catch {
      let fallback = DEFAULT_SEED_NODES;
      if (selectedPillar && selectedPillar !== 'All') {
        fallback = fallback.filter((n) => n.pillar?.toLowerCase() === selectedPillar.toLowerCase());
      }
      if (selectedSubject && selectedSubject !== 'All') {
        fallback = fallback.filter((n) => n.subject.toLowerCase() === selectedSubject.toLowerCase());
      }
      setNodes(fallback);
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, selectedPillar, selectedNode]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const selectTopic = async (topicId: string) => {
    const found = nodes.find((n) => n.id === topicId) || DEFAULT_SEED_NODES.find((n) => n.id === topicId);
    if (found) {
      setSelectedNode(found);
    } else {
      const res = await api.getCurriculumNode(topicId);
      if (res.success && res.data) {
        setSelectedNode(res.data);
      }
    }

    try {
      const evalRes = await api.evaluateReadiness(topicId);
      if (evalRes.success && evalRes.data) {
        setReadiness(evalRes.data);
      }
    } catch {
      // Non-blocking readiness check
    }
  };

  return {
    nodes,
    selectedNode,
    readiness,
    loading,
    error,
    selectTopic,
    refreshGraph: fetchGraph,
  };
}
