# if с логическими операторами
my_speed = 55

if my_speed is None or my_speed < 20:
    print("Вы двигаетесь слишком медленно или не двигаетесь вообще")

if my_speed > 60 and my_speed < 80:
    print("Предупреждение")
if 80 < my_speed < 110:
    print("Штраф за превышение")
if my_speed > 110:
    print("Лишение прав на 3 месяца")
