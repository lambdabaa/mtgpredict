# Like map() except that it operates on dictionaries instead of lists.
def dictmap(fn, data):
    result = []
    for key, value in data.items():
        result.append(fn(value, key))
    return result
