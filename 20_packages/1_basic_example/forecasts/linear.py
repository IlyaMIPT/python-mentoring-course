def naive_forecast(prices: list[float]) -> float:
    return prices[-1]


def forecast_linear(prices: list[float]) -> float:
    step = (prices[-1] - prices[0]) / (len(prices) - 1)
    return prices[-1] + step


def _helper():
    pass
