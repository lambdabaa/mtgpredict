# A record is structured like [timestamp, price].
import math
import time

now = 1000 * time.time()
month = 30 * 24 * 60 * 60 * 1000

# Bucket a record's timestamp into a month.
def getMonthsAgo(record):
    return math.floor((now - record[0]) / month)

# Get the average price for each month on record in history.
def groupByMonth(records):
    result = {}
    for record in records:
        month = getMonthsAgo(record)
        if not month in result:
            result[month] = []
        result[month].append(record[1])
    for key in result:
        value = result[key]
        result[key] = sum(value) / len(value)
    return result
