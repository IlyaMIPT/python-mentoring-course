# убрать ненужные символы из строки

downloaded_manifest = "прdивеdxт, я готqов усердrно заниxматsься программирова_н1ием"

# создадим строку - алфавит символов, в которой будут только допустимые символы
alphabet = "абвгдеёжзиклмнопрстуфхцчшщъыяэюя "

filtered_manifest = ""
for s in downloaded_manifest:
    if s in alphabet:
        filtered_manifest += s

print(filtered_manifest)
