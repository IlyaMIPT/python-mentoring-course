from statistics import mean
from forecasts._utils import find_median


def forecast_advanced(price: list[float]) -> float:
    _check_calculations()
    _ = find_median()
    return mean(price) + 1


def _check_calculations() -> None:
    pass
