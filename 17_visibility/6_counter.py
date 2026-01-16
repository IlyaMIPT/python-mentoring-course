from typing import Callable


def _update_view(state: int) -> None:
    print("UI updated using new value: ", state)


def use_state(initial_value: int) -> tuple[int, Callable[[int], None]]:
    state = initial_value

    def _set_state(new_value: int) -> None:
        nonlocal state
        state = new_value
        _update_view(state)

    return state, _set_state


# store value in enclosing
counter, set_counter = use_state(10)
total_users, set_total_users = use_state(1234)
print("Counter is", counter)
set_counter(11)
set_total_users(5000)
