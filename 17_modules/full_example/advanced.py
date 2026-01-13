from statistics import mean

print("Initialize advanced engine")


def forecast(prices: list[float]) -> float:
    """Forecast using advanced algo"""
    mean_value = mean(prices)
    min_value = max(prices)
    return min(min_value, mean_value)


def check_forecast(foc_price: float) -> bool:
    return foc_price > 0
