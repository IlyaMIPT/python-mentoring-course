import transfer
from forecasts import *


transfer.export_to_file()
linear_price = forecast_linear([1, 2, 3])
last_price = naive_forecast([10, 20, 30])
print("Linear forecasted price: ", linear_price)
print("Naive forecasted price", last_price)
