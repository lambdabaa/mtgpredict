### Getting started

You can setup to build the model locally by running `./setup.sh`. That
should create a folder named `env` that's a virtual container for all
of the python packages. If you open a new terminal session later, you'll
need to activate the virtualenv by doing

```
cd env
source bin/activate
cd ..
```

before running the program.

### Building the model

Run `python main.py`. That program will download all of the training and
test data from Firebase and run OLS on the data.

### Quirks

If you see

```
requests.exceptions.ConnectionError:
HTTPSConnectionPool(host='mtgbot.firebaseio.com', port=443): Max retries
exceeded with url: /histories/21663/1/data/.json (Caused by <class
'httplib.BadStatusLine'>: '')
```

just run the program again. The python database client can be flakey.

Watch out for random `*.pyc` files showing up when making changes to the
source code in case old compiled code is being run instead of your code.
