import simple
import complex as ca
from advanced import forecast, check_forecast as forecast_check


prices = [10, 20, 30, 40.0]
new_price = simple.forecast(prices)
print('Simplest forecast:')
print(f'Actual prices: {prices}, forecasted price is {new_price}')

print("Complex forecasts:")
cf_price = ca.forecast([1, 2, 3, 4, 5, 6])
print(f'{prices} -> {cf_price}')

print("Advanced forecast:")
adv_price = forecast([10, 20])
print(f'{prices} -> (advanced) -> {cf_price}')
if forecast_check(adv_price):
    print("Forecast is valid")
