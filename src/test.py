import requests

def fetch_programma(client_id):
    # Define the base URL of the API
    base_url = 'https://data.sportlink.com/programma'

    # Define the parameters for the request
    params = {
        'gebruiklokaleteamgegevens': 'NEE',
        'eigenwedstrijden': 'JA',
        'thuis': 'JA',
        'uit': 'NEE',
        'aantaldagen': 6,
        'client_id': client_id  # Use the provided client ID
    }

    # Make the GET request
    response = requests.get(base_url, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        return response.json()
    else:
        print(f'Error: {response.status_code}')
        return response.json()

# Example usage
client_id = 'your_client_id'  # Replace with actual client ID
data = fetch_programma(client_id)
print(data)