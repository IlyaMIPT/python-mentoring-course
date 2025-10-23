# Пустые значения None

bonus = 340000
passed_review_bonus = 340000
failed_review_bonus = None

if bonus == passed_review_bonus:
    print("Премия получена, т.к. ревью пройдено успешно")

if failed_review_bonus is None:
    print("В этом квартале ты не старался, но зп и так высокая")


# для чего это нужно?
my_yearly_gadgets_spending = 1000000
gadgets_count = 0
per_gadget_price = None
if gadgets_count != 0:
    per_gadget_price = my_yearly_gadgets_spending / gadgets_count

if per_gadget_price is not None:
    print('Средняя цена за товар:', per_gadget_price)
else:
    print("Цена не определена, число товаров нулевое")

if per_gadget_price is None:
    print("Ошибка в исходных данных")
