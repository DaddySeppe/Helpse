name: Deploy to Homeserver

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: self-hosted

    steps:
      - name: Deploy Helpse
        run: /home/sv/deploy-helpse.sh
