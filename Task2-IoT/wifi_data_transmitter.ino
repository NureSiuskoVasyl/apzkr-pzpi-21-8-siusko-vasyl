#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// Налаштування Wi-Fi
const char* ssid = "Your_SSID";
const char* password = "Your_PASSWORD";

// URL сервера для прийому даних
const char* serverUrl = "http://your-server-address/api/flowdatas";

// Піни для підключення сенсора
const int sensorPin = A0; // Пін для аналогового сенсора

void setup() {
  Serial.begin(115200);
  delay(10);

  // Підключення до Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Підключення до Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("Підключено до Wi-Fi");
  
  // Основний цикл збору і відправки даних
  collectAndSendData();
}

void collectAndSendData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Збір даних з сенсора
    int sensorValue = analogRead(sensorPin);
    float temperature = (sensorValue / 1024.0) * 100; // Перетворення значення в градуси Цельсія

    // Формування даних для POST запиту
    String timestamp = String(millis());
    String postData = "timestamp=" + timestamp +
                      "&device_id=esp8266" +
                      "&location=room" +
                      "&flow_rate=0.0" + // Змінюйте відповідно до даних
                      "&water_temperature=" + String(temperature) +
                      "&pressure=0.0" + // Змінюйте відповідно до даних
                      "&status=active" +
                      "&units=units" + // Змінюйте відповідно до даних
                      "&calibration=1.0";

    http.begin(serverUrl); // Вказуємо URL сервера
    http.addHeader("Content-Type", "application/x-www-form-urlencoded"); // Формат даних

    // Відправка POST запиту
    int httpResponseCode = http.POST(postData);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Відповідь сервера: " + response);
    } else {
      Serial.println("Помилка запиту: " + String(httpResponseCode));
    }

    http.end(); // Завершення запиту
  } else {
    Serial.println("Втрата з'єднання з Wi-Fi");
  }
  
  // Затримка перед наступним збором даних
  delay(60000); // 1 хвилина
}

void loop() {
  // Ваш основний код
}
