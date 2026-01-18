# аргументы передаются по присваиванию (ссылке)

def find_dashboard(dash_id: str, dashboards: list[tuple[str, str]]) -> str:
    # dash_id = "users"
    # dashboards = all_dashs (присваиваем ссылки)

    for d_id, name in dashboards:
        if d_id == dash_id:
            return name
    raise ValueError(f"No dashboard with id = {dash_id}")


all_dashs = [
    ("main", "Main company dashboard"),
    ("users", "Users dashboard"),
    ("orders", "Paid orders dashboard")
]

dash_name = find_dashboard("users", all_dashs)
print(dash_name)
