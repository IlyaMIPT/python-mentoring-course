# string to int
s = "123"
n = int(s)
print(n+1)

# int to string
money = "1234343"
print("Money on my bank account: " + str(money))

# float to string:
pi = float("3.14")
print(2*pi)

# bool to string
print("Boolean type conversions:")
print(str(True))
print(bool("True"))

# check string is actually a number
s = "124"
print(s.isnumeric(), "124 - это число")
print("123v".isnumeric(), "Это - не число")
