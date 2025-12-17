# set comprehension:

dashboard_rights_ext = {"read", "edit", "create", "delete"}
dashboard_rights = {w[0] for w in dashboard_rights_ext}
print(dashboard_rights)
