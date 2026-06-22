// =====================================================
// FitForge AI v2.0 - app.js
// Part 1 / 3
// 初始化 + BMI + TDEE
// =====================================================

let healthChart = null;

document.addEventListener("DOMContentLoaded", function () {
    loadData();
    updateHealthScore();
    updateChart();
});

// ==========================
// BMI Calculator
// ==========================

function calculateBMI() {

    let height = Number(document.getElementById("height").value);
    let weight = Number(document.getElementById("weight").value);

    if (height <= 0 || weight <= 0) {
        alert("請輸入正確的身高與體重！");
        return;
    }

    let heightMeter = height / 100;

    let bmi = (weight / (heightMeter * heightMeter)).toFixed(1);

    let status = "";
    let advice = "";

    if (bmi < 18.5) {

        status = "體重過輕";
        advice = "建議增加熱量攝取，並搭配重量訓練提升肌肉量。";

    } else if (bmi < 24) {

        status = "正常";
        advice = "目前 BMI 位於正常範圍，建議維持規律運動與均衡飲食。";

    } else if (bmi < 27) {

        status = "過重";
        advice = "建議增加有氧運動，並逐步控制每日熱量攝取。";

    } else {

        status = "肥胖";
        advice = "建議建立長期飲食與運動計畫，必要時可尋求專業協助。";

    }

    document.getElementById("bmiResult").innerHTML = `
        <h3>BMI：${bmi}</h3>
        <p>健康狀態：${status}</p>
        <p>${advice}</p>
    `;

    document.getElementById("dashboardBMI").innerText = bmi;

    saveData();
    updateHealthScore();
    updateChart();

}

// ==========================
// TDEE Calculator
// ==========================

function calculateTDEE() {

    let age = Number(document.getElementById("age").value);
    let gender = document.getElementById("gender").value;
    let height = Number(document.getElementById("height2").value);
    let weight = Number(document.getElementById("weight2").value);
    let activity = Number(document.getElementById("activity").value);

    if (age <= 0 || height <= 0 || weight <= 0) {
        alert("請完整輸入年齡、身高與體重！");
        return;
    }

    let bmr = 0;

    if (gender === "male") {

        bmr = 10 * weight + 6.25 * height - 5 * age + 5;

    } else {

        bmr = 10 * weight + 6.25 * height - 5 * age - 161;

    }

    let tdee = Math.round(bmr * activity);

    let bulk = tdee + 300;

    let cut = tdee - 500;

    document.getElementById("tdeeResult").innerHTML = `
        <h3>每日維持熱量</h3>
        <p>${tdee} kcal / day</p>

        <hr>

        <h3>增肌建議熱量</h3>
        <p>${bulk} kcal / day</p>

        <hr>

        <h3>減脂建議熱量</h3>
        <p>${cut} kcal / day</p>
    `;

    document.getElementById("dashboardTDEE").innerText = tdee + " kcal";

    saveData();
    updateHealthScore();
    updateChart();

}
// ==========================
// Nutrition Calculator
// ==========================

function calculateNutrition() {

    const weight = Number(document.getElementById("proteinWeight").value);

    if (weight <= 0) {
        alert("請輸入正確體重！");
        return;
    }

    const protein = Math.round(weight * 2);
    const fat = Math.round(weight * 0.8);
    const carbs = Math.round(weight * 4);

    document.getElementById("nutritionResult").innerHTML = `
        <h3>每日建議營養攝取</h3>
        <p>🥩 蛋白質：${protein} g</p>
        <p>🥑 脂肪：約 ${fat} g</p>
        <p>🍚 碳水化合物：約 ${carbs} g</p>
    `;

    document.getElementById("dashboardProtein").innerText = protein + " g";

    saveData();
    updateHealthScore();
    updateChart();

}

// ==========================
// Water Calculator
// ==========================

function calculateWater() {

    const weight = Number(document.getElementById("waterWeight").value);

    if (weight <= 0) {
        alert("請輸入正確體重！");
        return;
    }

    const water = Math.round(weight * 35);

    document.getElementById("waterResult").innerHTML = `
        <h3>每日建議飲水量</h3>
        <p>💧 ${(water / 1000).toFixed(1)} 公升（${water} ml）</p>
    `;

    document.getElementById("dashboardWater").innerText = water + " ml";

    saveData();
    updateHealthScore();
    updateChart();

}

// ==========================
// Health Score
// ==========================

function updateHealthScore() {

    let score = 0;

    const bmi = document.getElementById("dashboardBMI").innerText;
    const tdee = document.getElementById("dashboardTDEE").innerText;
    const protein = document.getElementById("dashboardProtein").innerText;
    const water = document.getElementById("dashboardWater").innerText;

    if (bmi !== "--") {
        score += 25;
    }

    if (tdee !== "-- kcal") {
        score += 25;
    }

    if (protein !== "-- g") {
        score += 25;
    }

    if (water !== "-- ml") {
        score += 25;
    }

    document.getElementById("healthScore").innerText = score;

    document.getElementById("progressBar").style.width = score + "%";

    let text = "等待計算...";

    if (score === 100) {

        text = "🎉 太棒了！今日健康資料已全部完成。";

    } else if (score >= 75) {

        text = "👍 很不錯，再完成剩餘資料即可。";

    } else if (score >= 50) {

        text = "💪 已完成一半以上，繼續補齊紀錄。";

    } else if (score >= 25) {

        text = "⚠ 已開始紀錄，建議完成更多健康資料。";

    }

    document.getElementById("healthText").innerText = text;

}
// ==========================
// Chart.js
// ==========================

