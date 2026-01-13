import funcs
from funcs import print_about

import funcs as functions
from funcs import print_about as about_print_function

# add attribute to function object
funcs.print_stats.comment = "Print statistics"
funcs.print_about.comment = "Print about"
print_about.comment = "Hello, world"

funcs.print_stats()
funcs.print_about()
funcs.print_func_info()

# use aliases
print("Use aliases")
functions.print_about()
about_print_function()
