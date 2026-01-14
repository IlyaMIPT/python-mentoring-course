from pathlib import Path


script_dir = Path(__file__).parent
file_path = script_dir / Path('./data.txt')

with open(file_path, encoding='UTF-8') as f:
    line1 = f.__next__()
    line2 = f.__next__()
    line3 = next(f)
    line4 = next(f)
    # line5 = next(f) # here we have StopIteration
    print(line1, line2)
