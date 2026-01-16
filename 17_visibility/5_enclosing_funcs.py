def get_pct_growth(series: list[float]) -> list[float | None]:
    """Return percentage growth for element to element"""

    def _get_growth(curr: float, nxt: float) -> float | None:
        return nxt / curr - 1 if curr != 0 else None

    return [
        _get_growth(c, n) for c, n in zip(series, series[1:])
    ]


res = get_pct_growth([100, 150, 300, 400])
print(res)
