import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';

const App = () => {
  const [goldValue, setGoldValue] = useState('');
  const [silverValue, setSilverValue] = useState('');
  const [cashValue, setCashValue] = useState('');
  const [otherAssetsValue, setOtherAssetsValue] = useState('');
  const [totalZakat, setTotalZakat] = useState(0);
  const [totalZakatMessage, setTotalZakatMessage] = useState('');
  const [totalGoldValue, setTotalGoldValue] = useState(0); // Define totalGoldValue
  const [totalSilverValue, setTotalSilverValue] = useState(0);
  const [totalGoldAssets, setTotalGoldAssets] = useState(0); // Define totalGoldAssets
const [totalSilverAssets, setTotalSilverAssets] = useState(0);


const calculateZakat = async () => {
  if (!goldValue && !silverValue && !cashValue && !otherAssetsValue) {
    showAlert("Validation Error", "Please enter at least one asset value.");
    return;
  }

  const goldPricePerGram = 6376.21; // Current gold price per gram
  const silverPricePerGram = 70.38; // Current silver price per gram
  const totalGoldValue = parseFloat(goldValue) || 0;
  const totalSilverValue = parseFloat(silverValue) || 0;
  const totalCashValue = parseFloat(cashValue) || 0;
  const totalOtherAssetsValue = parseFloat(otherAssetsValue) || 0;
  const totalGoldAssets = totalGoldValue * goldPricePerGram; // Update totalGoldAssets
  const totalSilverAssets = totalSilverValue * silverPricePerGram;
  let zakat = 0;

  if (totalGoldValue > 0) {
    var goldZakat = calculateGoldZakat(totalGoldAssets, totalGoldValue);
    zakat += goldZakat;
  }

  if (totalSilverValue > 0) {
    var silverZakat = calculateSilverZakat(totalSilverAssets, totalSilverValue);
    zakat += silverZakat;
  }

  if (totalCashValue && totalCashValue >= 44030) {
    zakat += 1100.75 + ((totalCashValue - 44030) * 0.025);
  } else if (totalCashValue > 0 && totalCashValue < 44030) {
    showAlert("Cash Zakat", `Your ${totalCashValue} amount is less than 44,030.00. It is advisable to give more to those in need.`);
  }

  // Calculate zakat for other assets
  zakat += totalOtherAssetsValue * 0.025;

  setTotalZakat(zakat + goldZakat + silverZakat);
  setTotalZakatMessage(""); // Reset message
};


  const calculateGoldZakat = (totalGoldAssets, totalGoldValue, isPureGold) => {
    let zakat = 0;
    if (totalGoldValue >= 85) {
      const additionalGrams = totalGoldValue - 85;
      if (isPureGold) {
        zakat = 13472.50 + additionalGrams * 158.50; // Base Zakat for the first 85 grams + Zakat for additional grams (pure gold)
      } else {
        zakat = 10149.00 + Math.ceil(additionalGrams) * 119.40; // Base Zakat for jewelry + Zakat for additional grams (jewelry)
      }
    } else {
      zakat = 0; // No Zakat for less than 85 grams
    }
    return zakat;
  };
  


  const calculateSilverZakat = (totalSilverAssets, totalSilverValue,isPureSilver) => {
    let zakat = 0;
    if (totalSilverValue >= 595) {
      const additionalGrams = totalSilverValue - 595;
      if (isPureSilver) {
        zakat = 1100.75+ additionalGrams * 18.50; // Base Zakat for the first 85 grams + Zakat for additional grams (pure gold)
      } else {
        zakat = 520.62 + additionalGrams * 8.74; // Base Zakat for jewelry + Zakat for additional grams (jewelry)
      }
    } else {
      zakat = 0; // No Zakat for less than 85 grams
    }
    return zakat;
  };

  const showAlert = (title, message) => {
    Alert.alert(title, message);
  };

  const checkGoldZakat = () => {
    if (totalGoldValue > 0) {
      if (totalGoldValue < 85) {
        showAlert("Gold Zakat", "Gold value must be 85 grams or more for Zakat calculation.");
        return;
      }
  
      Alert.alert(
        "Gold Zakat",
        "Has your gold passed one year?",
        [
          {
            text: "Yes",
            onPress: () => {
              Alert.alert(
                "Gold Zakat",
                "Is your gold pure or jewelry?",
                [
                  {
                    text: "Pure Gold",
                    onPress: () => {
                      const goldZakat = calculateGoldZakat(totalGoldAssets, totalGoldValue, true);
                      setTotalZakat(goldZakat);
                    },
                  },
                  {
                    text: "Jewelry",
                    onPress: () => {
                      const jewelryZakat = calculateGoldZakat(totalGoldAssets, totalGoldValue, false);
                      setTotalZakat(jewelryZakat);
                    },
                  },
                ],
                { cancelable: false }
              );
            },
          },
          {
            text: "No",
            onPress: () => {
              setTotalZakat(0);
            },
          },
        ],
        { cancelable: false }
      );
    }
  };


  const checkSilverZakat = () => {
    if (totalSilverValue > 0) {
      if (totalSilverValue < 595) {
        showAlert("Silver Zakat", "Silver value must be 595 grams or more for Zakat calculation.");
        return;
      }
  
      Alert.alert(
        "Silver Zakat",
        "Has your Silver passed one year?",
        [
          {
            text: "Yes",
            onPress: () => {
              Alert.alert(
                "Silver Zakat",
                "Is your Silver pure or jewelry?",
                [
                  {
                    text: "Pure Silver",
                    onPress: () => {
                      const silverZakat = calculateSilverZakat(totalSilverAssets, totalSilverValue, true);
                      setTotalZakat(silverZakat);
                    },
                  },
                  {
                    text: "Jewelry",
                    onPress: () => {
                      const jewelryZakat = calculateSilverZakat(totalSilverAssets, totalSilverValue, false);
                      setTotalZakat(jewelryZakat);
                    },
                  },
                ],
                { cancelable: false }
              );
            },
          },
          {
            text: "No",
            onPress: () => {
              setTotalZakat(0);
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Zakat Calculator</Text>
      <Text style={styles.label}>Gold Value (in grams):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={goldValue}
        onChangeText={(value) => {
          setGoldValue(value);
          setTotalGoldValue(parseFloat(value) || 0); // Update totalGoldValue
        }}
        placeholder="Enter gold value"
        onBlur={checkGoldZakat}
      />
      <Text style={styles.label}>Silver Value (in grams):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={silverValue}
        onChangeText={(value) => {
          setSilverValue(value);
          setTotalSilverValue(parseFloat(value) || 0); // Update totalGoldValue
        }}
        placeholder="Enter silver value"
        onBlur={checkSilverZakat}
      />
      <Text style={styles.label}>Cash Value:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={cashValue}
        onChangeText={setCashValue}
        placeholder="Enter cash value"
      />
      <Text style={styles.label}>Other Assets Value:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={otherAssetsValue}
        onChangeText={setOtherAssetsValue}
        placeholder="Enter other assets value"
      />
      <Button
        title="Calculate Zakat"
        onPress={calculateZakat}
        color="#573e9e" // Blue color
      />
      <Text style={styles.result}>Total Zakat: {totalZakat.toFixed(2)}</Text>
      <Text style={styles.message}>{totalZakatMessage}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff', // White background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#573e9e', // Purple color
    textAlign: 'center', // Center align text
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#573e9e', // Purple color
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9', // Light gray background
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#573e9e', // Purple color
    textAlign: 'center', // Center align text
  },
  message: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    textAlign: 'center', // Center align text
  },
});

export default App;
