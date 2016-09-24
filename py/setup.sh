#!/bin/bash
virtualenv env
cd env && source bin/activate
cd ..
# Need to do this since pip is super dumb.
pip install numpy==1.11.1
pip install statsmodels==0.8.0rc1
pip install -r requirements.txt
