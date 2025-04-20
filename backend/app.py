# from flask import Flask, request, jsonify
# import joblib
# import pandas as pd
# from flask_cors import CORS
# import pandas as pd
# from sklearn.neighbors import KNeighborsClassifier
# from sklearn.preprocessing import LabelEncoder
# from sklearn.model_selection import train_test_split
# from imblearn.over_sampling import RandomOverSampler

# app = Flask(__name__)
# CORS(app)  # Enable Cross-Origin Resource Sharing

# # Load all components
# # try:
# #     model = joblib.load('ml_model/knn_model.pkl')
# #     label_encoder = joblib.load('ml_model/label_encoder.pkl')
# #     feature_columns = joblib.load('ml_model/feature_columns.pkl')
# #     print("Loading succesful")
# # except Exception as e:
# #     print(f"Error loading model: {str(e)}")

# data = pd.read_csv("chatter_dataset.csv")  # Columns: rpm, doc, feed, chatter

# # Encode target
# label_encoder = LabelEncoder()
# data['label_encoded'] = label_encoder.fit_transform(data['chatter'])

# # Features and target
# X = data[['rpm', 'doc', 'feed']]
# y = data['label_encoded']

# # Train-test split
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Check imbalance
# print("Before Oversampling:\n", y_train.value_counts())

# # Apply Random Oversampling
# ros = RandomOverSampler(random_state=42)
# X_train_ros, y_train_ros = ros.fit_resample(X_train, y_train)

# # Check new balance
# print("After Oversampling:\n", y_train_ros.value_counts())

# # Train KNN
# knn = KNeighborsClassifier(n_neighbors=3)
# knn.fit(X_train_ros, y_train_ros)

# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         # Get JSON data
#         data = request.json
        
#         # Validate input
#         if not all(key in data for key in ['rpm', 'doc', 'feed']):
#             return jsonify({'error': 'Missing parameters'}), 400
            
#         # Create DataFrame with correct feature order
#         input_data = pd.DataFrame([[
#             data['rpm'],
#             data['doc'],
#             data['feed']
#         ]], columns=['rpm', 'doc', 'feed'])

#         # Make prediction
#         prediction = knn.predict(input_data)[0]
        
#         return jsonify({
#             'prediction': label_encoder.inverse_transform([prediction])[0],
#         })

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)

from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import RandomOverSampler

app = Flask(__name__)  # Fixed double underscores
CORS(app)

# Load and prepare data
data = pd.read_csv("chatter_dataset.csv")
label_encoder = LabelEncoder()
data['label_encoded'] = label_encoder.fit_transform(data['chatter'])

# Define features and target
X = data[['rpm', 'doc', 'feed']]
y = data['label_encoded']
feature_columns = X.columns.tolist()  # Added feature columns definition

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
ros = RandomOverSampler(random_state=42)
X_train_ros, y_train_ros = ros.fit_resample(X_train, y_train)
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train_ros, y_train_ros)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not all(key in data for key in ['rpm', 'doc', 'feed']):
            return jsonify({'error': 'Missing parameters'}), 400

        # Convert to floats to ensure proper data types
        input_data = pd.DataFrame([[
            float(data['rpm']),
            float(data['doc']),
            float(data['feed'])
        ]], columns=feature_columns)

        prediction = knn.predict(input_data)[0]
        print("Chatter is" , label_encoder.inverse_transform([prediction])[0])
        chatter = label_encoder.inverse_transform([prediction])[0]
        return jsonify({
            'prediction': str(label_encoder.inverse_transform([prediction])[0])
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':  # Fixed double underscores
    app.run(host='0.0.0.0', port=5001, debug=True)