def forecast(prices: list[float]) -> float:
    """
    Forecast prices using simple algo: return latest price

    :param prices: list of prices
    :type prices: list[float]
    :return: forecasted price based on actual prices
    :rtype: float
    """
    return prices[-1]
