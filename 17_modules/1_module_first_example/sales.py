# приведем пример модуля

import foc

print("Using algorithm version: " + foc.algo_version)

foc_sales = foc.get_sales("https:\\hello-world.com")
print(f"forecasted sales: {foc_sales}")
