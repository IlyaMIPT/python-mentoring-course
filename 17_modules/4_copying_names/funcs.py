def print_about():
    print("About")


def print_stats():
    print("Here are your statistics")


def print_func_info():
    print("Function comments")
    if hasattr(print_about, "comment"):
        print("Function comment", print_about.comment)
    if hasattr(print_stats, "comment"):
        print("Function comment", print_stats.comment)
    print("End of function comments")
