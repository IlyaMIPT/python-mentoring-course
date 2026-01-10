# Калькулятор дохода
# Задаем целевую заплату, которую мы хотим получить через 5 лет
# Задаем начальную зарплату
#

TARGET_INCOME = 1000000
REAL_SALARY_GROWTH = 17
AVG_INFLATION = 13
STARTER_SALARY = 300000
PERIOD_LEN_YEARS = 5
SPENDING_SHARE = 10
DEPOSIT_INTEREST_RATE = 17
DEPOSITS_INITIAL_BALANCE = 2000000

deposits_balance = DEPOSITS_INITIAL_BALANCE
current_salary = STARTER_SALARY
is_target_income_reached = False
for month in range(0, PERIOD_LEN_YEARS * 12):
    # блок роста зарплаты
    if month % 12 == 0 and month > 0:
        expected_salary_growth = REAL_SALARY_GROWTH + AVG_INFLATION
        salary_growth = round(
            current_salary * expected_salary_growth / 100
        )
        current_salary += salary_growth
        print("Зарплата повышена на", salary_growth, " до", current_salary)
    savings = current_salary * (1 - SPENDING_SHARE / 100)
    deposits_balance += round(savings)
    interest_income = deposits_balance * DEPOSIT_INTEREST_RATE / 100 / 12
    total_months_income = current_salary + interest_income
    if total_months_income > TARGET_INCOME:
        print("Целевой уровень дохода достигнут")
        print("Заработная плата", current_salary,
              ", процентный доход:", interest_income)

print("Итоговый доход, к сожалению, не достигнут")
print('Фактический общий доход', total_months_income)
print('В том числе зарплата', current_salary, 'и проценты', interest_income)
print('На депозитах:', deposits_balance)
