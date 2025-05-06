#!/usr/bin/env bash

# Source the .venv
source ".venv/bin/activate"

# Run the backend with waitress
exec waitress-serve --host 127.0.0.1 app:app


