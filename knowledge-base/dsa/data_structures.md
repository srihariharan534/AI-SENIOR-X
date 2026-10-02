# Core Data Structures and Algorithmic Complexity

## Essential Data Structures

### 1. Hash Tables
- **Lookup/Insert/Delete Complexity**: Average $O(1)$, Worst case $O(n)$ upon severe hash collisions.
- **Mechanism**: Keys are converted via a deterministic hash function into bucket array indices. Collision resolution is handled via chaining or open addressing.

### 2. Binary Search Trees (BST) & Balanced Trees (AVL / Red-Black)
- **Search/Insert/Delete Complexity**: $O(\log n)$ when height-balanced.
- **Invariants**: For any node $N$, all nodes in the left subtree have values strictly less than $N$, and all nodes in the right subtree have values strictly greater than $N$.

### 3. Graphs and Traversal
- **Breadth-First Search (BFS)**: Uses a FIFO queue; optimal for shortest path on unweighted graphs.
- **Depth-First Search (DFS)**: Uses a LIFO stack or recursion; useful for topological sorting and cycle detection.
