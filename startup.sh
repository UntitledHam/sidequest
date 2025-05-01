#!/usr/bin/env bash

# Source the .venv
source ".venv/bin/activate"

# Run the program 
exec waitress-serve --host 127.0.0.1 app:app
