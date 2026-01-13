// NaijaWealth Calculator - Savings & Investment Calculator
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let chartInstance = null;
    let currentTab = 'savings';
    let currentResults = null;
    
    // DOM Elements
    const calculatorTabs = document.querySelectorAll('.calc-tab');
    const calcContents = document.querySelectorAll('.calc-content');
    const resultTabs = document.querySelectorAll('.result-tab');
    const resultContents = document.querySelectorAll('.result-content');
    
    // Savings Calculator Elements
    const monthlySavingsInput = document.getElementById('monthly-savings');
    const savingsSlider = document.getElementById('savings-slider');
    const savingsPeriodInput = document.getElementById('savings-period');
    const periodSlider = document.getElementById('period-slider');
    const interestRateInput = document.getElementById('interest-rate');
    const compoundingSelect = document.getElementById('compounding');
    const ratePresets = document.querySelectorAll('.rate-preset');
    
    // Investment Calculator Elements
    const initialInvestmentInput = document.getElementById('initial-investment');
    const monthlyContributionInput = document.getElementById('monthly-contribution');
    const investmentPeriodSelect = document.getElementById('investment-period');
    const expectedReturnInput = document.getElementById('expected-return');
    const investmentOptions = document.querySelectorAll('.investment-option input');
    
    // Results Elements
    const totalContributionsEl = document.getElementById('total-contributions');
    const totalInterestEl = document.getElementById('total-interest');
    const finalAmountEl = document.getElementById('final-amount');
    const annualGrowthEl = document.getElementById('annual-growth');
    const insightsListEl = document.getElementById('insights-list');
    const breakdownTableEl = document.querySelector('#breakdown-table tbody');
    
    // Sidebar Elements
    const monthlyGoalEl = document.getElementById('monthly-goal');
    const yearlyTargetEl = document.getElementById('yearly-target');
    const projectedValueEl = document.getElementById('projected-value');
    const timeToGoalEl = document.getElementById('time-to-goal');
    const inflationValueEl = document.getElementById('inflation-value');
    const goalButtons = document.querySelectorAll('.goal-btn');
    
    // Chart
    const growthChartCanvas = document.getElementById('growth-chart');
    
    // Initialize
    initializeEventListeners();
    calculateSavings(); // Initial calculation
    
    // Event Listeners
    function initializeEventListeners() {
        // Calculator Tabs
        calculatorTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                switchCalculatorTab(tabId);
            });
        });
        
        // Result Tabs
        resultTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                switchResultTab(tabId);
            });
        });
        
        // Savings Calculator
        monthlySavingsInput.addEventListener('input', updateSavingsSlider);
        savingsSlider.addEventListener('input', updateSavingsInput);
        savingsPeriodInput.addEventListener('input', updatePeriodSlider);
        periodSlider.addEventListener('input', updatePeriodInput);
        interestRateInput.addEventListener('input', calculateSavings);
        compoundingSelect.addEventListener('change', calculateSavings);
        
        ratePresets.forEach(preset => {
            preset.addEventListener('click', () => {
                const rate = parseFloat(preset.getAttribute('data-rate'));
                interestRateInput.value = rate;
                calculateSavings();
            });
        });
        
        // Investment Calculator
        initialInvestmentInput.addEventListener('input', calculateInvestment);
        monthlyContributionInput.addEventListener('input', calculateInvestment);
        investmentPeriodSelect.addEventListener('change', calculateInvestment);
        expectedReturnInput.addEventListener('input', calculateInvestment);
        
        investmentOptions.forEach(option => {
            option.addEventListener('change', () => {
                updateExpectedReturnBasedOnType(option.value);
                calculateInvestment();
            });
        });
        
        // Calculate Buttons
        document.getElementById('calculate-savings').addEventListener('click', calculateSavings);
        document.getElementById('calculate-investment').addEventListener('click', calculateInvestment);
        document.getElementById('calculate-retirement').addEventListener('click', calculateRetirement);
        document.getElementById('compare-strategies').addEventListener('click', compareStrategies);
        
        // Quick Goals
        goalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const amount = parseInt(button.getAttribute('data-amount'));
                const period = parseInt(button.getAttribute('data-period'));
                const rate = parseInt(button.getAttribute('data-rate'));
                
                // Switch to savings tab
                switchCalculatorTab('savings');
                
                // Update inputs
                monthlySavingsInput.value = Math.round(amount / (period * 12));
                savingsSlider.value = monthlySavingsInput.value;
                savingsPeriodInput.value = period;
                periodSlider.value = period;
                interestRateInput.value = rate;
                
                // Calculate
                calculateSavings();
            });
        });

        // Enhanced Mobile Features
