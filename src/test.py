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

def fetch_wedstrijdgegevens(wedstrijdcode, client_id):
    # Define the base URL of the API
    base_url = 'https://data.sportlink.com/wedstrijd-informatie'

    # Define the parameters for the request
    params = {
        'wedstrijdcode': wedstrijdcode,
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

from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/programma', methods=['GET'])
def get_programma():
    client_id = request.args.get('client_id')
    if not client_id:
        return jsonify({'error': 'client_id is required'}), 400

    data = fetch_programma(client_id)
    return jsonify(data)

@app.route('/api/wedstrijdgegevens', methods=['GET'])
def get_wedstrijdgegevens():
    wedstrijdcode = request.args.get('wedstrijdcode')
    client_id = request.args.get('client_id')
    if not wedstrijdcode or not client_id:
        return jsonify({'error': 'wedstrijdcode and client_id are required'}), 400

    data = fetch_wedstrijdgegevens(wedstrijdcode, client_id)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)