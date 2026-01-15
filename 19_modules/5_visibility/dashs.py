dashboards = [
    "admin",
    "orders",
    "suppliers"
]

last_dash_id = 12345


def add_dashboard(d: str) -> None:
    dashboards.append(d)


def inc_version(delta: int) -> None:
    global last_dash_id
    last_dash_id += delta


def get_version() -> int:
    return last_dash_id
