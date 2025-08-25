from all.chatbot import get_response

# Test queries for the chatbot
test_queries = [
    "water problem",
    "electricity issue",
    "government schemes",
    "health services",
    "education support",
    "agriculture help",
    "road infrastructure",
    "banking services",
    "employment opportunities",
    "thank you",
    "hello",
    "help me",
    "unknown query"
]

print("Testing Chatbot Responses:\n")
for query in test_queries:
    response = get_response(query)
    print(f"Query: '{query}'")
    print(f"Response: {response[:100]}...")  # Show first 100 characters
    print("-" * 50)
