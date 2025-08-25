import re
from datetime import datetime
import sqlite3
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db_connection():
    """Get a database connection for learning from past interactions"""
    try:
        conn = sqlite3.connect('database.db')
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        return None

def log_unanswered_query(user_input):
    """Log queries that couldn't be answered for future improvement"""
    conn = get_db_connection()
    if conn:
        try:
            c = conn.cursor()
            c.execute("CREATE TABLE IF NOT EXISTS unanswered_queries (id INTEGER PRIMARY KEY, query TEXT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
            c.execute("INSERT INTO unanswered_queries (query) VALUES (?)", (user_input,))
            conn.commit()
        except Exception as e:
            logger.error(f"Error logging unanswered query: {e}")
        finally:
            conn.close()

def get_response(user_input):
    user_input = user_input.lower().strip()
    
    # Enhanced greeting patterns with regex
    greeting_pattern = r'\b(hello|hi|hey|namaste|hola|good\s*(morning|afternoon|evening))\b'
    if re.search(greeting_pattern, user_input):
        return "Hello! Welcome to the Village Help Desk. How can I assist you with village-related issues today?"
    
    # Enhanced water issues with better pattern matching
    water_pattern = r'\b(water|pani|jal|drinking\s*water|water\s*supply|tap\s*water|well|handpump|pipeline)\b'
    if re.search(water_pattern, user_input):
        return """For water-related issues, here's what you can do:

🚰 **Immediate Actions:**
- Contact Gram Panchayat Office: 📞 1800-XXX-XXXX
- Jal Nigam Helpline: 📞 1916
- Local Water Supply Authority

📋 **Step-by-Step Process:**
1. Report the issue to your local Gram Panchayat
2. If unresolved within 48 hours, contact Block Development Officer
3. Escalate to District Water Department if needed

💧 **Emergency Contacts:**
- Water Tanker Request: 📞 1800-WATER-XX
- Pipeline Leakage: 📞 1916
- Water Quality Testing: Contact PHC

You can also submit a detailed complaint through our 'Submit an Issue' form with photos and location details."""
    
    # Enhanced electricity issues
    electricity_pattern = r'\b(electricity|bijli|power|light|current|transformer|line|wire|meter)\b'
    if re.search(electricity_pattern, user_input):
        return """For electricity problems, here are your options:

⚡ **Emergency Contacts:**
- Electricity Helpline: 📞 1912
- Transformer Complaint: 📞 1800-POWER-XX
- Line Fault: Contact local lineman

🏢 **Department Contacts:**
- Local Bijli Board Office
- Sub-station Incharge
- District Electricity Department

📱 **Digital Options:**
- Official Electricity App for outage reporting
- SMS-based complaint registration
- Online portal: https://bijli.gov.in

🔧 **Common Issues & Solutions:**
- No electricity: Check if neighbors have power, then call 1912
- Meter issues: Contact billing office
- Bill disputes: Visit customer care center

Submit detailed issues through our form for faster resolution."""
    
    # Enhanced government schemes with more details
    scheme_pattern = r'\b(scheme|yojana|government\s*scheme|benefit|subsidy|aid|assistance|program)\b'
    if re.search(scheme_pattern, user_input):
        schemes = [
            "🏠 **PMAY (Pradhan Mantri Awas Yojana)**: Housing for all - Eligibility: BPL families, Subsidy: Up to ₹2.5 lakh",
            "👨‍🌾 **PM-KISAN**: Financial support to farmers - ₹6000/year in 3 installments",
            "🏥 **Ayushman Bharat**: Health insurance - Coverage: ₹5 lakh/year for secondary & tertiary care",
            "🔥 **Ujjwala Yojana**: Free LPG connections - For women from BPL families",
            "👷 **MNREGA**: Employment guarantee - 100 days of unskilled work per year",
            "🎓 **Scholarships**: Various education scholarships - Visit https://scholarships.gov.in",
            "💼 **Startup India**: Support for entrepreneurs - Loans and mentorship"
        ]
        return f"""Available Government Schemes:\n\n""" + "\n".join([f"• {scheme}" for scheme in schemes]) + """

📋 **How to Apply:**
1. Visit https://www.india.gov.in for online applications
2. Contact Gram Panchayat for offline forms
3. Required documents: Aadhaar, Bank account, Income certificate

🏢 **Contact:**
- Block Development Office
- District Rural Development Agency
- Toll-free: 1800-11-0001"""
    
    # Enhanced health services with comprehensive information
    health_pattern = r'\b(health|swasthya|hospital|doctor|medical|clinic|ambulance|medicine|treatment|vaccine|patient)\b'
    if re.search(health_pattern, user_input):
        return """For health services and emergencies:

🏥 **Immediate Care:**
- Emergency Ambulance: 📞 108 (24x7)
- COVID Helpline: 📞 1075
- Mental Health Support: 📞 1800-599-0019
- Poison Control: 📞 1800-116-117

🏛️ **Healthcare Facilities:**
- Primary Health Center (PHC): Basic treatment & vaccinations
- Community Health Center: Emergency care & diagnostics
- District Hospital: Specialized treatment & surgery
- Ayushman Bharat Health Centers: Cashless treatment

💊 **Medical Services:**
- Free vaccinations and immunization camps
- Maternal and child care programs
- Chronic disease management (diabetes, hypertension)
- Emergency medical services and first aid

📋 **Health Schemes:**
- Ayushman Bharat Card: ₹5 lakh health insurance
- Free medicine distribution at PHCs
- Mobile medical units for remote areas
- Health camps for senior citizens

🩺 **Specialist Services:**
- Telemedicine consultations
- Diagnostic test facilities
- Dental and eye care camps
- Physiotherapy and rehabilitation

📞 **Helplines & Contacts:**
- Health Department: 📞 104
- Ambulance Emergency: 📞 108
- Medical Advice: 📞 1800-180-1104
- Blood Bank: Contact local hospital

Submit specific health-related issues through our form for personalized guidance and follow-up."""
    
    # Enhanced education with more practical information
    education_pattern = r'\b(school|education|padhai|teacher|student|college|admission|scholarship|exam)\b'
    if re.search(education_pattern, user_input):
        return """For education-related queries:

🏫 **School Education:**
- Admission queries: Contact school principal
- Mid-day meal issues: School administration
- Teacher complaints: Block Education Officer

🎓 **Higher Education:**
- College admissions: https://ugc.gov.in
- Scholarship portal: https://scholarships.gov.in
- Distance learning: IGNOU, NIOS

💰 **Financial Support:**
- Pre-matric scholarships for SC/ST/OBC
- Post-matric scholarships
- Merit-cum-means scholarships
- Student loan schemes

📚 **Special Programs:**
- Digital literacy programs
- Vocational training courses
- Adult education centers

📞 **Helplines:**
- Education Department: 📞 1800-XXX-XXXX
- Scholarship queries: 📞 14417
- Exam related: Contact respective board"""
    
    # Enhanced agriculture with seasonal advice
    agriculture_pattern = r'\b(crop|kheti|farmer|agriculture|mandi|krishi|soil|fertilizer|seed|irrigation)\b'
    if re.search(agriculture_pattern, user_input):
        return """Agricultural support and information:

🌾 **Department Contacts:**
- Krishi Vigyan Kendra (KVK) - Farming advice & training
- Agriculture Department - Subsidies & schemes
- Soil Testing Lab - Soil health cards

📊 **Mandi Information:**
- Daily market prices: https://agmarknet.gov.in
- MSP information for various crops
- Online trading platforms

💧 **Irrigation Support:**
- Tube well installation subsidies
- Drip irrigation schemes
- Water conservation programs

🌱 **Input Resources:**
- Quality seeds from certified dealers
- Fertilizer subsidies through Kisan Credit Card
- Farm machinery rental services

📱 **Digital Services:**
- Kisan Call Center: 📞 1551
- mKisan portal for advisories
- Weather forecasts for farming

🚜 **Emergency Support:**
- Crop insurance claims
- Disaster relief for affected farmers
- Animal husbandry services"""
    
    # Enhanced infrastructure with specific contacts
    infrastructure_pattern = r'\b(road|sadak|bridge|construction|infrastructure|drain|building|repair|maintenance)\b'
    if re.search(infrastructure_pattern, user_input):
        return """For road and infrastructure issues:

🛣️ **Road Maintenance:**
- Village roads: Gram Panchayat
- Main roads: PWD Department
- Highway issues: NHAI

🏗️ **New Construction:**
- Building permits: Gram Panchayat/BDO
- Housing schemes: PMAY portal
- Public facilities: Rural Development Department

🚧 **Complaint Process:**
1. Report to local Gram Panchayat
2. Escalate to Block Development Officer
3. District-level complaints: Collector Office

📞 **Emergency Contacts:**
- Road damage emergency: 📞 1070
- Bridge safety: PWD helpline
- Construction complaints: 📞 1800-CONST-XX

📍 **Please provide:**
- Exact location with landmarks
- Photos of the issue
- Type of problem (potholes, drainage, etc.)

Use our 'Submit an Issue' form for detailed reporting with location."""
    
    # Enhanced financial services with banking details
    finance_pattern = r'\b(bank|loan|money|finance|bima|insurance|account|savings|credit|debit)\b'
    if re.search(finance_pattern, user_input):
        return """Financial services and banking support:

🏦 **Banking Services:**
- PM Jan Dhan Yojana: Zero balance accounts
- Kisan Credit Card: Farming loans
- Post Office Savings: Various schemes
- Microfinance: Small business loans

💰 **Loan Options:**
- Agriculture loans: Up to ₹3 lakh at 4% interest
- Education loans: Subsidized rates
- Housing loans: Under PMAY scheme
- Business loans: Mudra scheme

🛡️ **Insurance Schemes:**
- Crop insurance: PMFBY
- Health insurance: Ayushman Bharat
- Life insurance: PMJJBY, PMSBY
- Accident insurance: Pradhan Mantri Suraksha Bima

📱 **Digital Banking:**
- UPI payments: BHIM, PhonePe, Google Pay
- AePS: Aadhaar enabled banking
- Mobile banking apps
- Internet banking facilities

📞 **Helplines:**
- Banking complaints: 📞 14440
- Insurance queries: 📞 1800-XXX-XXXX
- Loan assistance: Bank helplines

💡 **Financial Literacy:**
- Village financial literacy camps
- Banking correspondent services
- Digital payment training"""
    
    # Enhanced employment opportunities
    employment_pattern = r'\b(job|employment|rozgar|work|naukri|skill|training|vacancy|career)\b'
    if re.search(employment_pattern, user_input):
        return """Employment and skill development opportunities:

👷 **Government Employment:**
- MNREGA: 100 days guaranteed work
- Rozgar Mela: Government job fairs
- Police/army recruitment drives
- Anganwadi worker positions

🎓 **Skill Development:**
- PMKVY: Free skill training programs
- ITI courses: Technical training
- Digital literacy programs
- Vocational training centers

💼 **Self-Employment:**
- Mudra loans: Up to ₹10 lakh
- Startup India: Entrepreneurship support
- PMEGP: Micro enterprise scheme
- Village industry schemes

📋 **Job Portals:**
- National Career Service: https://ncs.gov.in
- State employment exchange
- Private job portals
- Local industry vacancies

📞 **Helplines:**
- Employment queries: 📞 1800-XXX-XXXX
- Skill development: 📞 1800-102-8018
- MNREGA complaints: 📞 1800-11-6446

🏢 **Local Opportunities:**
- Check Gram Panchayat notice board
- Local industry requirements
- Seasonal agricultural work
- Construction labor opportunities"""
    
    # Enhanced general help with comprehensive overview
    help_pattern = r'\b(help|assistance|support|problem|issue|guide|information|query|question)\b'
    if re.search(help_pattern, user_input):
        return """I'm here to help you with various village-related issues! Here's what I can assist with:

🌊 **Water Issues:**
- Drinking water supply problems
- Pipeline leaks and repairs
- Water quality testing
- Tanker requests

⚡ **Electricity Problems:**
- Power outages and restoration
- Transformer complaints
- Meter and billing issues
- New connection requests

🏛️ **Government Schemes:**
- Housing schemes (PMAY)
- Farmer support (PM-KISAN)
- Health insurance (Ayushman Bharat)
- Employment guarantee (MNREGA)

🏥 **Health Services:**
- Primary health centers
- Emergency ambulance services
- Health camps and vaccinations
- Medical treatment facilities

🎓 **Education Support:**
- School admissions
- Scholarship information
- Skill development programs
- Educational resources

🌾 **Agricultural Assistance:**
- Farming advice and training
- Market price information
- Irrigation support
- Crop insurance claims

🛣️ **Infrastructure Issues:**
- Road repairs and maintenance
- Bridge construction
- Building permits
- Public facility complaints

💰 **Financial Services:**
- Banking and loan facilities
- Insurance schemes
- Digital payment assistance
- Financial literacy programs

💼 **Employment Opportunities:**
- Job vacancies
- Skill training programs
- Self-employment schemes
- Government job information

📋 **How to get help:**
1. Be specific about your issue
2. Use the 'Submit an Issue' form for detailed problems
3. Contact relevant departments directly
4. Visit Gram Panchayat for local issues

I'm here 24/7 to guide you to the right resources and solutions!"""
    
    # Thank you responses
    if any(word in user_input for word in ['thank', 'thanks', 'dhanyavad', 'shukriya']):
        return "You're welcome! Is there anything else I can help you with today?"
    
    # Default response for unrecognized queries
    return "I'm not sure I understand your query. Could you please provide more details?\n\nIf this is a specific issue, I recommend:\n1. Using the 'Submit an Issue' form for detailed problems\n2. Contacting the relevant department directly\n3. Visiting the Gram Panchayat office\n\nI'm here to help with village-related concerns like water, electricity, schemes, health, education, and more."