function enhanceMobileExperience() {
    // Check if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Add touch events for better mobile interaction
        document.addEventListener('touchstart', function() {}, {passive: true});
        
        // Prevent zoom on double-tap for buttons
        document.querySelectorAll('button, input, select').forEach(el => {
            el.style.fontSize = '16px'; // Prevents iOS zoom
        });
        
        // Add swipe gestures for tabs
        let startX = 0;
        let endX = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].screenX;
            handleSwipe(startX, endX);
        });
    }
    
    // Handle viewport changes
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Initial mobile optimizations
    optimizeForScreenSize();
}

function handleSwipe(startX, endX) {
    const threshold = 50;
    const deltaX = endX - startX;
    
    if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
            // Swipe right - previous tab
            navigateTabs('prev');
        } else {
            // Swipe left - next tab
            navigateTabs('next');
        }
    }
}

function navigateTabs(direction) {
    const activeTab = document.querySelector('.calc-tab.active');
    const tabs = Array.from(document.querySelectorAll('.calc-tab'));
    const currentIndex = tabs.indexOf(activeTab);
    
    let newIndex;
    if (direction === 'next') {
        newIndex = (currentIndex + 1) % tabs.length;
    } else {
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    }
    
    tabs[newIndex].click();
}

function handleResize() {
    optimizeForScreenSize();
    repositionElements();
}

function optimizeForScreenSize() {
    const width = window.innerWidth;
    
    if (width < 768) {
        // Mobile optimizations
        document.body.classList.add('mobile-view');
        document.body.classList.remove('desktop-view');
        
        // Simplify complex UI elements
        simplifyUIForMobile();
    } else {
        // Desktop optimizations
        document.body.classList.add('desktop-view');
        document.body.classList.remove('mobile-view');
        
        // Restore full UI
        restoreDesktopUI();
    }
}

function simplifyUIForMobile() {
    // Hide non-essential elements on mobile
    document.querySelectorAll('.desktop-only').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show mobile-only elements
    document.querySelectorAll('.mobile-only').forEach(el => {
        el.style.display = 'block';
    });
    
    // Simplify charts for mobile
    if (chartInstance) {
        chartInstance.options.plugins.legend.position = 'bottom';
        chartInstance.update();
    }
}

function restoreDesktopUI() {
    document.querySelectorAll('.desktop-only').forEach(el => {
        el.style.display = 'block';
    });
    
    document.querySelectorAll('.mobile-only').forEach(el => {
        el.style.display = 'none';
    });
}

