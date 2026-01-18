def find_users(all_users: dict[str, str], *users_ids):
    found = {}
    for uid in users_ids:
        if uid in all_users:
            found[uid] = all_users[uid]
    return found


all_users = {
    'abs': 'abs@mail.ru',
    'def': 'def@mail.ru',
    'xyz': 'def@mail.ru'
}
