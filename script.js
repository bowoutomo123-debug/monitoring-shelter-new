```javascript
/* =========================================================
   SHELTER MONITORING SYSTEM
   DEMO VERSION
========================================================= */


/* =========================================================
   VARIABEL KONDISI
========================================================= */

let temperature = 27.5;
let humidity = 61;

let doorOpen = false;
let waterDetected = false;

let alarmActive = false;


/* =========================================================
   ELEMENT HTML
========================================================= */

const door = document.getElementById("door");
const doorStatus = document.getElementById("doorStatus");
const doorAlert = document.getElementById("doorAlert");

const waterStatus = document.getElementById("waterStatus");
const waterVisual = document.getElementById("waterVisual");

const alarmPanel = document.getElementById("alarmPanel");
const alarmStatus = document.getElementById("alarmStatus");

const beacon = document.getElementById("beacon");

const temperatureElement =
    document.getElementById("temperature");

const humidityElement =
    document.getElementById("humidity");

const temperatureBar =
    document.getElementById("temperatureBar");

const humidityBar =
    document.getElementById("humidityBar");

const temperatureStatus =
    document.getElementById("temperatureStatus");

const humidityStatus =
    document.getElementById("humidityStatus");

const activityLog =
    document.getElementById("activityLog");

const lastUpdate =
    document.getElementById("lastUpdate");


/* =========================================================
   JAM
========================================================= */

function updateClock() {

    const now = new Date();

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");

    document.getElementById("clock").textContent =
        `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);

updateClock();


/* =========================================================
   UPDATE WAKTU
========================================================= */

function updateLastUpdate() {

    const now = new Date();

    const time =
        now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    lastUpdate.textContent = time;
}


/* =========================================================
   LOG AKTIVITAS
========================================================= */

function addLog(message, type = "normal") {

    const now = new Date();

    const time =
        now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

    const item =
        document.createElement("div");

    item.className =
        `log-item ${type}`;

    item.innerHTML = `
        <span class="log-dot"></span>

        <div>
            <b>${time}</b>
            <span>${message}</span>
        </div>
    `;

    activityLog.prepend(item);

    /*
       Batasi jumlah log yang tampil
       supaya dashboard tidak terlalu penuh.
    */

    while (activityLog.children.length > 6) {

        activityLog.removeChild(
            activityLog.lastElementChild
        );

    }
}


/* =========================================================
   STATUS PINTU
========================================================= */

function updateDoorStatus() {

    if (doorOpen) {

        /* Pintu terbuka secara visual */
        door.classList.add("open");

        /* Status */
        doorStatus.textContent =
            "TERBUKA";

        doorStatus.classList.remove(
            "green-text"
        );

        doorStatus.classList.add(
            "red-text"
        );


        /* Peringatan atas */
        doorAlert.classList.remove(
            "hidden"
        );


        /* Beacon merah */
        beacon.classList.add(
            "danger"
        );


        /* Alarm */
        alarmActive = true;

        updateAlarm();


    } else {

        /* Pintu tertutup */
        door.classList.remove("open");

        doorStatus.textContent =
            "TERTUTUP";

        doorStatus.classList.remove(
            "red-text"
        );

        doorStatus.classList.add(
            "green-text"
        );


        /* Hilangkan peringatan */
        doorAlert.classList.add(
            "hidden"
        );


        /* Beacon normal */
        beacon.classList.remove(
            "danger"
        );


        /*
           Alarm tetap bisa aktif jika
           sensor air atau suhu berbahaya.
        */

        checkAlarmConditions();

    }
}


/* =========================================================
   STATUS AIR
========================================================= */

function updateWaterStatus() {

    if (waterDetected) {

        waterStatus.textContent =
            "TERDETEKSI";

        waterStatus.classList.remove(
            "green-text"
        );

        waterStatus.classList.add(
            "red-text"
        );


        waterVisual.classList.remove(
            "hidden"
        );


        addLog(
            "Genangan air terdeteksi",
            "danger"
        );


        alarmActive = true;

        updateAlarm();

    } else {

        waterStatus.textContent =
            "AMAN";

        waterStatus.classList.remove(
            "red-text"
        );

        waterStatus.classList.add(
            "green-text"
        );


        waterVisual.classList.add(
            "hidden"
        );


        checkAlarmConditions();

    }
}


/* =========================================================
   ALARM
========================================================= */

