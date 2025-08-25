#!/usr/bin/env python3
import chatbot

def test_responses():
    test_cases = [
        "health services",
        "crop farming",
        "bank loan",
        "electricity problem",
        "government schemes",
        "education scholarship",
        "road repair",
        "employment opportunities",
        "help me",
        "thank you"
    ]
    
    print("Testing Enhanced Village Help Desk Chatbot\n" + "="*50)
    
    for query in test_cases:
        print(f"\nQuery: '{query}'")
        print("-" * 30)
        response = chatbot.get_response(query)
        print(response)
        print("-" * 50)

if __name__ == "__main__":
    test_responses()
