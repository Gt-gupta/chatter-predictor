import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import RandomOverSampler
import joblib  # Added import

# Load data
data = pd.read_csv("chatter_dataset.csv")  # Columns: rpm, doc, feed, chatter

# Encode target
label_encoder = LabelEncoder()
data['label_encoded'] = label_encoder.fit_transform(data['chatter'])

# Features and target
X = data[['rpm', 'doc', 'feed']]
y = data['label_encoded']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Check imbalance
print("Before Oversampling:\n", y_train.value_counts())

# Apply Random Oversampling
ros = RandomOverSampler(random_state=42)
X_train_ros, y_train_ros = ros.fit_resample(X_train, y_train)

# Check new balance
print("After Oversampling:\n", y_train_ros.value_counts())

# Train KNN
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train_ros, y_train_ros)

# Evaluate
accuracy = knn.score(X_test, y_test)
print(f"KNN Accuracy: {accuracy * 100:.2f}%")

# === Add Model Saving Here ===
# Save all required components
joblib.dump(knn, 'knn_model.pkl')
joblib.dump(label_encoder, 'label_encoder.pkl')
joblib.dump(ros, 'oversampler.pkl')
joblib.dump(X.columns.tolist(), 'feature_columns.pkl')
# =============================

# Predict new input
new_input = pd.DataFrame([[250, 5, 0.64]], columns=['rpm', 'doc', 'feed'])
prediction = knn.predict(new_input)[0]
label = label_encoder.inverse_transform([prediction])[0]
print(f"Prediction for (250, 5, 0.64): {label}")