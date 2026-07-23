const API_URL = "http://127.0.0.1:8000/api/analyze";

const csvFileInput = document.getElementById("csvFile");
const analyzeButton = document.getElementById("analyzeButton");
const statusMessage = document.getElementById("statusMessage");

const resultsSection = document.getElementById("resultsSection");
const qualityCards = document.getElementById("qualityCards");
const metricsCards = document.getElementById("metricsCards");
const segmentCards = document.getElementById("segmentCards");
const walletTableBody = document.getElementById("walletTableBody");


analyzeButton.addEventListener("click", analyzeCsvFile);


async function analyzeCsvFile() {
    const file = csvFileInput.files[0];

    if (!file) {
        showStatus(
            "Please select a CSV file first.",
            "error"
        );
        return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
        showStatus(
            "Only CSV files are supported.",
            "error"
        );
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoadingState(true);

    showStatus(
        "Uploading and analyzing transaction data...",
        ""
    );

    try {
        const response = await fetch(
            API_URL,
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.detail || "Analysis request failed."
            );
        }

        if (!result.success) {
            throw new Error(
                "The backend could not complete the analysis."
            );
        }

        renderAnalysisResult(result);

        resultsSection.classList.remove("hidden");

        showStatus(
            `Analysis completed successfully for ${result.file.filename}.`,
            "success"
        );
    } catch (error) {
        console.error(error);

        resultsSection.classList.add("hidden");

        showStatus(
            error.message ||
            "Cannot connect to the backend API.",
            "error"
        );
    } finally {
        setLoadingState(false);
    }
}


function renderAnalysisResult(result) {
    renderDataQuality(result);
    renderGrowthMetrics(result.analysis.metrics);
    renderSegmentation(result.analysis.segmentation);
    renderWalletPreview(result.preview.segmentation);
}


function renderDataQuality(result) {
    const cleaning = result.cleaning;

    const qualityMetrics = [
        {
            label: "Original Records",
            value: result.file.rows
        },
        {
            label: "Clean Records",
            value: cleaning.clean_rows
        },
        {
            label: "Duplicates Removed",
            value: cleaning.duplicate_removed
        },
        {
            label: "Missing Rows Removed",
            value: cleaning.missing_value_removed
        },
        {
            label: "Modified Rows",
            value: cleaning.modified_rows
        }
    ];

    qualityCards.innerHTML = qualityMetrics
        .map(createMetricCard)
        .join("");
}


function renderGrowthMetrics(metrics) {
    const growthMetrics = [
        {
            label: "Total Users",
            value: formatNumber(
                metrics.total_users
            )
        },
        {
            label: "Total Transactions",
            value: formatNumber(
                metrics.total_transactions
            )
        },
        {
            label: "Total Volume",
            value: formatCurrency(
                metrics.total_volume_usd
            )
        },
        {
            label: "Active Users",
            value: formatNumber(
                metrics.active_users
            )
        },
        {
            label: "Repeat Users",
            value: formatNumber(
                metrics.repeat_users
            )
        },
        {
            label: "Repeat Rate",
            value: formatPercentage(
                metrics.repeat_rate
            )
        }
    ];

    metricsCards.innerHTML = growthMetrics
        .map(createMetricCard)
        .join("");
}


function renderSegmentation(segmentation) {
    const segmentConfig = [
        {
            key: "High Value User",
            label: "High Value",
            className: "high-value"
        },
        {
            key: "Active User",
            label: "Active",
            className: "active"
        },
        {
            key: "New User",
            label: "New",
            className: "new"
        },
        {
            key: "At Risk User",
            label: "At Risk",
            className: "risk"
        }
    ];

    segmentCards.innerHTML = segmentConfig
        .map((segment) => {
            const value =
                segmentation[segment.key] || 0;

            return `
                <article class="segment-card ${segment.className}">
                    <p class="segment-label">
                        ${segment.label}
                    </p>

                    <p class="segment-value">
                        ${formatNumber(value)}
                    </p>
                </article>
            `;
        })
        .join("");
}


function renderWalletPreview(wallets) {
    walletTableBody.innerHTML = "";

    if (!wallets || wallets.length === 0) {
        walletTableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No wallet profile data available.
                </td>
            </tr>
        `;
        return;
    }

    wallets.forEach((wallet) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="wallet-cell"
                title="${escapeHtml(wallet.wallet_address)}">
                ${shortenWallet(wallet.wallet_address)}
            </td>

            <td>
                ${formatNumber(wallet.transaction_count)}
            </td>

            <td>
                ${formatCurrency(wallet.total_volume_usd)}
            </td>

            <td>
                ${formatNumber(wallet.active_days)}
            </td>

            <td>
                <span class="badge">
                    ${escapeHtml(wallet.segment)}
                </span>
            </td>
        `;

        walletTableBody.appendChild(row);
    });
}


function createMetricCard(metric) {
    return `
        <article class="metric-card">
            <p class="metric-label">
                ${metric.label}
            </p>

            <p class="metric-value">
                ${metric.value}
            </p>
        </article>
    `;
}


function setLoadingState(isLoading) {
    analyzeButton.disabled = isLoading;

    analyzeButton.textContent = isLoading
        ? "Analyzing..."
        : "Analyze Data";
}


function showStatus(message, type) {
    statusMessage.textContent = message;

    statusMessage.classList.remove(
        "success",
        "error"
    );

    if (type) {
        statusMessage.classList.add(type);
    }
}


function formatNumber(value) {
    return new Intl.NumberFormat(
        "en-US"
    ).format(value ?? 0);
}


function formatCurrency(value) {
    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2
        }
    ).format(value ?? 0);
}


function formatPercentage(value) {
    return new Intl.NumberFormat(
        "en-US",
        {
            style: "percent",
            maximumFractionDigits: 1
        }
    ).format(value ?? 0);
}


function shortenWallet(walletAddress) {
    if (!walletAddress) {
        return "-";
    }

    if (walletAddress.length <= 14) {
        return walletAddress;
    }

    return (
        walletAddress.slice(0, 8)
        +
        "..."
        +
        walletAddress.slice(-6)
    );
}


function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}