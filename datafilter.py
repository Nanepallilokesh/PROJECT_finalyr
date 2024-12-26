import sqlite3
import mysql.connector
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sqlalchemy import create_engine

# Connect to SQLite (or replace this with your database connection)
# conn = sqlite3.connect('your_database.db')  # Replace with your database path
def match(targetBloodGroup,targetCity):
    #database Configuration
    db_config={
        'host':'localhost',
        'user':'root',
        'password':'Lokesh4321.',
        'database':'BloodDonation'
    }
    connection_string = f"mysql+mysqlconnector://{db_config['user']}:{db_config['password']}@{db_config['host']}/{db_config['database']}"
    engine = create_engine(connection_string)


    # Fetch records from the database using SQL query
    query = "SELECT username,city,email,blood_group FROM registered_users WHERE blood_group IS NOT NULL;"  # Replace with your actual SQL query
    df = pd.read_sql_query(query, engine)

    # Close the connection
    engine.dispose()

    #print(df)
    df = df.dropna(subset=['blood_group'])
    label_encoder = LabelEncoder()
    df['blood_group_encoded'] = label_encoder.fit_transform(df['blood_group'])

    #print(df)

    target_blood_group = targetBloodGroup

    print(f"Received targetBloodGroup: {targetBloodGroup}")
     # Ensure the targetBloodGroup is valid
    if targetBloodGroup is None:
        raise ValueError("Blood group cannot be None.")
    
    if targetBloodGroup not in label_encoder.classes_:
        raise ValueError(f"Blood group {targetBloodGroup} is invalid or not in the known labels.")

    target_label = label_encoder.transform([targetBloodGroup])[0]

    


    # print("1::",df['blood_group_encoded'].value_counts())
    # print("2::",df.head())
    # print("3::",df['blood_group_encoded'].unique())
    # Features and target
    X = df[['username', 'city', 'email']]  # Features
    y = df['blood_group_encoded']  # Target

    # One-Hot Encoding for categorical features (name, city)
    column_transformer = ColumnTransformer(
    transformers=[
        ('name_city', OneHotEncoder(), ['username', 'city', 'email'])
        ],
        remainder='passthrough'  # Keep the other columns as is
        )

    # Transform the features
    X_transformed = column_transformer.fit_transform(X)

    # Split the dataset
    X_train, X_test, y_train, y_test = train_test_split(X_transformed, y, test_size=0.2, random_state=42)

    # Train the SVM model
    svm_model = SVC(kernel='linear', random_state=42)
    svm_model.fit(X_train, y_train)

    # Make predictions
    y_pred = svm_model.predict(X_test)

    # Evaluate the model
    #print("Accuracy:", accuracy_score(y_test, y_pred))

    # Filter for a specific blood group (e.g., 'O+')
   
    #target_label = label_encoder.transform([target_blood_group])[0]

    # To filter, you need to predict for the original dataset
    X_full_transformed = column_transformer.transform(X)
    full_predictions = svm_model.predict(X_full_transformed)
    filtered_data = df[full_predictions == target_label]

    # Output filtered data
    #print(f"Filtered data for blood group {target_blood_group}:")
    #print(filtered_data)

    return filtered_data
