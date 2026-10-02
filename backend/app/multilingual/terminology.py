"""AI-SENIOR-X Technical Terminology Protection Module."""

import re


class TechnicalTerminologyKeeper:
    """Preserves essential programming keywords, mathematical formulas, and ML concepts."""

    # Universal terms that should not be transliterated or mistranslated
    PROTECTED_TERMS = {
        # Programming & CS
        "Python",
        "JavaScript",
        "TypeScript",
        "SQL",
        "HTML",
        "CSS",
        "Docker",
        "Kubernetes",
        "Git",
        "def",
        "class",
        "async",
        "await",
        "import",
        "return",
        "for",
        "while",
        "if",
        "else",
        "elif",
        "try",
        "except",
        "finally",
        "with",
        "yield",
        "lambda",
        "None",
        "True",
        "False",
        "SELECT",
        "FROM",
        "WHERE",
        "JOIN",
        "INNER JOIN",
        "LEFT JOIN",
        "GROUP BY",
        "ORDER BY",
        "HAVING",
        # AI & ML Concepts
        "Machine Learning",
        "Deep Learning",
        "Neural Network",
        "Overfitting",
        "Underfitting",
        "Gradient Descent",
        "Backpropagation",
        "Loss Function",
        "Activation Function",
        "Transformer",
        "Attention Mechanism",
        "Self-Attention",
        "Embedding",
        "RAG",
        "LLM",
        "Supervised Learning",
        "Unsupervised Learning",
        "Reinforcement Learning",
        "Cross-Validation",
        "Hyperparameter",
        "Epoch",
        "Batch Size",
        "Learning Rate",
        "Bias-Variance Tradeoff",
        "Precision",
        "Recall",
        "F1 Score",
        "ROC-AUC",
        # Data Structures & Math
        "Array",
        "Linked List",
        "Stack",
        "Queue",
        "Binary Tree",
        "Graph",
        "Hash Table",
        "Big-O",
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(n^2)",
        "Matrix",
        "Vector",
        "Eigenvalue",
        "Eigenvector",
        "Dot Product",
        "Cosine Similarity",
    }

    @classmethod
    def get_prompt_instruction(cls, target_language_code: str) -> str:
        """Produce system instructions guiding the LLM on terminology preservation."""
        if target_language_code == "en":
            return ""

        return (
            f"IMPORTANT MULTILINGUAL INSTRUCTION:\n"
            f"1. Explain the concepts clearly in {target_language_code}.\n"
            f"2. Keep programming keywords (e.g. `def`, `class`, `async`, `SELECT`, `JOIN`) and technical code syntax in their original English form.\n"
            f"3. When introducing core terms (like Overfitting, Gradient Descent, Self-Attention), provide the standard technical term in English alongside the localized explanation.\n"
            f"4. Do NOT translate code blocks or markdown backticks.\n"
        )

    @classmethod
    def contains_code_blocks(cls, text: str) -> bool:
        """Check whether text contains fenced or inline code."""
        return "```" in text or bool(re.search(r"`[^`]+`", text))
