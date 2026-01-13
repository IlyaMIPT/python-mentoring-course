import funcs
from funcs import print_about


# add attribute to function object
funcs.print_stats.comment = "Print statistics"
funcs.print_about.comment = "Print about"
print_about.comment = "Hello, world"


funcs.print_stats()
funcs.print_about()
funcs.print_func_info()