function updateAlarm() {

    if (alarmActive) {

        alarmPanel.classList.add(
            "active"
        );

        alarmStatus.textContent =
            "BUZZER AKTIF";

    } else {

        alarmPanel.classList.remove(
            "active"
        );

        alarmStatus.textContent =
            "BUZZER MATI";

    }
}


/* =========================================================
   CEK KONDISI ALARM
========================================================= */

function checkAlarmConditions() {

    /*
       Alarm aktif jika salah satu kondisi
       berikut terjadi:

       1. Pintu terbuka
       2. Genangan terdeteksi
       3. Suhu terlalu tinggi
    */

    if (
        doorOpen ||
        waterDetected ||
        temperature > 32
    ) {

        alarmActive = true;

    } else {

        alarmActive = false;

    }

    updateAlarm();
}


/* =========================================================
   SUHU
========================================================= */

function updateTemperature(value) {

    temperature =
        Number(value);

    temperatureElement.textContent =
        temperature.toFixed(1);


    /*
       Persentase progress bar.
       Nilai dibatasi antara 0–100.
    */

    let percentage =
        ((temperature - 15) / 25) * 100;

    percentage =
        Math.max(
            0,
            Math.min(
                100,
                percentage
            )
        );

    temperatureBar.style.width =
        `${percentage}%`;


    /*
       Status suhu
    */

    if (temperature < 28) {

        temperatureStatus.textContent =
            "NORMAL";

        temperatureStatus.className =
            "status-label safe";

    }

    else if (temperature <= 32) {

        temperatureStatus.textContent =
            "WASPADA";

        temperatureStatus.className =
            "status-label warning";

    }

    else {

        temperatureStatus.textContent =
            "BAHAYA";

        temperatureStatus.className =
            "status-label danger";

    }


    checkAlarmConditions();
}


/* =========================================================
   KELEMBAPAN
========================================================= */

function updateHumidity(value) {

    humidity =
        Number(value);

    humidityElement.textContent =
        humidity.toFixed(0);


    humidityBar.style.width =
        `${Math.max(
            0,
            Math.min(
                100,
                humidity
            )
        )}%`;


    /*
       Contoh status kelembapan.
       Bisa kita ubah nanti sesuai batas
       yang kamu gunakan pada TA.
    */

    if (
        humidity >= 40 &&
        humidity <= 80
    ) {

        humidityStatus.textContent =
            "NORMAL";

        humidityStatus.className =
            "status-label safe";

    }

    else if (
        humidity >= 30 &&
        humidity <= 90
    ) {

        humidityStatus.textContent =
            "WASPADA";

        humidityStatus.className =
            "status-label warning";

    }

    else {

        humidityStatus.textContent =
            "BAHAYA";

        humidityStatus.className =
            "status-label danger";

    }
}


/* =========================================================
   UBAH KONDISI PINTU
========================================================= */

function setDoorState(state) {

    const newState =
        Boolean(state);

    /*
       Hanya buat log jika kondisi
       benar-benar berubah.
    */

    if (newState !== doorOpen) {

        doorOpen =
            newState;

        if (doorOpen) {

            addLog(
                "Pintu shelter terbuka",
                "danger"
            );

        } else {

            addLog(
                "Pintu shelter tertutup",
                "normal"
            );

        }

    }

    updateDoorStatus();

    updateLastUpdate();
}


/* =========================================================
   UBAH KONDISI AIR
========================================================= */

function setWaterState(state) {

    const newState =
        Boolean(state);

    if (newState !== waterDetected) {

        waterDetected =
            newState;

        if (!waterDetected) {

            addLog(
                "Genangan air sudah tidak terdeteksi",
                "normal"
            );

        }

    }

    updateWaterStatus();

    updateLastUpdate();
}


/* =========================================================
   DEMO MODE
========================================================= */

/*
   Untuk sementara kita buat fungsi demo
   supaya website bisa dites tanpa ESP32.

   Nanti fungsi ini akan kita ganti /
   integrasikan dengan MQTT.
*/


function demoDoor() {

    setDoorState(
        !doorOpen
    );

}


function demoWater() {

    setWaterState(
        !waterDetected
    );

}


function demoTemperature() {

    if (temperature < 28) {

        updateTemperature(30);

    }

    else if (temperature <= 32) {

        updateTemperature(34);

    }

    else {

        updateTemperature(27.5);

    }

    addLog(
        `Suhu berubah menjadi ${temperature.toFixed(1)} °C`,
        temperature > 32
            ? "danger"
            : temperature >= 28
                ? "warning"
                : "normal"
    );

    updateLastUpdate();
}


