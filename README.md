# About

Site built using Flask and React using deezer's Spleeter library tool which splits audio tracks into seperate parts using machine learning (ex. Vocals and Production)

Using that tool, this site provides the user the easy ability to do karoake/to sing over their favourite songs which might not have
their instrumental available online and hear the results.

The process goes as follow:
1. User uploads their desired song as a .mp3
2. User waits for request to finish
3. User records themelves singing the lyrics (or other lyrics). They can listen to the song through headphones so the mic won't pick it up
4. User can listen to what they recorded and re-record their vocals if they didn't like it. Once they are satisfied, they submit
5. User waits for request to finish
6. User goes to a page where they can listen and download the song with their vocals over the instrumental of the song they uploaded.

# Installation

1. Create a virtual environment with Python 3.7
2. pip install -r requirements.txt
3. Follow additional installation requirements for spleeter here: https://github.com/deezer/spleeter
4. cd ./frontend
5. npm i

# Environment Variables

In .env in ./frontend:

    Required:

    REACT_APP_RESTAPI_URL

    ex. REACT_APP_RESTAPI_URL=http://127.0.0.1:5000

# Running the app

python -m flask run

and 

npm run start

# Maintenance

Run clearmusic.py to clear all files downloaded in ./music

Can add the script to a CRON job to run at certain intervals to avoid doing this manually