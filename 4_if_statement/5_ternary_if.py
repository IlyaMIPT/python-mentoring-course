# Тернарный if:

PREMIUM_CAR_MIN_PRICE = 7205600
car_price = 8506700
price_label = 'premium' if car_price > PREMIUM_CAR_MIN_PRICE else 'comfort'
print('Покупаем автомобиль: ', price_label)
