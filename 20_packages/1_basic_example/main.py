# pylint: disable=wildcard-import
import transfer
# from forecasts import *
from forecasts.linear import *


transfer.export_to_file()
linear_price = forecast_linear([1, 2, 3])
last_price = naive_forecast([10, 20, 30])
print("Linear forecasted price: ", linear_price)
print("Naive forecasted price", last_price)

# names with _ will not be imported if importing *
# _helper()
