# from .utils import get_user_data
# also absolute import:
from metrics.utils import get_user_data


def print_user_metrics() -> None:
    print("User metrics")
    for d in get_user_data():
        print(d)
