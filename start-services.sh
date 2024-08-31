#!/bin/bash
cd /usr/src/app/invoice-service && npm run start:dev &
cd /usr/src/app/email-sender && node dist/main.js