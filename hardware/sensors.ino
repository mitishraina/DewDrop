#define PH_SENSOR_PIN 34   // ADC pin for pH sensor
#define TDS_SENSOR_PIN 35  // ADC pin for TDS sensor

float voltageToPH(float voltage) {
    // Calibration formula (modify based on your calibration)
    return (3.5 * voltage) + 0.1;  // Example conversion
}

float voltageToTDS(float voltage) {
    float TDS = (133.42 * voltage * voltage * voltage) - (255.86 * voltage * voltage) + (857.39 * voltage);
    return TDS;  // Returns TDS in ppm
}

void setup() {
    Serial.begin(115200);
}

void loop() {
    int rawPH = analogRead(PH_SENSOR_PIN);
    int rawTDS = analogRead(TDS_SENSOR_PIN);
    
    float voltagePH = rawPH * (3.3 / 4095.0);  // Convert ADC value to voltage
    float voltageTDS = rawTDS * (3.3 / 4095.0); // Convert ADC value to voltage
    
    float pH = voltageToPH(voltagePH);
    float TDS = voltageToTDS(voltageTDS);
    
    Serial.print("pH Value: ");
    Serial.print(pH);
    Serial.print(" | TDS Value: ");
    Serial.print(TDS);
    Serial.println(" ppm");

    delay(1000); // Wait 1 second before taking the next reading
}