#!/usr/bin/env python3
"""
Test script to verify chatbot functionality
"""

import sys
import os

# Add the all directory to the path so we can import chatbot
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'all'))

from chatbot import get_response

def test_chatbot():
    """Test the chatbot with various inputs"""
    
    test_cases = [
        "hello",
        "water problem",
        "electricity issue",
        "government scheme",
        "health services",
        "education support",
        "agriculture help",
        "road infrastructure",
        "banking services",
        "employment opportunities",
        "thank you",
        "random unknown query"
    ]
    
    print("Testing Chatbot Functionality")
    print("=" * 50)
    
    for query in test_cases:
        print(f"\nInput: '{query}'")
        response = get_response(query)
        print(f"Response: {response[:200]}...")  # Show first 200 chars
        print("-" * 50)
    
    print("\nChatbot test completed!")

if __name__ == "__main__":
    test_chatbot()
