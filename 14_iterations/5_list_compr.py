job_description = [
    "программирование на python",
    "анализ данных с помощью Pandas",
    "построение дашбордов",
    "написание скриптов на SQL"
]

res = []
for d in job_description:
    res.append(d)

# apply function to each element: change the first letter
upper_case = [d[0].upper() + d[1:] for d in job_description]
print(upper_case)

# filter using list comprehension:
python_sql = [
    d for d in job_description
    if "python" in d.lower() or "sql" in d.lower()
]
print(python_sql)
