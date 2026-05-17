import random

def generate_mock_prediction(data: dict) -> dict:
    """
    Since the user cannot run heavy ML models locally, this service generates 
    mathematically consistent mock data based on the health indicators provided.
    This simulates an XGBoost + SHAP pipeline.
    """
    
    # Simple heuristic to determine baseline risk
    risk_score = 0.0
    
    age = data.get("age", 50)
    trestbps = data.get("trestbps", 120)
    chol = data.get("chol", 200)
    thalach = data.get("thalach", 150)
    cp = data.get("cp", 0)
    exang = data.get("exang", 0)
    
    # Age factor
    if age > 60: risk_score += 0.2
    elif age > 45: risk_score += 0.1
    
    # Blood pressure
    if trestbps > 140: risk_score += 0.15
    elif trestbps > 130: risk_score += 0.05
    
    # Cholesterol
    if chol > 240: risk_score += 0.2
    elif chol > 200: risk_score += 0.1
    
    # Chest Pain type (0 is usually typical angina or asymptomatic which is bad in some datasets)
    if cp == 0: risk_score += 0.15
    
    # Exercise induced angina
    if exang == 1: risk_score += 0.15
    
    # Max heart rate (lower is worse generally for this test)
    if thalach < 120: risk_score += 0.1
    
    # Add some random noise to simulate model uncertainty
    risk_score += random.uniform(-0.05, 0.1)
    
    # Clamp between 0.05 and 0.95
    risk_score = max(0.05, min(0.95, risk_score))
    
    # Generate Mock SHAP values (feature importance)
    # SHAP values show how much each feature pushed the prediction away from the base value
    base_value = 0.35
    
    shap_values = [
        {"feature": "Age", "value": (age - 50) * 0.005},
        {"feature": "Cholesterol", "value": (chol - 200) * 0.002},
        {"feature": "Resting BP", "value": (trestbps - 120) * 0.003},
        {"feature": "Max Heart Rate", "value": (150 - thalach) * 0.002},
        {"feature": "Chest Pain Type", "value": 0.08 if cp == 0 else -0.04},
        {"feature": "Exercise Angina", "value": 0.09 if exang == 1 else -0.05},
        {"feature": "ST Depression", "value": data.get("oldpeak", 0) * 0.04},
    ]
    
    # Sort by absolute SHAP value (most important features first)
    shap_values.sort(key=lambda x: abs(x["value"]), reverse=True)
    
    # Generate personalized detailed recommendations
    recommendations = []
    
    if chol > 200:
        recommendations.append({
            "category": "Diet & Nutrition",
            "title": "Cholesterol Management Diet",
            "dos": [
                "Include fibrous vegetables like Bhindi (Okra) and Baingan.",
                "Eat green leafy vegetables (Palak, Methi, Sarson).",
                "Use healthy oils in moderation (Mustard oil, Olive oil).",
                "Consume whole grains (Oats, Bajra, Jowar Roti)."
            ],
            "donts": [
                "Avoid deep-fried Indian snacks (Samosa, Pakora, Kachori).",
                "Limit full-fat dairy (Malai, excessive Ghee, Butter).",
                "Avoid processed meats and packaged namkeens."
            ],
            "time_guide": "Have a light dinner at least 2 hours before sleeping."
        })
        
    if trestbps > 130:
        recommendations.append({
            "category": "Diet & Lifestyle",
            "title": "Blood Pressure Control",
            "dos": [
                "Increase potassium-rich foods (Bananas, Coconut water).",
                "Use herbs and spices (Jeera, Dhaniya) for flavor instead of extra salt.",
                "Practice mindful eating and chew food slowly."
            ],
            "donts": [
                "Strictly limit salt (Sodium) to less than 1500mg (about half a teaspoon) daily.",
                "Avoid extra salt on salads or curd (no Chaat Masala).",
                "Avoid pickles (Achar) and papads as they are very high in sodium."
            ],
            "time_guide": "Monitor blood pressure twice a week at the same time."
        })
        
    if exang == 1 or thalach < 130:
        recommendations.append({
            "category": "Exercise & Activity",
            "title": "Cardiovascular Conditioning",
            "dos": [
                "Brisk walking in the morning or evening.",
                "Light Yoga (Pranayama, Anulom Vilom) for breathing control.",
                "Swimming or cycling at a moderate pace."
            ],
            "donts": [
                "Avoid heavy weightlifting or intense isometric exercises.",
                "Do not exercise immediately after a heavy meal.",
                "Stop immediately if you feel chest discomfort or extreme breathlessness."
            ],
            "time_guide": "30-40 minutes per day, at least 5 days a week. Keep heart rate moderate."
        })
        
    if not recommendations:
        recommendations.append({
            "category": "General Health",
            "title": "Maintain Healthy Habits",
            "dos": [
                "Continue eating a balanced homemade Indian diet (Dal, Roti, Sabzi).",
                "Stay hydrated (8-10 glasses of water daily).",
                "Maintain regular physical activity."
            ],
            "donts": [
                "Do not start smoking or consuming excessive alcohol.",
                "Avoid taking extreme stress regarding work or life."
            ],
            "time_guide": "Sleep for 7-8 hours daily for proper recovery."
        })

    return {
        "risk_probability": round(risk_score, 3),
        "risk_percentage": round(risk_score * 100, 1),
        "is_high_risk": risk_score > 0.5,
        "shap_values": shap_values,
        "base_value": base_value,
        "recommendations": recommendations
    }
