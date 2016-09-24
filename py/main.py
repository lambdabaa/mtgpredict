from dictmap import dictmap
from firebase import firebase
import numpy as np
import records
import statsmodels.api as sm

db = firebase.FirebaseApplication('https://mtgbot.firebaseio.com', None)

# The feature vector looks like
# [age, age^2, avg price 30 months ago, 29, ..., 6 months ago]
# We are using 2 years of pricing data from 2y6m ago to
# 6m ago along with a label of the price 3m ago as training data.
def getFeatureVector(history):
    if not any(map(lambda r: records.getMonthsAgo(r) >= 30, history)):
        return None
    # The age is the month of the first record on history.
    age = records.getMonthsAgo(history[0])
    months = records.groupByMonth(history)
    vector = [age, age ** 2]
    for i in range(6, 30):
        # If there's a month we don't have on record, throw away this data.
        if not i in months:
            return None
        vector.append(months[i])
    return vector

# See how accurately our model can take 2 years of pricing data from 2y3m ago
# to 3m ago to predict the latest price.
def computeError(weights):
    def test(record):
        card = record['card']
        history = record['history']
        age = records.getMonthsAgo(history[0])
        months = records.groupByMonth(history)
        # Apply the linear model.
        result = weights[0] + weights[1] * age + weights[2] * (age ** 2)
        for i in range(0, 24):
            result += (weights[i + 3] * months[i + 3])
        # This is the real latest price.
        actual = months[0]
        # Compute how far off our prediction was from the actual price.
        error = abs((actual - result) / actual)
        return {
            'initial': months[3],
            'actual': actual,
            'expected': result,
            'error': error,
            'card': card['name'],
            'id': card['mwpId']}
    return test

# Fetch the price data for a card and transform it into a feature vector.
def cardToFeatureVector(card, cardId):
    # Query Firebase for all of the historical price data for this card.
    key = '/histories/' + str(cardId) + '/1/data'
    history = db.get(key, None)
    months = records.groupByMonth(history)
    vector = getFeatureVector(history)
    if vector != None:
        print card['name'], vector
    return {
        'card': card,
        'history': history,
        'vector': vector,
        'label': months[3]}

# Test the model on another set of data.
def inspectModel(data, weights, test):
     return map(test(weights), data)

def main():
    print 'Reading card data...'
    cards = db.get('/dumps/highvalue', None)

    print 'Preparing OLS input...'
    data = filter(lambda x: x['vector'] != None, dictmap(cardToFeatureVector, cards))

    print 'Input size: ' + str(len(data))
    results = np.array(map(lambda x: x['label'], data))
    inputs = np.array(map(lambda x: x['vector'], data))
    inputs = sm.add_constant(inputs)
    model = sm.OLS(results, inputs)

    print 'Fitting model...'
    fit = model.fit()
    print fit.summary()
    print fit.params

    print 'Computing results and error...'
    stats = inspectModel(data, fit.params, computeError)
    stats = filter(lambda x: x['expected'] > 0, stats)

    # CSV output that can be imported into excel/spreadsheets.
    print 'card, id, initial, actual, expected, error'
    for r in stats:
        print '"' + r['card'] + '", ' +  ', '.join(map(lambda x: str(x), [r['id'], r['initial'], r['actual'], r['expected'], r['error']]))
    error = sum(map(lambda x: x['error'], stats)) / len(stats)
    print 'Average error: ' + str(error)

if __name__ == '__main__':
    main()
