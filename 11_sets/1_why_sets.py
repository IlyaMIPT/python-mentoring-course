# множества - неупорядоченные последовательности неповторяющих элементов


viewer_rights = {"read", "sort"}
editor_rights = {"read", "edit_widget", "delete_widget", "rename"}
creator_rights = {"read", "edit_widget", "sort",
                  "delete_widget", "rename", "create dashboard", "delete dashboard"}

print("Обычный пользователь", viewer_rights)
print("Редактор дашборда", editor_rights)
print("Создатель дашбордов, максимальные права", creator_rights)

# множества используются ради операций с ними:

reader_and_writer = viewer_rights.union(editor_rights)
print("Обычный и редактор:", reader_and_writer)  # видим, что удалены дубликаты

super_user = viewer_rights.union(editor_rights).union(creator_rights)
print("Права суперпользователя", super_user)

# какие права есть у creator-а, но нет у viewer-а?
creator_diff = creator_rights.difference(viewer_rights)
print("Права, которые есть у creator-а, но нет у viewer:", creator_diff)
