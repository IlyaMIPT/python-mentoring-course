user_events = [
    'landing_page_displayed',
    'go_next_button_click',
    'banner_click',
    'registration_page_displayed',
    'enter_user_data',
    'enter_user_data',
    'enter_user_data',
    'submit_button_click',
    'user_data_submitted'
]

# был ли клик на баннер?
banner_click_count = 0
for ev in user_events:
    if ev == 'banner_click':
        banner_click_count += 1
if banner_click_count > 0:
    print("Banner was clicked")

# пользователь перешел на форму регистрации после клика на баннер?
for i in range(len(user_events) - 1):
    curr_event = user_events[i]
    next_event = user_events[i+1]
    if curr_event == 'banner_click' and next_event == 'registration_page_displayed':
        print("Banner button works")

# пользователь закрыл страницу в итоге?
if user_events[-1] == 'user_data_submitted':
    print('User data successfully inserted into our database')
