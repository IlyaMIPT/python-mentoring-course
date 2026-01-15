from . import utils
from .db.driver_helpers import check_drivers


def print_driver_metrics() -> None:
    print("Driver metrics")
    check_drivers()
    for d in utils.get_driver_data():
        print(d)
