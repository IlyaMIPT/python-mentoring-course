# порядок поиска модулей
import sys
import app_stats

print("Module search paths")
for p in sys.path:
    print(p)
app_stats.display_activate_users()


# fmt: off
sys.path.append(
    "/Users/ilya_m/Github/AnalystKlondikeVideos/python-mentoring-course/17_modules/3_module_search")

import app_utils

print("Hello from my app")
app_utils.get_about()
