def get_response(user_input):
    user_input = user_input.lower()
    if "water" in user_input:
        return "For water issues, contact Gram Panchayat or Jal Nigam."
    elif "electricity" in user_input or "bijli" in user_input:
        return "Electricity complaints can be registered at the local Bijli Board."
    elif "scheme" in user_input or "yojana" in user_input:
        return "You can check PM-Kisan, PMAY, and other schemes at https://www.india.gov.in"
    elif "health" in user_input:
        return "For health services, visit the nearest Primary Health Center (PHC)."
    else:
        return "Sorry, I couldn't understand. Please submit your issue for manual review."