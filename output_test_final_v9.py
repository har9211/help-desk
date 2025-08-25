print("Testing output visibility...")
print("This should be visible in the terminal")
print("If you can see this, the output is working")

# Test chatbot import
try:
    from all.chatbot import get_response
    response = get_response("water problem")
    print(f"Chatbot response: {response[:50]}...")
    print("Chatbot import successful")
except Exception as e:
    print(f"Chatbot import failed: {e}")

# Test database existence
import os
db_exists = os.path.exists('all/database.db')
print(f"Database exists: {db_exists}")

# Additional output to confirm script execution
print("Script execution completed.")
