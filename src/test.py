import requests

# Define the base URL of the API
base_url = 'https://data.sportlink.com/programma'

# Define the parameters for the request
params = {
    'gebruiklokaleteamgegevens': 'NEE',
    'eigenwedstrijden': 'JA',
    'thuis': 'JA',
    'uit': 'NEE',
    'aantaldagen': 6,
    'client_id': 'your_client_id'  # Replace with actual client ID
}

# Make the GET request
response = requests.get(base_url, params=params)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f'Error: {response.status_code}')
    print(response.json())