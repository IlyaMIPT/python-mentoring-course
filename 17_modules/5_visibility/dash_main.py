import dashs

# лексическая область видимости.

# add to dashboard

dashboards = [
    "for task 1234",
    "temp dashboard"
]

print("All dashboards")
dashs.add_dashboard("ceo dashboard")
print(dashs.dashboards)

print("Local dashboards")
print(dashboards)