/* =========================================================
   KONTROL DEMO DENGAN KEYBOARD
========================================================= */

/*
   D = buka / tutup pintu
   W = aktifkan / matikan air
   T = ubah suhu
*/

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();

        if (key === "d") {

            demoDoor();

        }

        if (key === "w") {

            demoWater();

        }

        if (key === "t") {

            demoTemperature();

        }

    }
);


/* =========================================================
   GRAFIK
========================================================= */

const chartCanvas =
    document.getElementById(
        "sensorChart"
    );

const chartContext =
    chartCanvas.getContext(
        "2d"
    );


/*
   Data awal grafik
*/

const labels = [];

const temperatureData = [];

const humidityData = [];


/*
   Buat data awal
*/

for (
    let i = 0;
    i < 12;
    i++
) {

    labels.push(
        `${String(7 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`
    );

    temperatureData.push(
        27 + Math.random() * 2
    );

    humidityData.push(
        58 + Math.random() * 8
    );
}


/*
   Chart.js
*/

const sensorChart =
    new Chart(
        chartContext,
        {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {
                        label: "Suhu (°C)",

                        data:
                            temperatureData,

                        borderColor:
                            "#ffbf00",

                        backgroundColor:
                            "rgba(255,191,0,0.08)",

                        borderWidth: 2,

                        pointRadius: 2,

                        tension: 0.35,

                        yAxisID:
                            "y"

                    },

                    {
                        label: "Kelembapan (%)",

                        data:
                            humidityData,

                        borderColor:
                            "#18c8ff",

                        backgroundColor:
                            "rgba(24,200,255,0.08)",

                        borderWidth: 2,

                        pointRadius: 2,

                        tension: 0.35,

                        yAxisID:
                            "y"

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        labels: {

                            color: "#dce8f4",

                            font: {
                                size: 11
                            }

                        }

                    }

                },

                scales: {

                    x: {

                        ticks: {
                            color: "#72869b"
                        },

                        grid: {
                            color:
                                "rgba(255,255,255,0.06)"
                        }

                    },

                    y: {

                        min: 0,

                        max: 100,

                        ticks: {
                            color: "#72869b"
                        },

                        grid: {
                            color:
                                "rgba(255,255,255,0.06)"
                        }

                    }

                }

            }

        }
    );


/* =========================================================
   UPDATE GRAFIK
========================================================= */

function updateChart() {

    const now =
        new Date();

    const time =
        now.toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    sensorChart.data.labels.push(
        time
    );

    sensorChart.data.datasets[0]
        .data.push(
            temperature
        );

    sensorChart.data.datasets[1]
        .data.push(
            humidity
        );


    /*
       Batasi data grafik
    */

    if (
        sensorChart.data.labels.length > 15
    ) {

        sensorChart.data.labels.shift();

        sensorChart.data.datasets[0]
            .data.shift();

        sensorChart.data.datasets[1]
            .data.shift();

    }


    sensorChart.update();
}


/*
   Update grafik setiap 10 detik
*/

setInterval(
    updateChart,
    10000
);


/* =========================================================
   SIMULASI DATA SENSOR
========================================================= */

/*
   Untuk demo tampilan saja.

   Nanti bagian ini akan diganti dengan
   data MQTT dari ESP32.
*/

setInterval(
    function() {

        /*
           Perubahan kecil supaya
           grafik terlihat hidup.
        */

        const tempChange =
            (Math.random() - 0.5) * 0.4;

        const humidityChange =
            (Math.random() - 0.5) * 1.5;


        updateTemperature(
            temperature + tempChange
        );

        updateHumidity(
            humidity + humidityChange
        );

        updateLastUpdate();

    },
    5000
);


/* =========================================================
   INISIALISASI
========================================================= */

updateTemperature(
    temperature
);

updateHumidity(
    humidity
);

updateDoorStatus();

updateWaterStatus();

updateAlarm();

updateLastUpdate();


/* =========================================================
   INFORMASI KEYBOARD
========================================================= */

console.log(
    "======================================"
);

console.log(
    "SHELTER MONITORING SYSTEM"
);

console.log(
    "DEMO MODE"
);

console.log(
    "D = Buka / Tutup Pintu"
);

console.log(
    "W = Genangan Air ON / OFF"
);

console.log(
    "T = Ubah Kondisi Suhu"
);

console.log(
    "======================================"
);
```