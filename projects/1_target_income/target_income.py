TARGET_SALARY = 1000000
SALARY_GROWTH = 30
STARTER_SALARY = 300000
PERIOD_LEN_YEARS = 5
SPENDING_SHARE = 10
DEPOSIT_INTEREST_RATE = 17

deposits_balance = 0
current_salary = STARTER_SALARY
is_target_income_reached = False
for month in range(0, PERIOD_LEN_YEARS * 12):
    # блок роста зарплаты
    if month % 12 == 0 and month > 0:
        salary_growth = round(current_salary * SALARY_GROWTH / 100)
        current_salary += salary_growth
        print("Зарплата повышена на", salary_growth, " до", current_salary)
    savings = current_salary * (1 - SPENDING_SHARE / 100)
    deposits_balance += round(savings)
    interest_income = deposits_balance * DEPOSIT_INTEREST_RATE / 100 / 12
    total_months_income = current_salary + interest_income
    if total_months_income > TARGET_SALARY:
        print("Целевой уровень дохода достигнут")
        print("Заработная плата", current_salary,
              ", процентный доход:", interest_income)
        is_target_income_reached = True
        break

if not is_target_income_reached:
    print("Целевой доход, к сожалению, не достигнут")
    print('Фактический общий доход', total_months_income)
    print('В том числе зарплата', current_salary, 'и проценты', interest_income)
    print('На депозитах:', deposits_balance)
