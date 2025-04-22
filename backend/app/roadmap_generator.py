from langchain_ollama import OllamaLLM
from langchain_ollama import OllamaEmbeddings
import re
from datetime import datetime


MODEL = "mistral"


model = OllamaLLM(
    model="mistral",
    temperature=0.4,     # This is for creativity
    top_p=0.95,          # Broder creativity, but still focused
    repeat_penalty=1.2,  # Helps avoid repetitive or redundant steps
)
embeddings = OllamaEmbeddings(model=MODEL)


def extract_years_from_experience(experience_entries):
    total_years = 0
    for entry in experience_entries:
        # Match date ranges like '01/2017 - 04/2022' or 'March 2017 - July 2022'
        match = re.search(r'(\d{1,2}[/-]?\d{4})\s*[-–]\s*(\d{1,2}[/-]?\d{4}|Present|Current)', entry)
        if match:
            start_date_str, end_date_str = match.groups()
            start_date = parse_date(start_date_str)
            end_date = parse_date(end_date_str)
            if start_date and end_date:
                total_years += (end_date - start_date).days / 365.25
    return total_years

def parse_date(date_str):
    # Try different date formats
    for fmt in ('%m/%Y', '%b %Y', '%B %Y'):
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    # Handle 'Present' or 'Current' as the current date
    if date_str in ['Present', 'Current']:
        return datetime.now()
    return None


def determine_levels(experience):
    # Count the number of years of experience
    total_years = 0
    for exp in experience:
        # Extract years from experience entries, assuming a format like "Software Engineer at XYZ (2015–2018)"
        years = extract_years_from_experience(exp)
        total_years += years

    # Determine current level based on total years
    if total_years < 2:
        current_level = "Entry-Level"
    elif total_years < 5:
        current_level = "Junior"
    elif total_years < 10:
        current_level = "Mid-Level"
    elif total_years < 15:
        current_level = "Senior"
    else:
        current_level = "Lead/Manager"

    # Set target level as one step above current level
    levels = ["Entry-Level", "Junior", "Mid-Level", "Senior", "Lead/Manager"]
    current_index = levels.index(current_level)
    if current_index + 1 < len(levels):
        target_level = levels[current_index + 1]
    else:
        target_level = current_level  # Already at highest level

    return current_level, target_level

def generate_roadmap_with_llama(skills, education, experience, goal="", learning_preference=""):
    skills_str = ", ".join(skills)
    education_str = "; ".join(education)
    experience_str = "; ".join(experience)
    experience_text = " ".join(experience)

    current_level, target_level = determine_levels(experience)
    # skill_levels = estimate_skill_levels(skills, experience_text)
    # skill_levels_str = ", ".join([f"{skill} ({level})" for skill, level in skill_levels.items()])

    prompt = f"""
    You are a professional career counselor. Your task is to guide individuals toward optimal career paths.

    Profile:
    - Current Level: {current_level}
    - Target Level: {target_level}
    - Education: {education_str}
    - Experience: {experience_str}
    - Goal: {goal or "Not specified"}
    - Learning Preference: {learning_preference or "No preference"}

    Please create a title and Current Level and Target Level ahead of the JSON file.

    Return a JSON array of roadmap milestones. Each milestone should include:
    - title
    - description
    - skills (array)   
    - resources (array of objects with:
        'title',     
        'type' [e.g., "Book", "Course", "Certification"], 
        'description' (brief reason why it's useful), 
        'link' (direct, official URL to the resource — prefer Coursera, edX, Udemy, YouTube, or publisher sites)
    )
    - estimated_duration (in weeks)
    - status (default to "upcoming")    

    Ensure the roadmap progresses logically from current to target level.
    Output ONLY valid JSON. No extra text or explanation.
    """

    response = model.invoke(prompt, system="You are a highly experienced career counselor and AI career path planner.")
    return response.strip()

