#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>

// OLED display settings
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Pin definitions
#define PH_SENSOR_PIN 34
#define TDS_SENSOR_PIN 35
#define DHT_PIN 4
#define DHT_TYPE DHT22

#define DEVICE_STATE_PIN 2  // Digital pin to control device state
bool isDeviceRunning = false;

DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Initialize OLED display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 OLED initialization failed.");
    while (true); // Stop here if OLED not found
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.println("Starting sensors...");
  display.display();
  delay(2000);
  pinMode(DEVICE_STATE_PIN, OUTPUT);
  digitalWrite(DEVICE_STATE_PIN, LOW);  // Start with device off
}

void loop() {
  if (Serial.available() > 0) {
    String command = Serial.readStringUntil('\n');
    if (command == "START") {
      isDeviceRunning = true;
      digitalWrite(DEVICE_STATE_PIN, HIGH);
      Serial.println("Device started");
    } 
    else if (command == "STOP") {
      isDeviceRunning = false;
      digitalWrite(DEVICE_STATE_PIN, LOW);
      Serial.println("Device stopped");
    }
  }

  if (isDeviceRunning) {
    // Read sensor values
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int phRaw = analogRead(PH_SENSOR_PIN);
    float pH = 7.0;  // Your pH calculation
    int tdsRaw = analogRead(TDS_SENSOR_PIN);
    float tds = (tdsRaw / 4095.0) * 133.42;

    // Send readings as CSV string
    Serial.print(temperature, 2);
    Serial.print(",");
    Serial.print(humidity, 2);
    Serial.print(",");
    Serial.print(pH, 2);
    Serial.print(",");
    Serial.println(tds, 2);

    delay(2000);  // Update every 2 seconds
  }
}