function repositionElements() {
    // Reposition any floating elements based on screen size
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach(el => {
        if (window.innerWidth < 768) {
            el.style.position = 'static';
            el.style.margin = '20px auto';
        } else {
            el.style.position = 'fixed';
            el.style.right = '20px';
            el.style.bottom = '20px';
        }
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize mobile enhancements
document.addEventListener('DOMContentLoaded', enhanceMobileExperience);
        
        // Export & Share
        document.getElementById('export-chart').addEventListener('click', exportChart);
        document.getElementById('share-results').addEventListener('click', shareResults);
        document.getElementById('print-results').addEventListener('click', printResults);
        document.getElementById('copy-link').addEventListener('click', copyLink);
        
        // Inflation Calculator
        document.getElementById('calculate-inflation').addEventListener('click', calculateInflation);
        
        // Investment Quiz
        document.getElementById('start-quiz').addEventListener('click', startQuiz);
        document.getElementById('learn-referral').addEventListener('click', showReferralInfo);
        
        // Update sidebar stats initially
        updateSidebarStats();
    }
    
    // Tab Switching
    function switchCalculatorTab(tabId) {
        // Update active tab
        calculatorTabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
        });
        
        // Update active content
        calcContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
        
        currentTab = tabId;
        
        // Calculate based on active tab
        switch(tabId) {
            case 'savings':
                calculateSavings();
                break;
            case 'investment':
                calculateInvestment();
                break;
            case 'comparison':
                compareStrategies();
                break;
            case 'retirement':
                calculateRetirement();
                break;
        }
    }
    
    function switchResultTab(tabId) {
        // Update active tab
        resultTabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
        });
        
        // Update active content
        resultContents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
    }
    
    // Savings Calculator Functions
    function updateSavingsSlider() {
        savingsSlider.value = monthlySavingsInput.value;
        updateSidebarStats();
    }
    
    function updateSavingsInput() {
        monthlySavingsInput.value = savingsSlider.value;
        updateSidebarStats();
    }
    
    function updatePeriodSlider() {
        periodSlider.value = savingsPeriodInput.value;
    }
    
    function updatePeriodInput() {
        savingsPeriodInput.value = periodSlider.value;
    }
    
    function updateSidebarStats() {
        const monthly = parseInt(monthlySavingsInput.value) || 0;
        const yearly = monthly * 12;
        const period = parseInt(savingsPeriodInput.value) || 1;
        
        monthlyGoalEl.textContent = `₦${monthly.toLocaleString()}`;
        yearlyTargetEl.textContent = `₦${yearly.toLocaleString()}`;
        timeToGoalEl.textContent = `${period} years`;
    }
    
    function calculateSavings() {
        const monthlySavings = parseFloat(monthlySavingsInput.value) || 0;
        const period = parseInt(savingsPeriodInput.value) || 1;
        const annualRate = parseFloat(interestRateInput.value) || 0;
        const compounding = parseInt(compoundingSelect.value) || 1;
        
        // Convert annual rate to periodic rate
        const periodicRate = annualRate / 100 / compounding;
        const totalPeriods = period * compounding;
        const periodicPayment = monthlySavings * (12 / compounding);
        
        // Calculate future value of annuity (regular contributions)
        let futureValue = 0;
        
        if (periodicRate > 0) {
            futureValue = periodicPayment * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
        } else {
            futureValue = periodicPayment * totalPeriods;
        }
        
        const totalContributions = monthlySavings * 12 * period;
        const totalInterest = futureValue - totalContributions;
        const annualGrowth = (Math.pow(futureValue / totalContributions, 1/period) - 1) * 100;
        
        // Update results
        currentResults = {
            type: 'savings',
            monthlySavings,
            period,
            annualRate,
            futureValue,
            totalContributions,
            totalInterest,
            annualGrowth,
            data: generateYearlyData(monthlySavings, period, annualRate)
        };
        
        updateResults(currentResults);
        generateChart(currentResults.data);
        updateBreakdownTable(currentResults.data);
        updateInsights(currentResults);
        updateSidebarStats();
        
        // Update projected value in sidebar
        projectedValueEl.textContent = `₦${Math.round(futureValue).toLocaleString()}`;
    }
    
    // Investment Calculator Functions
    function updateExpectedReturnBasedOnType(type) {
        let rate = 15; // Default
        
        switch(type) {
            case 'stocks': rate = 15; break;
            case 'bonds': rate = 10; break;
            case 'real-estate': rate = 20; break;
            case 'crypto': rate = 50; break;
        }
        
        expectedReturnInput.value = rate;
    }
    
    function calculateInvestment() {
        const initialInvestment = parseFloat(initialInvestmentInput.value) || 0;
        const monthlyContribution = parseFloat(monthlyContributionInput.value) || 0;
        const period = parseInt(investmentPeriodSelect.value) || 1;
        const annualRate = parseFloat(expectedReturnInput.value) || 0;
        
        // Monthly rate
        const monthlyRate = annualRate / 100 / 12;
        const totalMonths = period * 12;
        
        // Calculate future value
        let futureValue = initialInvestment * Math.pow(1 + monthlyRate, totalMonths);
        
        // Add monthly contributions
        if (monthlyRate > 0) {
            futureValue += monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
        } else {
            futureValue += monthlyContribution * totalMonths;
        }
        
        const totalContributions = initialInvestment + (monthlyContribution * totalMonths);
        const totalInterest = futureValue - totalContributions;
        const annualGrowth = (Math.pow(futureValue / totalContributions, 1/period) - 1) * 100;
        
        // Update results
        currentResults = {
            type: 'investment',
            initialInvestment,
            monthlyContribution,
            period,
            annualRate,
            futureValue,
            totalContributions,
            totalInterest,
            annualGrowth,
            data: generateYearlyDataInvestment(initialInvestment, monthlyContribution, period, annualRate)
        };
        
        updateResults(currentResults);
        generateChart(currentResults.data);
        updateBreakdownTable(currentResults.data);
        updateInsights(currentResults);
        
        // Update projected value in sidebar
        projectedValueEl.textContent = `₦${Math.round(futureValue).toLocaleString()}`;
    }
    
    // Retirement Calculator
    function calculateRetirement() {
        const currentAge = parseInt(document.getElementById('current-age').value) || 30;
        const retirementAge = parseInt(document.getElementById('retirement-age').value) || 60;
        const monthlyIncomeNeeded = parseFloat(document.getElementById('monthly-income-needed').value) || 0;
        const currentSavings = parseFloat(document.getElementById('current-savings').value) || 0;
        
        const yearsToRetirement = retirementAge - currentAge;
        const annualIncomeNeeded = monthlyIncomeNeeded * 12;
        
        // Assuming 4% withdrawal rate (common retirement planning rule)
        const retirementTarget = annualIncomeNeeded / 0.04;
        
        // Assuming 8% annual return on investments
        const annualReturn = 8;
        const monthlyReturn = annualReturn / 100 / 12;
        const totalMonths = yearsToRetirement * 12;
        
        // Calculate future value of current savings
        let futureValueCurrent = currentSavings * Math.pow(1 + monthlyReturn, totalMonths);
        
        // Calculate required monthly savings to reach target
        const targetShortfall = retirementTarget - futureValueCurrent;
        
        let requiredMonthlySavings = 0;
        if (monthlyReturn > 0) {
            requiredMonthlySavings = targetShortfall * (monthlyReturn / (Math.pow(1 + monthlyReturn, totalMonths) - 1));
        } else {
            requiredMonthlySavings = targetShortfall / totalMonths;
        }
        
        // Update results
        currentResults = {
            type: 'retirement',
            yearsToRetirement,
            retirementTarget,
            requiredMonthlySavings,
            futureValueCurrent,
            data: generateRetirementData(currentSavings, requiredMonthlySavings, yearsToRetirement, annualReturn)
        };
        
        // For now, use a simplified update
        updateResults({
            futureValue: retirementTarget,
            totalContributions: requiredMonthlySavings * 12 * yearsToRetirement,
            totalInterest: retirementTarget - (requiredMonthlySavings * 12 * yearsToRetirement),
            annualGrowth: annualReturn
        });
        
        generateChart(currentResults.data);
        
        // Special insights for retirement
        updateRetirementInsights(currentResults);
    }
    
    // Strategy Comparison
    function compareStrategies() {
        const strategyReturns = document.querySelectorAll('.strategy-return');
        const returns = Array.from(strategyReturns).map(input => parseFloat(input.value) || 0);
        
        const monthlySavings = parseFloat(monthlySavingsInput.value) || 0;
        const period = parseInt(savingsPeriodInput.value) || 1;
        
        const strategies = [
            { name: 'Conservative', rate: returns[0], color: '#00a859' },
            { name: 'Balanced', rate: returns[1], color: '#ffc107' },
            { name: 'Aggressive', rate: returns[2], color: '#dc3545' }
        ];
        
        const data = strategies.map(strategy => {
            const monthlyRate = strategy.rate / 100 / 12;
            const totalMonths = period * 12;
            
            let futureValue = 0;
            if (monthlyRate > 0) {
                futureValue = monthlySavings * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
            } else {
                futureValue = monthlySavings * totalMonths;
            }
            
            return {
                name: strategy.name,
                rate: strategy.rate,
                futureValue: futureValue,
                color: strategy.color,
                data: generateYearlyData(monthlySavings, period, strategy.rate)
            };
        });
        
        // Update comparison chart
        generateComparisonChart(data);
        
        // Update insights for comparison
        updateComparisonInsights(data);
    }
    
    // Data Generation Functions
    function generateYearlyData(monthlySavings, years, annualRate) {
        const data = [];
        let total = 0;
        let totalContributions = 0;
        
        for (let year = 1; year <= years; year++) {
            // Add contributions for the year
            const yearlyContributions = monthlySavings * 12;
            totalContributions += yearlyContributions;
            
            // Calculate interest for the year
            const interest = total * (annualRate / 100);
            total += yearlyContributions + interest;
            
            data.push({
                year,
                contributions: yearlyContributions,
                interest,
                total: total,
                cumulativeInterest: total - totalContributions
            });
        }
        
        return data;
    }
    
    function generateYearlyDataInvestment(initial, monthly, years, annualRate) {
        const data = [];
        let total = initial;
        let totalContributions = initial;
        
        for (let year = 1; year <= years; year++) {
            // Add monthly contributions for the year
            const yearlyContributions = monthly * 12;
            totalContributions += yearlyContributions;
            
            // Add contributions gradually (simplified)
            total += yearlyContributions;
            
            // Calculate interest on the total
            const interest = total * (annualRate / 100);
            total += interest;
            
            data.push({
                year,
                contributions: yearlyContributions,
                interest,
                total: total,
                cumulativeInterest: total - totalContributions
            });
        }
        
        return data;
    }
    
    function generateRetirementData(currentSavings, monthlySavings, years, annualRate) {
        const data = [];
        let total = currentSavings;
        
        for (let year = 1; year <= years; year++) {
            const yearlyContributions = monthlySavings * 12;
            const interest = total * (annualRate / 100);
            total += yearlyContributions + interest;
            
            data.push({
                year,
                contributions: yearlyContributions,
                interest,
                total: total,
                cumulativeInterest: total - (currentSavings + (yearlyContributions * year))
            });
        }
        
        return data;
    }
    
    // Results Update Functions
    function updateResults(results) {
        const formatter = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        totalContributionsEl.textContent = formatter.format(results.totalContributions);
        totalInterestEl.textContent = formatter.format(results.totalInterest);
        finalAmountEl.textContent = formatter.format(results.futureValue);
        annualGrowthEl.textContent = `${results.annualGrowth.toFixed(1)}%`;
    }
    
    function updateBreakdownTable(data) {
        breakdownTableEl.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>Year ${item.year}</td>
                <td>₦${Math.round(item.total).toLocaleString()}</td>
                <td class="positive">₦${Math.round(item.interest).toLocaleString()}</td>
                <td class="positive">₦${Math.round(item.cumulativeInterest).toLocaleString()}</td>
                <td>${(item.interest / (item.total - item.interest) * 100).toFixed(1)}%</td>
            `;
            
            breakdownTableEl.appendChild(row);
        });
    }
    
    function updateInsights(results) {
        const insights = [];
        
        insights.push({
            icon: 'fas fa-lightbulb',
            text: `With your current plan, you'll have ₦${Math.round(results.futureValue).toLocaleString()} in ${results.period} years.`
        });
        
        if (results.totalInterest > results.totalContributions) {
            insights.push({
                icon: 'fas fa-chart-line',
                text: `Your interest (₦${Math.round(results.totalInterest).toLocaleString()}) will exceed your contributions (₦${Math.round(results.totalContributions).toLocaleString()})!`
            });
        }
        
        if (results.annualGrowth > 15) {
            insights.push({
                icon: 'fas fa-rocket',
                text: `An annual growth of ${results.annualGrowth.toFixed(1)}% is excellent! Consider diversifying to maintain this rate.`
            });
        } else if (results.annualGrowth < 5) {
            insights.push({
                icon: 'fas fa-exclamation-triangle',
                text: `At ${results.annualGrowth.toFixed(1)}% growth, your savings may not beat inflation. Consider higher-yield options.`
            });
        }
        
        insights.push({
            icon: 'fas fa-calendar',
            text: `You're saving ₦${Math.round(results.monthlySavings || results.monthlyContribution).toLocaleString()} monthly. Consistency is key to reaching your goal!`
        });
        
        // Update insights list
        insightsListEl.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <i class="${insight.icon}"></i>
                <span>${insight.text}</span>
            </div>
        `).join('');
    }
    
    function updateRetirementInsights(results) {
        const insights = [];
        
        insights.push({
            icon: 'fas fa-bullseye',
            text: `To retire comfortably, you need ₦${Math.round(results.retirementTarget).toLocaleString()} saved by age ${parseInt(document.getElementById('retirement-age').value)}.`
        });
        
        insights.push({
            icon: 'fas fa-piggy-bank',
            text: `You need to save ₦${Math.round(results.requiredMonthlySavings).toLocaleString()} monthly for the next ${results.yearsToRetirement} years.`
        });
        
        if (results.requiredMonthlySavings < 0) {
            insights.push({
                icon: 'fas fa-trophy',
                text: `Great news! You're already on track for retirement with your current savings rate.`
            });
        }
        
        insights.push({
            icon: 'fas fa-chart-line',
            text: `Starting 5 years earlier could reduce your required monthly savings by up to 40%.`
        });
        
        insightsListEl.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <i class="${insight.icon}"></i>
                <span>${insight.text}</span>
            </div>
        `).join('');
    }
    
    function updateComparisonInsights(strategies) {
        const insights = [];
        
        const maxStrategy = strategies.reduce((max, strategy) => 
            strategy.futureValue > max.futureValue ? strategy : max
        );
        
        const minStrategy = strategies.reduce((min, strategy) => 
            strategy.futureValue < min.futureValue ? strategy : min
        );
        
        const difference = maxStrategy.futureValue - minStrategy.futureValue;
        
        insights.push({
            icon: 'fas fa-balance-scale',
            text: `The ${maxStrategy.name} strategy yields ₦${Math.round(difference).toLocaleString()} more than the ${minStrategy.name} strategy after ${parseInt(savingsPeriodInput.value)} years.`
        });
        
        insights.push({
            icon: 'fas fa-user-shield',
            text: `Higher returns come with higher risk. The Aggressive strategy could also have larger losses in bad years.`
        });
        
        insights.push({
            icon: 'fas fa-layer-group',
            text: `Consider blending strategies: put emergency funds in Conservative, medium-term goals in Balanced, and long-term goals in Aggressive.`
        });
        
        insightsListEl.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <i class="${insight.icon}"></i>
                <span>${insight.text}</span>
            </div>
        `).join('');
    }
    
    // Chart Functions
    function generateChart(data) {
        const ctx = growthChartCanvas.getContext('2d');
        
        // Destroy existing chart
        if (chartInstance) {
            chartInstance.destroy();
        }
        
        const labels = data.map(item => `Year ${item.year}`);
        const totals = data.map(item => item.total);
        const interests = data.map(item => item.cumulativeInterest);
        
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Value',
                        data: totals,
                        borderColor: '#6a11cb',
                        backgroundColor: 'rgba(106, 17, 203, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Interest Earned',
                        data: interests,
                        borderColor: '#00a859',
                        backgroundColor: 'rgba(0, 168, 89, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '₦' + Math.round(context.raw).toLocaleString();
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₦' + (value / 1000).toFixed(0) + 'k';
                            }
                        }
                    }
                }
            }
        });
    }
    
    function generateComparisonChart(strategies) {
        const ctx = growthChartCanvas.getContext('2d');
        
        // Destroy existing chart
        if (chartInstance) {
            chartInstance.destroy();
        }
        
        const labels = strategies[0].data.map(item => `Year ${item.year}`);
        
        const datasets = strategies.map(strategy => ({
            label: strategy.name,
            data: strategy.data.map(item => item.total),
            borderColor: strategy.color,
            backgroundColor: strategy.color + '20',
            borderWidth: 2,
            fill: false,
            tension: 0.4
        }));
        
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '₦' + Math.round(context.raw).toLocaleString();
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₦' + (value / 1000).toFixed(0) + 'k';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Utility Functions
    function exportChart() {
        if (chartInstance) {
            const link = document.createElement('a');
            link.download = 'investment-chart.png';
            link.href = growthChartCanvas.toDataURL('image/png');
            link.click();
        }
    }
    
    function shareResults() {
        if (!currentResults) return;
        
        const text = `I used NaijaWealth Calculator to plan my savings! ` +
                    `With ₦${Math.round(currentResults.monthlySavings || currentResults.monthlyContribution).toLocaleString()} monthly at ${currentResults.annualRate}%, ` +
                    `I'll have ₦${Math.round(currentResults.futureValue).toLocaleString()} in ${currentResults.period} years! ` +
                    `Try it: ${window.location.href}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Savings Plan',
                text: text,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                alert('Results copied to clipboard! Share with your friends.');
            });
        }
    }
    
    function printResults() {
        window.print();
    }
    
    function copyLink() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        });
    }
    
    function calculateInflation() {
        const amount = 1000000; // ₦1M
        const inflationRate = 15; // 15% annual inflation
        const years = 5;
        
        const futureValue = amount / Math.pow(1 + inflationRate/100, years);
        inflationValueEl.textContent = Math.round(futureValue).toLocaleString();
    }
    
    function startQuiz() {
        alert('In a full implementation, this would start an investment profile quiz. For now, check out Risevest for beginner-friendly investment options!');
        // Redirect to affiliate link
        window.open('https://risevest.com/ref/85AJQTA', '_blank');
    }
    
    function showReferralInfo() {
        alert('Earn commissions by referring friends to investment platforms! As an affiliate, you can earn 5-10% of their first year\'s fees. Contact us at affiliates@naijawealth.com to learn more.');
    }
    
    // Initialize inflation calculation
    calculateInflation();
});
