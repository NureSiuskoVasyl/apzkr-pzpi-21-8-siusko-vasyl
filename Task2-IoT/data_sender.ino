#include <SPI.h>
#include <SD.h>

// Налаштування піну CS для SD-карти
const int chipSelect = 10;

// Піни для підключення сенсора
const int sensorPin = A0; // Пін для аналогового сенсора

void setup() {
  Serial.begin(115200);
  delay(10);

  // Ініціалізація SD-карти
  if (!SD.begin(chipSelect)) {
    Serial.println("Помилка ініціалізації SD-карти");
    return;
  }
  Serial.println("SD-карта ініціалізована");

  // Запис даних у файл
  writeDataToFile();
}

void writeDataToFile() {
  // Відкриття файлу для запису
  File file = SD.open("/water_data.csv", FILE_WRITE);
  if (!file) {
    Serial.println("Не вдалося відкрити файл для запису");
    return;
  }

  // Збір даних з сенсора
  int sensorValue = analogRead(sensorPin);
  float temperature = (sensorValue / 1024.0) * 100; // Перетворення значення в градуси Цельсія

  // Формування даних для запису у файл
  String timestamp = String(millis());
  String csvData = "timestamp,device_id,location,flow_rate,water_temperature,pressure,status,units,calibration\n" +
                   timestamp + ",arduino,room,0.0," + String(temperature) + ",0.0,active,units,1.0\n";

  // Запис даних у файл
  file.print(csvData);
  file.close();
  Serial.println("Дані записані у файл");
}

void loop() {
  // Затримка для зменшення частоти запису
  delay(60000); // Запис кожну хвилину
  writeDataToFile();
}
