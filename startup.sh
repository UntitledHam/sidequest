# Change working directory to the path of sidequest.
cd "$(dirname "$0")"; 

# Source the .venv
source ".venv/bin/activate";

# Run the program 
waitress-serve --host 127.0.0.1 app:app;
