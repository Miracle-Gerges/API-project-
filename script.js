const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

searchBtn.addEventListener("click", getCountry);

countryInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getCountry();
    }
});

async function getCountry() {

    const countryName = countryInput.value.trim();

    if (countryName === "") {
        result.innerHTML = `
            <p class="error">
                من فضلك اكتب اسم الدولة.
            </p>
        `;
        return;
    }

    result.innerHTML = `
        <p class="loading">
            جاري تحميل البيانات...
        </p>
    `;

    try {

        const response = await fetch(
            `https://countries.dev/name/${encodeURIComponent(countryName)}`
        );

        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();

        const country = Array.isArray(data) ? data[0] : data;

        if (!country) {
            throw new Error("Country not found");
        }

        const name = country.name || "غير متوفر";

        const capital = country.capital || "غير متوفر";

        const population = country.population
            ? country.population.toLocaleString("en-US")
            : "غير متوفر";

        const region = country.region || "غير متوفر";

        const subregion = country.subregion || "غير متوفر";

        let languages = "غير متوفر";

        if (Array.isArray(country.languages)) {
            languages = country.languages
                .map(language => {
                    return typeof language === "string"
                        ? language
                        : language.name;
                })
                .filter(Boolean)
                .join("، ");
        }

        let currencies = "غير متوفر";

        if (Array.isArray(country.currencies)) {
            currencies = country.currencies
                .map(currency => {
                    return typeof currency === "string"
                        ? currency
                        : `${currency.name} (${currency.symbol || ""})`;
                })
                .filter(Boolean)
                .join("، ");
        }

        // رابط العلم موجود داخل بيانات الـAPI نفسها
        const flag = country.flags?.svg || country.flags?.png || "";

        result.innerHTML = `

            <div class="country-card">

                <img
                    class="country-flag"
                    src="${flag}"
                    alt="علم ${name}"
                >

                <h2>${name}</h2>

                <div class="country-info">

                    <div class="info-box">
                        <strong>العاصمة</strong>
                        <span>${capital}</span>
                    </div>

                    <div class="info-box">
                        <strong>عدد السكان</strong>
                        <span>${population}</span>
                    </div>

                    <div class="info-box">
                        <strong>المنطقة</strong>
                        <span>${region}</span>
                    </div>

                    <div class="info-box">
                        <strong>المنطقة الفرعية</strong>
                        <span>${subregion}</span>
                    </div>

                    <div class="info-box">
                        <strong>اللغات</strong>
                        <span>${languages}</span>
                    </div>

                    <div class="info-box">
                        <strong>العملة</strong>
                        <span>${currencies}</span>
                    </div>

                </div>

            </div>
        `;

    } catch (error) {

        console.error(error);

        result.innerHTML = `
            <p class="error">
                الدولة غير موجودة أو حدث خطأ في الاتصال.
            </p>
        `;
    }
}