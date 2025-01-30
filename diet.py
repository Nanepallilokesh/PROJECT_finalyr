import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

# Step 1: Load the dataset
df = pd.read_csv("donor_meals.csv")

# Step 2: Encode categorical variables
encoders = {}
for col in ["gender", "side_effects", "health_conditions", "preferences", "meal"]:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Step 3: Split features and target
X = df.drop("meal", axis=1)  # Features
y = df["meal"]               # Target (meal)

# Step 4: Split dataset into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 5: Train the Random Forest Classifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Step 6: Save the model and encoders
pickle.dump(model, open("donor_meal_model.pkl", "wb"))
for col, encoder in encoders.items():
    pickle.dump(encoder, open(f"{col}_encoder.pkl", "wb"))

print("Model and encoders saved successfully!")