function updateChart() {

    const canvas = document.getElementById("healthChart");

    if (!canvas || typeof Chart === "undefined") {
        return;
    }

    const bmi = Number(document.getElementById("dashboardBMI").innerText) || 0;

    const protein =
        parseInt(document.getElementById("dashboardProtein").innerText) || 0;

    const water =
        parseInt(document.getElementById("dashboardWater").innerText) || 0;

    const tdee =
        parseInt(document.getElementById("dashboardTDEE").innerText) || 0;

    if (healthChart) {
        healthChart.destroy();
    }

    healthChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: [
                "BMI",
                "蛋白質(g)",
                "飲水量(ml)",
                "TDEE(kcal)"
            ],

            datasets: [{

                label: "今日健康數據",

                data: [
                    bmi,
                    protein,
                    water,
                    tdee
                ],

                backgroundColor: [
                    "rgba(96,165,250,.75)",
                    "rgba(34,197,94,.75)",
                    "rgba(56,189,248,.75)",
                    "rgba(168,85,247,.75)"
                ],

                borderColor: [
                    "rgba(96,165,250,1)",
                    "rgba(34,197,94,1)",
                    "rgba(56,189,248,1)",
                    "rgba(168,85,247,1)"
                ],

                borderWidth: 1

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    labels: {

                        color: "#ffffff"

                    }

                }

            },

            scales: {

                x: {

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        color: "rgba(255,255,255,.08)"

                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        color: "rgba(255,255,255,.08)"

                    }

                }

            }

        }

    });

}

// ==========================
// AI Coach
// ==========================

function generateCoachAdvice() {

    const goal = document.getElementById("fitnessGoal").value;

    const level = document.getElementById("trainingLevel").value;

    const bmiText = document.getElementById("dashboardBMI").innerText;

    const tdeeText = document.getElementById("dashboardTDEE").innerText;

    const proteinText = document.getElementById("dashboardProtein").innerText;

    let goalText = "";

    let trainingAdvice = "";

    let nutritionAdvice = "";

    let recoveryAdvice = "";

    if (goal === "muscle") {

        goalText = "增肌";

        trainingAdvice =
            "建議以重量訓練為主，每週安排 4～5 天訓練，重點放在漸進超負荷。";

        nutritionAdvice =
            "每日熱量可比 TDEE 多 300 kcal，蛋白質維持每公斤體重約 2g。";

    } else if (goal === "fatloss") {

        goalText = "減脂";

        trainingAdvice =
            "建議每週 3～4 天重量訓練，搭配 2～3 次中低強度有氧。";

        nutritionAdvice =
            "每日熱量可比 TDEE 少 300～500 kcal，並保持足夠蛋白質避免肌肉流失。";

    } else {

        goalText = "維持體態";

        trainingAdvice =
            "建議每週 3～4 天規律訓練，讓力量、有氧與柔軟度保持平衡。";

        nutritionAdvice =
            "每日熱量接近 TDEE，飲食以均衡與長期可維持為主。";

    }

    if (level === "beginner") {

        recoveryAdvice =
            "你目前適合從基礎動作開始，避免一次訓練過量，並確保每晚睡眠 7 小時以上。";

    } else if (level === "intermediate") {

        recoveryAdvice =
            "可加入週期化訓練安排，注意訓練量與恢復之間的平衡。";

    } else {

        recoveryAdvice =
            "可進一步追蹤訓練表現、恢復狀態與飲食細節，讓計畫更精準。";

    }

    document.getElementById("coachResult").innerHTML = `
        <h3>🤖 AI 健身建議：${goalText}</h3>

        <p>
            <strong>目前資料：</strong>
            BMI ${bmiText}，
            TDEE ${tdeeText}，
            蛋白質 ${proteinText}
        </p>

        <p>
            <strong>訓練建議：</strong>
            ${trainingAdvice}
        </p>

        <p>
            <strong>飲食建議：</strong>
            ${nutritionAdvice}
        </p>

        <p>
            <strong>恢復建議：</strong>
            ${recoveryAdvice}
        </p>
    `;

}

// ==========================
// LocalStorage
// ==========================

function saveData() {

    const data = {

        bmi: document.getElementById("dashboardBMI").innerText,

        tdee: document.getElementById("dashboardTDEE").innerText,

        protein: document.getElementById("dashboardProtein").innerText,

        water: document.getElementById("dashboardWater").innerText

    };

    localStorage.setItem("fitforgeData", JSON.stringify(data));

}

function loadData() {

    const saved = localStorage.getItem("fitforgeData");

    if (!saved) {
        return;
    }

    const data = JSON.parse(saved);

    document.getElementById("dashboardBMI").innerText =
        data.bmi || "--";

    document.getElementById("dashboardTDEE").innerText =
        data.tdee || "-- kcal";

    document.getElementById("dashboardProtein").innerText =
        data.protein || "-- g";

    document.getElementById("dashboardWater").innerText =
        data.water || "-- ml";

}