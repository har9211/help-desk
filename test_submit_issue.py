import requests

# URL for the submit issue endpoint
url = "http://localhost:5000/submit"

# Test data for submission
test_data = [
    {"name": "John Doe", "issue": "Water supply issue", "file": None},
    {"name": "Jane Smith", "issue": "Electricity problem", "file": None},
    {"name": "", "issue": "Missing name", "file": None},
    {"name": "Alice", "issue": "", "file": None},
]

for data in test_data:
    response = requests.post(url, data=data)
    print(f"Submitting: {data}")
    print(f"Response: {response.text}\n")
