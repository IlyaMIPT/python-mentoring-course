stocks_usd = {
    'MSFT': 541,
    'IBM': 308,
    'TGT': 94,
    'NVDA': 207
}

euro_ex_rate = 1.1

stocks_eur = {c: p * euro_ex_rate for c, p in stocks_usd.items()}
print(stocks_eur)
