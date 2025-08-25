import re
from datetime import datetime

def get_response(user_input):
    user_input = user_input.lower().strip()
    
    # Greetings
    if any(word in user_input for word in ['hello', 'hi', 'hey', 'namaste', 'hola']):
        return "Hello! How can I help you with village-related issues today?"
    
    # Water issues
    if any(word in user_input for word in ['water', 'pani', 'jal', 'drinking water', 'water supply']):
        return "For water issues, please contact:\n- Gram Panchayat Office\n- Jal Nigam Department\n- Local Water Supply Authority\nYou can also submit a formal complaint through our 'Submit an Issue' form."
    
    # Electricity issues
    if any(word in user_input for word in ['electricity', 'bijli', 'power', 'light', 'current']):
        return "For electricity problems:\n- Contact your local Bijli Board Office\n- Call the electricity helpline: 1912\n- Report outages through the official app\nYou can also submit detailed issues through our form."
    
    # Government schemes
    if any(word in user_input for word in ['scheme', 'yojana', 'government scheme', 'benefit', 'subsidy']):
        schemes = [
            "PM-KISAN: Financial support to farmers",
            "PMAY: Housing for all",
            "Ayushman Bharat: Health insurance",
            "Ujjwala Yojana: LPG connections",
            "MNREGA: Employment guarantee"
        ]
        return f"Available government schemes:\n" + "\n".join([f"• {scheme}" for scheme in schemes]) + "\n\nVisit https://www.india.gov.in for more details and eligibility criteria."
    
    # Health services
    if any(word in user_input for word in ['health', 'swasthya', 'hospital', 'doctor', 'medical', 'clinic']):
        return "For health services:\n- Visit nearest Primary Health Center (PHC)\n- Community Health Center for emergencies\n- Ayushman Bharat health centers\n- Call 108 for ambulance services\n\nSubmit specific health-related issues through our form."
    
    # Education
    if any(word in user_input for word in ['school', 'education', 'padhai', 'teacher', 'student']):
        return "For education-related queries:\n- Contact local school administration\n- District Education Office\n- Scholarship information at https://scholarships.gov.in\n- Mid-day meal program queries"
    
    # Agriculture
    if any(word in user_input for word in ['crop', 'kheti', 'farmer', 'agriculture', 'mandi', 'krishi']):
        return "Agricultural support:\n- Krishi Vigyan Kendra for farming advice\n- Agriculture Department for subsidies\n- Mandi prices and information\n- Soil testing facilities\n- Weather advisory services"
    
    # Road and infrastructure
    if any(word in user_input for word in ['road', 'sadak', 'bridge', 'construction', 'infrastructure']):
        return "For road and infrastructure issues:\n- Gram Panchayat for village roads\n- PWD Department for main roads\n- Report through the 'Submit an Issue' form with location details"
    
    # Financial services
    if any(word in user_input for word in ['bank', 'loan', 'money', 'finance', 'bima', 'insurance']):
        return "Financial services:\n- Local bank branches for accounts/loans\n- Post office savings schemes\n- PM Jan Dhan Yojana for banking\n- Crop insurance schemes\n- Microfinance options"
    
    # Employment
    if any(word in user_input for word in ['job', 'employment', 'rozgar', 'work', 'naukri']):
        return "Employment opportunities:\n- MNREGA for rural employment\n- Skill development programs\n- Local employment exchange\n- Self-employment schemes\n- Visit https://ncs.gov.in for more options"
    
    # General help
    if any(word in user_input for word in ['help', 'assistance', 'support', 'problem', 'issue']):
        return "I can help you with various village-related issues including:\n- Water and electricity problems\n- Government schemes information\n- Health and education services\n- Agricultural support\n- Infrastructure issues\n\nPlease be specific about your concern, or use the 'Submit an Issue' form for detailed problems."
    
    # Thank you responses
    if any(word in user_input for word in ['thank', 'thanks', 'dhanyavad', 'shukriya']):
        return "You're welcome! Is there anything else I can help you with today?"
    
    # Default response for unrecognized queries
    return "I'm not sure I understand your query. Could you please provide more details?\n\nIf this is a specific issue, I recommend:\n1. Using the 'Submit an Issue' form for detailed problems\n2. Contacting the relevant department directly\n3. Visiting the Gram Panchayat office\n\nI'm here to help with village-related concerns like water, electricity, schemes, health, education, and more."
