# Asynchronous Programming in Python

## The AsyncIO Concurrency Model

Python's `asyncio` module provides single-threaded cooperative multitasking through an event loop.

### Coroutines and Tasks
- `async def`: Defines a native coroutine function.
- `await`: Suspends execution of the current coroutine until the awaited awaitable completes, allowing other tasks in the event loop to run.
- `asyncio.create_task()`: Schedules concurrent execution of a coroutine on the running event loop.

### Concurrency vs Parallelism
- **Concurrency (I/O Bound)**: Interleaving execution of tasks waiting for network or database I/O (e.g. database queries, HTTP client requests).
- **Parallelism (CPU Bound)**: Simultaneous execution on multiple CPU cores using `multiprocessing`.
