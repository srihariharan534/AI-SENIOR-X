"""Application Metrics & Observability REST Endpoints."""

from typing import Any

from fastapi import APIRouter, status

from monitoring.metrics.metrics_collector import metrics

router = APIRouter(prefix="/metrics", tags=["Observability & Metrics"])


@router.get(
    "",
    response_model=dict[str, Any],
    status_code=status.HTTP_200_OK,
    summary="Get System Observability Metrics Snapshot",
)
async def get_metrics_snapshot() -> dict[str, Any]:
    """Retrieve in-memory counters, agent latencies, and error rates."""
    return metrics.get_snapshot()


@router.get(
    "/prometheus",
    status_code=status.HTTP_200_OK,
    summary="Prometheus Text Exposition Format",
)
async def get_prometheus_metrics() -> str:
    """Format counters and gauges into standard Prometheus exposition syntax."""
    snapshot = metrics.get_snapshot()
    lines: list[str] = []

    # Counters
    for counter_name, val in snapshot.get("counters", {}).items():
        clean_name = f"ai_senior_x_{counter_name.replace('.', '_').replace('-', '_')}"
        lines.append(f"# TYPE {clean_name} counter")
        lines.append(f"{clean_name} {val}")

    # Latencies
    for lat_name, lat_data in snapshot.get("latencies", {}).items():
        clean_name = f"ai_senior_x_latency_{lat_name.replace('.', '_').replace('-', '_')}"
        lines.append(f"# TYPE {clean_name}_avg_ms gauge")
        lines.append(f"{clean_name}_avg_ms {lat_data.get('avg_ms', 0)}")

    return "\n".join(lines) + "\n"
