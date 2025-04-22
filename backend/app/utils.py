import os

def save_to_file(details, roadmap, folder="llm_values"):
    if not os.path.exists(folder):
        os.makedirs(folder)
    run_number = 1
    while os.path.exists(os.path.join(folder, f"run_{run_number}.txt")):
        run_number += 1
    filename = os.path.join(folder, f"run_{run_number}.txt")
    with open(filename, "w", encoding="utf-8") as file:
        file.write("Extracted Resume Details:\n")
        for key, value in details.items():
            file.write(f"{key.capitalize()}: {value}\n")
        file.write("\nGenerated Career Roadmap:\n")
        file.write(roadmap)
    print(f"Your Personalized Roadmap has been saved to '{filename}'.")
