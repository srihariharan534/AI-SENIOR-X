# AI-SENIOR-X AI Engine Foundation

This directory houses the abstract interfaces and future multi-agent AI framework for AI-SENIOR-X.

## Architecture

* **Abstract Provider Layer (`interfaces.py`)**: Defines decoupled interfaces for:
  - `BaseLLMProvider`: Model-agnostic completion & streaming (Gemini, OpenAI, Anthropic, Ollama).
  - `BaseEmbeddingProvider`: Dense vector generation.
  - `BaseVectorStore`: Similarity search & document indexing.
  - `BaseAgent`: Orchestrated multi-agent reasoning loops.

In subsequent master prompts, concrete agent pipelines (Tutor, Diagnostic, Learning Twin, Grading, Misconception Detector) will implement these interfaces.
