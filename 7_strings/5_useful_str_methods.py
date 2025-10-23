# in для строк:
demanded_tech = 'Macbook - главный инструмент аналитика'
print(demanded_tech)
print('Буква М', 'M' in demanded_tech)
print('Аналитика: ', 'аналитика' in demanded_tech)

if 'Macbook' in demanded_tech:
    print('Отлично, макбук - то что нужно')
else:
    print('Аналитики работают только на Windows')


# index:
priorities = 'remote work, high salary, macbook, interesting tasks'
print(priorities.index('high salary'))


# replace
priorities += ', micromanagement'
print('Some boss added:', priorities)
priorities = priorities.replace(
    'micromanagement', 'no supervision if everything is done'
)
print('Good boss says:', priorities)
