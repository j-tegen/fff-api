#!/bin/bash

sh wait-for.sh db:5432 && npm run start:dev
