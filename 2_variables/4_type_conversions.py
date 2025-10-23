# string to int
salary_str = "6578900"
n = int(salary_str)
print(n+1000000)

# int to string
money = "18194343"
print("Money on my bank account: " + str(money))

# float to string:
pi = float("3.14")
print(2*pi)

# bool to string
print("Boolean type conversions:")
print(str(True))
print(bool("True"))

# check string is actually a number
yearly_salary = "7205679"
print(yearly_salary.isnumeric(), "Данные - число")
print("7205679 rub".isnumeric(), "Это - не число")
