from statistics import mean


def forecast_advanced(price: list[float]) -> float:
    return mean(price) + 1
