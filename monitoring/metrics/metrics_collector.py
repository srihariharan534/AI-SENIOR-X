"""Lightweight In-Memory Application Metrics Collector."""

import time
from collections import defaultdict
from typing import Any, Dict


class MetricsCollector:
    """Thread-safe metrics accumulator for request counts, latencies, and errors."""

    def __init__(self) -> None:
        self._counters: Dict[str, int] = defaultdict(int)
        self._latencies: Dict[str, list[float]] = defaultdict(list)

    def increment(self, metric_name: str, value: int = 1) -> None:
        """Increment a named counter."""
        self._counters[metric_name] += value

    def observe_latency(self, metric_name: str, duration_ms: float) -> None:
        """Record a latency measurement."""
        # Keep last 500 samples per metric to prevent unbounded memory growth
        samples = self._latencies[metric_name]
        samples.append(duration_ms)
        if len(samples) > 500:
            self._latencies[metric_name] = samples[-500:]

    def get_snapshot(self) -> Dict[str, Any]:
        """Return snapshot of current metrics."""
        summary: Dict[str, Any] = {
            "timestamp": time.time(),
            "counters": dict(self._counters),
            "latencies": {},
        }
        for metric, values in self._latencies.items():
            if values:
                summary["latencies"][metric] = {
                    "avg_ms": round(sum(values) / len(values), 2),
                    "min_ms": round(min(values), 2),
                    "max_ms": round(max(values), 2),
                    "count": len(values),
                }
        return summary


metrics = MetricsCollector()
