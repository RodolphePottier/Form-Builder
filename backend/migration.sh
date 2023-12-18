#!/bin/bash

npx mikro-orm migration:create
npx mikro-orm migration:up

npm start
