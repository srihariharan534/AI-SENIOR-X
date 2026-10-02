"""AI-SENIOR-X Curated Misconception Library."""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class MisconceptionItem:
    """Descriptor of a known educational cognitive flaw."""

    id: str
    concept_id: str
    title: str
    misconception_statement: str
    accurate_conception: str
    remediation_strategy: str
    tags: list[str] = field(default_factory=list)


CURATED_MISCONCEPTIONS: dict[str, MisconceptionItem] = {
    # AI / Machine Learning
    "overfitting_accuracy": MisconceptionItem(
        id="overfitting_accuracy",
        concept_id="overfitting",
        title="Overfitting Equates High Performance",
        misconception_statement="Overfitting means the model is superior because it achieves 100% accuracy on training data.",
        accurate_conception="Overfitting means the model memorized noise and training idiosyncrasies, leading to poor generalization on unseen validation data.",
        remediation_strategy="Demonstrate train vs validation loss curves diverging; introduce regularization and early stopping.",
        tags=["machine_learning", "validation", "overfitting"],
    ),
    "gradient_descent_local_minima": MisconceptionItem(
        id="gradient_descent_local_minima",
        concept_id="gradient_descent",
        title="Gradient Descent Always Finds Global Optimum",
        misconception_statement="Gradient descent will always locate the absolute lowest minimum in all loss surfaces.",
        accurate_conception="In non-convex optimization (deep networks), gradient descent can be trapped in saddle points or poor local minima without momentum/Adam.",
        remediation_strategy="Visualize 3D loss landscapes showing saddle points and the benefit of stochastic mini-batches and momentum.",
        tags=["machine_learning", "optimization", "gradient_descent"],
    ),
    # SQL
    "sql_inner_left_join": MisconceptionItem(
        id="sql_inner_left_join",
        concept_id="sql_joins",
        title="INNER JOIN Retains Unmatched Rows",
        misconception_statement="INNER JOIN and LEFT JOIN return the same number of rows even when some foreign keys have no match.",
        accurate_conception="INNER JOIN strictly discards rows lacking matches in both tables; LEFT JOIN preserves all left-table rows with NULL placeholders.",
        remediation_strategy="Show Venn diagram table comparison with missing keys resulting in row drops.",
        tags=["sql", "joins", "databases"],
    ),
    # Python & Concurrency
    "python_async_threading": MisconceptionItem(
        id="python_async_threading",
        concept_id="async_await",
        title="AsyncIO Automatically Parallelizes CPU Tasks",
        misconception_statement="Adding `async` to a CPU-heavy numerical function will execute it simultaneously across multiple CPU cores.",
        accurate_conception="Python AsyncIO is single-threaded cooperative concurrency for I/O bound tasks; CPU-bound tasks still block the GIL unless run in ProcessPoolExecutor.",
        remediation_strategy="Demonstrate single-threaded event loop blockage when a sync loop is run inside an async def.",
        tags=["python", "asyncio", "concurrency"],
    ),
    # Data Structures & Algorithms
    "dsa_hash_table_o1": MisconceptionItem(
        id="dsa_hash_table_o1",
        concept_id="hash_tables",
        title="Hash Tables Are Worst-Case O(1)",
        misconception_statement="Hash table lookup, insertion, and deletion are always strictly O(1) in the worst case.",
        accurate_conception="Hash tables achieve O(1) average time, but degrade to O(n) worst-case time under catastrophic hash collisions unless balanced trees are used.",
        remediation_strategy="Explain collision resolution chaining and load factor rehashing triggers.",
        tags=["dsa", "hash_tables", "complexity"],
    ),
}
